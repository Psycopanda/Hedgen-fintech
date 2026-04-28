from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_mistralai import ChatMistralAI
from dotenv import load_dotenv
import os

load_dotenv()

class AgentManagement:
    def __init__(self, system_prompt: str, tools: list = None):
        llm = ChatMistralAI(
            model_name="mistral-large-latest",
            temperature=0.5,
            api_key=os.getenv("MISTRAL_API_KEY"),
        )

        tools = tools or []

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
            MessagesPlaceholder("agent_scratchpad"),
        ])

        agent = create_tool_calling_agent(llm, tools, prompt)
        executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

        self._sessions: dict[str, ChatMessageHistory] = {}

        self.agent = RunnableWithMessageHistory(
            executor,
            self._get_session_history,
            input_messages_key="input",
            history_messages_key="chat_history",
        )

    def _get_session_history(self, session_id: str) -> ChatMessageHistory:
        if session_id not in self._sessions:
            self._sessions[session_id] = ChatMessageHistory()
        return self._sessions[session_id]

    async def invoke(self, message: str, session_id: str) -> str:
        response = await self.agent.ainvoke(
            {"input": message},
            config={"configurable": {"session_id": session_id}},
        )
        return response["output"]