from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Optional
from langchain_mistralai import ChatMistralAI
from agent_management import AgentManagement

class WorkflowState(TypedDict):
    client_id: Optional[str]
    client_context: Optional[str]

graph = StateGraph(WorkflowState)


# Nodes creation
def understand_client_needs(state: WorkflowState) -> WorkflowState:
    interviewer_agent = AgentManagement(system_prompt="Tu dois comprendre les besoins de l'entreprise ainsi que ce qu'il fait.")
    return state

def analyse_needs_to_hedge(state: WorkflowState):
    risk_analyst_agent = AgentManagement(system_prompt="Tu dois analyser les risques d'un tel hedging")
    return state

def give_market_orders(state: WorkflowState):
    market_agent = AgentManagement(system_prompt="Tu dois prendre des ordres en fonction ce que les agents précédents ont déterminés")
    return state
    

graph.add_node(understand_client_needs)
graph.add_node(analyse_needs_to_hedge)
graph.add_node(give_market_orders)

graph.add_edge(START, "understand_client_needs")
graph.add_edge("understand_client_needs", "analyse_needs_to_hedge")
graph.add_edge("analyse_needs_to_hedge", "give_market_orders")
graph.add_edge("give_market_orders", END)

agent_workflow = graph.compile()