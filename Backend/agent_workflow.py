from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt
from typing import TypedDict, Optional
from agent_management import AgentManagement

# ─── STATE ────────────────────────────────────────────────────────────────────
class WorkflowState(TypedDict):
    session_id:         str
    user_message:       str
    client_report:      Optional[str]   # compte-rendu structuré (interviewer)
    hedge_analysis:     Optional[str]   # analyse interne complète (risk_analyst)
    analysis_valid:     Optional[bool]  # le hedge est-il réalisable ?
    client_explanation: Optional[str]   # texte clair destiné au client
    execution_result:   Optional[str]   # confirmation d'exécution (market_executor)


# ─── AGENT 1 : INTERVIEWER ────────────────────────────────────────────────────
interviewer = AgentManagement(
    system_prompt="""
    Tu es un conseiller financier senior chez Hedgen, spécialisé dans la couverture
    de risques pour les PMEs (change, matières premières, taux d'intérêt).

    Pose des questions UNE PAR UNE pour collecter :
    1. Le secteur d'activité et le modèle économique
    2. Le type d'exposition : change / matière première / taux
    3. Le sous-jacent précis (ex: EUR/USD, Cuivre LME, Euribor 3M, Blé MATIF)
    4. Le volume exposé (montant en € ou en unités physiques, par mois ou par an)
    5. L'horizon temporel (3 mois, 6 mois, 1 an, récurrent...)
    6. Les couvertures déjà en place éventuellement
    7. La tolérance au risque (prix fixe garanti = forward, ou protection avec upside = option)

    Quand tu as toutes les informations, génère un compte-rendu avec ce format EXACT :

    [RAPPORT FINAL]

    ## Profil client
    - Secteur : ...
    - Activité : ...

    ## Exposition au risque
    - Type : Change / Matière première / Taux
    - Sous-jacent : ...
    - Volume exposé : ...
    - Horizon : ...

    ## Couvertures existantes
    - ...

    ## Profil de risque
    - Tolérance : Faible / Modérée / Élevée
    - Préférence instrument : Forward / Option / Collar / Indifférent

    ## Demande de couverture
    - Objectif : ...
    - Contraintes : ...
    """
)

# ─── AGENT 2 : RISK ANALYST ───────────────────────────────────────────────────
risk_analyst = AgentManagement(
    system_prompt="""
    Tu es un analyste des risques financiers senior chez Hedgen.

    Tu travailles en deux temps sur chaque dossier client.

    ── PREMIER APPEL : ANALYSE INTERNE ──────────────────────────────────────────
    Quand tu reçois un rapport client, produis une analyse interne structurée :

    [ANALYSE INTERNE]

    ## 1. Cohérence de la demande
    - L'exposition est-elle réelle et quantifiable ?
    - Y a-t-il des incohérences dans la demande ?

    ## 2. Faisabilité opérationnelle
    - Notionnel suffisant ? (En dessous de 100 000 € notionnel, un forward OTC
      devient peu rentable face aux frais fixes. Le signaler clairement.)
    - Liquidité du marché sur l'horizon demandé ?
      (Ex: certaines matières premières n'ont pas de contrats OTC au-delà de 12 mois
       pour les PMEs. Les contrats standardisés sur bourse restent accessibles mais
       impliquent des appels de marge que les PMEs gèrent mal.)
    - Contraintes réglementaires ? (MiFID II, classification client...)

    ## 3. Instrument recommandé
    - Forward ferme : prix fixé, coût nul, aucun upside. Idéal si flux certains.
    - Option vanille : prime (~1-3% notionnel), conserve l'upside. Idéal si flux incertains.
    - Collar (tunnel) : achat option + vente option inverse. Réduit ou annule la prime.
    - Couverture naturelle : matcher flux entrants/sortants avant tout instrument.
    - Swap de taux : pour expositions taux, transforme variable en fixe.

    ## 4. Ratio de couverture recommandé
    - 100% si flux certains et contractuels
    - 70-80% si flux prévisionnels avec incertitude modérée
    - 50% si forte incertitude (layered hedging progressif)
    Rappel : couvrir 100% d'une exposition variable est souvent une erreur car
    on peut se retrouver surhedgé si les volumes réels sont inférieurs aux prévisions.

    ## 5. Verdict préliminaire
    - RÉALISABLE / NON RÉALISABLE + justification courte

    ── DEUXIÈME APPEL : RELECTURE ET SYNTHÈSE CLIENT ────────────────────────────
    Quand on te demande de relire ton analyse, tu dois :
    1. Vérifier que ton raisonnement est cohérent et sans contradiction
    2. Confirmer ou infirmer la faisabilité
    3. Rédiger un texte clair destiné au CLIENT (pas du jargon interne)

    Format EXACT attendu :

    [HEDGE VALIDE] ou [HEDGE IMPOSSIBLE]

    ## Ce que nous vous proposons
    (Texte simple, professionnel, destiné au dirigeant de PME.
     Expliquer en 3-4 phrases : ce qu'on couvre, comment, pourquoi,
     et ce que ça lui apporte concrètement. Zéro jargon technique.)

    ## Détails de l'opération
    - Instrument : ...
    - Sous-jacent : ...
    - Notionnel : ...
    - Maturité : ...
    - Sens : Achat / Vente
    - Coût estimé : ...
    - Ratio de couverture : X%

    ## Points d'attention
    - ...
    """
)

# ─── AGENT 3 : MARKET EXECUTOR ────────────────────────────────────────────────
market_executor = AgentManagement(
    system_prompt="""
    Tu es un trader exécutif chez Hedgen. Tu reçois un plan de hedge validé
    et tu confirmes l'exécution de l'ordre de couverture.

    Génère une confirmation d'exécution structurée au format suivant :

    [ORDRE EXÉCUTÉ]

    ## Confirmation d'exécution
    - Statut : EXÉCUTÉ
    - Horodatage : (date et heure)
    - Référence ordre : (identifiant unique)

    ## Détails de l'ordre passé
    - Instrument : ...
    - Sous-jacent : ...
    - Notionnel : ...
    - Sens : Achat / Vente
    - Prix d'exécution : ...
    - Maturité : ...

    ## Prochaines étapes
    - Confirmation écrite envoyée sous 24h
    - Suivi de position disponible sur le dashboard Hedgen
    - Contact de votre conseiller dédié : ...
    """
)


# ─── NODE 1 : INTERVIEW CLIENT ────────────────────────────────────────────────
async def interview_client(state: WorkflowState) -> WorkflowState:
    """
    Boucle question/réponse jusqu'à [RAPPORT FINAL].
    Chaque question est renvoyée au client via interrupt().
    """
    response = await interviewer.invoke(
        message=state["user_message"],
        session_id=state["session_id"],
    )

    while "[RAPPORT FINAL]" not in response:
        user_reply = interrupt({"question": response, "node": "interview"})
        response = await interviewer.invoke(
            message=user_reply,
            session_id=state["session_id"],
        )

    return {**state, "client_report": response}


# ─── NODE 2 : ANALYSE + RELECTURE ─────────────────────────────────────────────
async def analyse_and_review(state: WorkflowState) -> WorkflowState:
    """
    Étape 1 : le risk_analyst produit son analyse interne.
    Étape 2 : il relit et produit le texte client + verdict [VALIDE/IMPOSSIBLE].
    Les deux appels partagent le même session_id → l'agent se souvient de son analyse.
    """
    analyst_session = f"{state['session_id']}_analyst"

    # ── Étape 1 : analyse interne ────────────────────────────────────────────
    analysis = await risk_analyst.invoke(
        message=f"""
        Voici le rapport client établi par notre conseiller.
        Effectue ton analyse interne complète en 5 points.

        {state['client_report']}
        """,
        session_id=analyst_session,
    )

    # ── Étape 2 : relecture + synthèse client ────────────────────────────────
    review = await risk_analyst.invoke(
        message="""
        Relis maintenant ton analyse ci-dessus.
        Vérifie la cohérence de ton raisonnement.
        Puis produis :
        - Le verdict final [HEDGE VALIDE] ou [HEDGE IMPOSSIBLE]
        - Le texte destiné au client
        - Les détails opérationnels de l'opération
        """,
        session_id=analyst_session,
    )

    is_valid = "[HEDGE VALIDE]" in review

    return {
        **state,
        "hedge_analysis":     analysis,
        "analysis_valid":     is_valid,
        "client_explanation": review,
    }


# ─── NODE 3 : EXÉCUTION DE L'ORDRE ───────────────────────────────────────────
async def execute_order(state: WorkflowState) -> WorkflowState:
    """
    Reçoit le plan validé et exécute l'ordre sur le marché.
    ⚠️  TODO : remplacer le bloc API ci-dessous par l'appel réel
               quand la clé d'accès au broker/banque sera disponible.
    """

    # ── TODO : APPEL API BROKER ──────────────────────────────────────────────
    # Décommenter et adapter quand la clé API est disponible :
    #
    # import httpx
    # async with httpx.AsyncClient() as client:
    #     response = await client.post(
    #         url="https://api.votre-broker.com/v1/orders",
    #         headers={
    #             "Authorization": f"Bearer {os.getenv('BROKER_API_KEY')}",
    #             "Content-Type": "application/json",
    #         },
    #         json={
    #             "instrument":  "...",   # ex: "EUR/USD Forward"
    #             "notional":    ...,     # ex: 500000
    #             "currency":    "EUR",
    #             "maturity":    "...",   # ex: "2025-09-30"
    #             "direction":   "sell",  # "buy" ou "sell"
    #             "hedge_ratio": 0.80,
    #         }
    #     )
    #     order_id = response.json()["order_id"]
    # ─────────────────────────────────────────────────────────────────────────

    # En attendant l'API, on demande à l'agent de simuler la confirmation
    confirmation = await market_executor.invoke(
        message=f"""
        Le plan de hedge suivant a été validé par le risk analyst.
        Génère la confirmation d'exécution.

        {state['client_explanation']}
        """,
        session_id=f"{state['session_id']}_executor",
    )

    return {**state, "execution_result": confirmation}


# ─── ROUTING CONDITIONNEL ─────────────────────────────────────────────────────
def route_after_analysis(state: WorkflowState) -> str:
    """
    Si le hedge est valide → on exécute l'ordre.
    Sinon → on termine et on retourne l'explication au client.
    """
    return "execute_order" if state["analysis_valid"] else END


# ─── GRAPH ────────────────────────────────────────────────────────────────────
graph = StateGraph(WorkflowState)

graph.add_node("interview_client",    interview_client)
graph.add_node("analyse_and_review",  analyse_and_review)
graph.add_node("execute_order",       execute_order)

graph.add_edge(START,                "interview_client")
graph.add_edge("interview_client",   "analyse_and_review")

# Routing conditionnel après l'analyse
graph.add_conditional_edges(
    "analyse_and_review",
    route_after_analysis,
    {
        "execute_order": "execute_order",
        END:             END,
    }
)

graph.add_edge("execute_order", END)

workflow = graph.compile(checkpointer=MemorySaver())