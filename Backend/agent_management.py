from langchain.agents import create_agent
from langchain_mistralai import ChatMistralAI
from dotenv import load_dotenv
import os

class AgentManagement():
    def __init__(self, tools = None, system_prompt = None):

        load_dotenv()

        API_KEY = os.getenv("MISTRAL_API_KEY")
        llm = ChatMistralAI(
            
            model_name="mistral-large-latest",
            temperature=0.5,
            api_key=API_KEY
        )
        self.tools = tools
        self.system_prompt = system_prompt
        self.agent = create_agent(llm,tools, system_prompt)
    
    async def invoke_agent(self, message):
        response = await self.agent.invoke(message)
        return response


