import uuid

from beamlit.agents import agent
from customfunctions.helloworld import helloworld
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent

chat = ChatOpenAI()
memory = MemorySaver()
custom_agent = create_react_agent(chat, tools=[helloworld], checkpointer=memory)

@agent(agent=custom_agent)
async def main(agent, chat_model, tools, body, headers=None, query_params=None, **_):
    if len(tools) > 0:
        agent.bind_tools(tools)
    agent_config = {"configurable": {"thread_id": str(uuid.uuid4())}}
    if body.get("inputs"):
        body["input"] = body["inputs"]

    agent_body = {"messages": [("user", body["input"])]}
    responses = []

    async for chunk in agent.astream(agent_body, config=agent_config):
        responses.append(chunk)
    content = responses[-1]
    return content["agent"]["messages"][-1].content
