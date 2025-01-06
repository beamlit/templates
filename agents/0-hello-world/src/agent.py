import uuid

from beamlit.agents import agent


@agent(
    agent={
        "metadata": {
            "name": "{{.ProjectName}}",
            "description": "{{.ProjectDescription}}",
        },
        "spec": {
            "model": "{{.Model}}",
        },
    }
)
async def main(agent, chat_model, tools, body, headers=None, query_params=None, **_):
    agent_config = {"configurable": {"thread_id": str(uuid.uuid4())}}
    if body.get("inputs"):
        body["input"] = body["inputs"]

    agent_body = {"messages": [("user", body["input"])]}
    responses = []

    async for chunk in agent.astream(agent_body, config=agent_config):
        responses.append(chunk)
    content = responses[-1]
    return content["agent"]["messages"][-1].content
