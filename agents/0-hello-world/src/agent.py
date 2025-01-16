import uuid
from typing import Union

from beamlit.agents import agent
from fastapi import Request
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.tools import BaseTool
from langgraph.graph.graph import CompiledGraph


@agent(
    agent={
        "metadata": {
            "name": "{{.ProjectName}}",
        },
        "spec": {
            "model": "{{.Model}}",
            "description": "{{.ProjectDescription}}",
        },
    }
)
async def main(
    agent: Union[None, CompiledGraph],
    model: Union[None, BaseChatModel],
    functions: list[BaseTool],
    request: Request,
    **_,
):
    body = await request.json()
    agent_config = {"configurable": {"thread_id": str(uuid.uuid4())}}
    if body.get("inputs"):
        body["input"] = body["inputs"]

    agent_body = {"messages": [("user", body["input"])]}
    responses = []

    async for chunk in agent.astream(agent_body, config=agent_config):
        responses.append(chunk)
    content = responses[-1]
    return content["agent"]["messages"][-1].content
