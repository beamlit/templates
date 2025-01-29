import uuid

from beamlit.agents import agent, get_default_thread
from customfunctions.helloworld import helloworld
from fastapi import Request
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from beamlit.functions import get_functions
{{ if ne .Model "" }}
from beamlit.agents import get_chat_model
{{ else }}
from langchain_openai import ChatOpenAI
{{ end }}

memory = MemorySaver()
{{ if ne .Model "" }}
model = get_chat_model("{{.Model}}")
{{ else }}
model = ChatOpenAI()
{{ end }}
functions = get_functions(warning=False)
functions.append(helloworld)
custom_agent = create_react_agent(model, tools=functions, checkpointer=memory)

@agent(
    override_agent=custom_agent,
    agent={
        "metadata": {
            "name": "{{.ProjectName}}",
        },
        "spec": {
            "description": "{{.ProjectDescription}}",
        },
    },
)
async def main(request: Request):
    body = await request.json()
    thread_id = get_default_thread(request) or str(uuid.uuid4())
    agent_config = {"configurable": {"thread_id": thread_id}}
    if body.get("inputs"):
        body["input"] = body["inputs"]

    agent_body = {"messages": [("user", body["input"])]}
    responses = []

    async for chunk in custom_agent.astream(agent_body, config=agent_config):
        responses.append(chunk)
    content = responses[-1]
    return content["agent"]["messages"][-1].content