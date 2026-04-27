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
    interviewer_agent =AgentManagement

def analyse_needs_to_hedge(state: WorkflowState):
    

graph.add_node(understand_client_needs)
graph.add_node(analyse_needs_to_hedge)