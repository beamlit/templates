import { logger, wrapAgent } from "@beamlit/sdk";
import { FastifyRequest } from "fastify";

const websocketHandler = async (
  ws: WebSocket,
  request: FastifyRequest,
  args: any
) => {
  const { agent, functions } = args;
  logger.info("Websocket connected, request: ", request);

  agent.bindTools(functions);
  await agent.connect(ws, ws.send.bind(ws));
  ws.onclose = () => {
    logger.info("Websocket closed");
  };
};

export const agent = async () => {
  return wrapAgent(websocketHandler, {
    agent: {
      metadata: {
        name: "{{.ProjectName}}",
      },
      spec: {
        model: "{{.Model}}",
        description: "{{.ProjectDescription}}",
      },
    },
  });
};
