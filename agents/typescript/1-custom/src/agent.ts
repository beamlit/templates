import { getChatModel, getDefaultThread, getFunctions, wrapAgent } from "@beamlit/sdk";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage } from "@langchain/core/messages";
import { CompiledGraph, MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { FastifyRequest } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { helloworld } from "./customfunctions/helloworld";
{{ if eq .Model "" }}
{{ end }}


type InputType = {
  inputs: string | null;
  input: string | null;
};

type AgentType = {
  agent: CompiledGraph<any, any, any, any, any, any>;
};

const handleRequest = async (request: FastifyRequest, args: AgentType) => {
  const { agent } = args;
  const body = (await request.body) as InputType;
  const thread_id = getDefaultThread(request) || uuidv4();
  const input = body.inputs || body.input || "";
  const responses: any[] = [];

  const stream = await agent.stream(
    { messages: [new HumanMessage(input)] },
    { configurable: { thread_id } }
  );

  for await (const chunk of stream) {
    responses.push(chunk);
  }
  const content = responses[responses.length - 1];
  return content.agent.messages[content.agent.messages.length - 1].content;
};

export const agent = async () => {
  const functions = await getFunctions();
  functions.push(helloworld);
  {{ if ne .Model "" }}
  const model = await getChatModel("{{.Model}}") as BaseChatModel<any, any>;
  {{ else }}
  const model = new ChatOpenAI()
  {{ end }}
  return wrapAgent(handleRequest, {
    agent: {
      metadata: {
        name: "{{.ProjectName}}",
      },
      spec: {
        description: "{{.ProjectDescription}}",
      },
    },
    overrideAgent: createReactAgent({
      llm: model,
      tools: functions,
      checkpointSaver: new MemorySaver(),
    }),
  });
};
