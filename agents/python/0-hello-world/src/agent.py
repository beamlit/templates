import uuid
from typing import Union

from blaxel.agents import agent, get_default_thread
from fastapi import Request
from langgraph.graph.graph import CompiledGraph


@agent(
    agent={
        "metadata": {
            "name": "{{.ProjectName}}",
        },
        "spec": {
            "model": "{{.Model}}",
            "prompt": "{{.ProjectPrompt}}",
        },
    }
)
async def main(request: Request, agent: Union[None, CompiledGraph]):
    body = await request.json()
    thread_id = get_default_thread(request) or str(uuid.uuid4())
    agent_config = {"configurable": {"thread_id": thread_id}}
    if body.get("inputs"):
        body["input"] = body["inputs"]

    agent_body = {"messages": [("user", body["input"])]}
    responses = []

    async for chunk in agent.astream(agent_body, config=agent_config):
        responses.append(chunk)
    content = responses[-1]
    return content["agent"]["messages"][-1].content
