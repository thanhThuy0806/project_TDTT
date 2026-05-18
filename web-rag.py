from langchain_community.utilities import SearxSearchWrapper
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain.agents import create_agent
from langchain_ollama.chat_models import ChatOllama
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from langchain.agents import create_agent
import asyncio
# intergrate search tool
@tool
def search_tool(query: str):
    """
    Always use this to retrieve real time data on Internet before response
    this is an integrated meta search engine to help LLM retrieves real time data
    """
    # integrate searxng
    s = SearxSearchWrapper(searx_host="http://localhost:8888")
    return s.run(query=query)

def search(query: str):
    """
    Always use this function to retrieve real time data on Internet before response
    this is an integrated meta search engine to help LLM retrieves real time data
    """
    # integrate searxng
    s = SearxSearchWrapper(searx_host="http://localhost:8888")
    return s.run(query=query)
# load model
llm = ChatOllama(model="Gemma4:E2B",
                   temperature=0,      # for a small potion of creativity
                )
agent = create_agent(llm, tools=[search_tool])

async def run_chat():
    query = 'Lịch sử Vercel bị tấn công'
    inputs = {"messages": [("user", query)]}
    
    # Chạy vòng lặp Agent
    async for event in agent.astream(inputs, stream_mode="values"):
        message = event["messages"][-1]
        if hasattr(message, "content") and message.content:
            print(f"Assistant: {message.content}")

if __name__ == '__main__':
    asyncio.run(run_chat())
    print('\n\nDone!!')