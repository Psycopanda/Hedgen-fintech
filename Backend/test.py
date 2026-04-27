from langchain_mistralai import ChatMistralAI
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("MISTRAL_API_KEY")
llm = ChatMistralAI(
        
        model_name="mistral-large-latest",
        temperature=0.5,
        api_key=API_KEY
    )

messages = [
    (
        "system",
        "You are a helpful assistant that translates English to French. Translate the user sentence.",
    ),
    ("human", "I love programming."),
]

print(llm.invoke(messages))