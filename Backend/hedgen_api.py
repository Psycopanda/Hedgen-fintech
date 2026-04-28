from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import uuid4
from agent_workflow import workflow, WorkflowState
from langgraph.types import Command

app = FastAPI(title="Hedgen API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── SCHEMAS ──────────────────────────────────────────────────────────────────
class MessageRequest(BaseModel):
    message:    str
    session_id: str | None = None

class MessageResponse(BaseModel):
    session_id:  str
    reply:       str
    node:        str    # "interview" | "analysis" | "execution" | "done" | "impossible"
    finished:    bool

# ─── HELPER : récupère l'interrupt via aget_state ─────────────────────────────
async def get_interrupt(config: dict) -> dict | None:
    """
    ✅ Correction : on utilise aget_state() pour lire les interrupts actifs.
    result.tasks n'existe pas sur un dict — c'était le bug principal.
    """
    state_snapshot = await workflow.aget_state(config)
    for task in state_snapshot.tasks:
        if task.interrupts:
            return task.interrupts[0].value
    return None

# ─── ROUTE PRINCIPALE ─────────────────────────────────────────────────────────
@app.post("/chat", response_model=MessageResponse)
async def chat(req: MessageRequest):
    session_id = req.session_id or str(uuid4())
    config = {"configurable": {"thread_id": session_id}}

    try:
        if not req.session_id:
            # ── Nouvelle conversation ──────────────────────────────────────
            # ✅ Correction : dict littéral, pas TypedDict(...)
            initial_state: WorkflowState = {
                "session_id":         session_id,
                "user_message":       req.message,
                "client_report":      None,
                "hedge_analysis":     None,
                "analysis_valid":     None,
                "client_explanation": None,
                "execution_result":   None,
            }
            await workflow.ainvoke(initial_state, config=config)
        else:
            # ── Réponse à un interrupt (conversation en cours) ─────────────
            await workflow.ainvoke(Command(resume=req.message), config=config)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # ── Le graph est-il en pause sur un interrupt ? ────────────────────────
    interrupted = await get_interrupt(config)
    if interrupted:
        return MessageResponse(
            session_id=session_id,
            reply=interrupted["question"],
            node=interrupted["node"],
            finished=False,
        )

    # ── Le graph est terminé : on lit le state final ───────────────────────
    final_snapshot = await workflow.aget_state(config)
    final = final_snapshot.values

    # Hedge impossible → on retourne l'explication de refus
    if not final.get("analysis_valid"):
        return MessageResponse(
            session_id=session_id,
            reply=final.get("client_explanation", "Ce hedge n'est pas réalisable."),
            node="impossible",
            finished=True,
        )

    # Hedge exécuté → on retourne la confirmation
    return MessageResponse(
        session_id=session_id,
        reply=final.get("execution_result", ""),
        node="done",
        finished=True,
    )

@app.get("/health")
def health():
    return {"status": "ok"}