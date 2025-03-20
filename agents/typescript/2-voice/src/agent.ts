import { logger, wrapAgent } from "@blaxel/sdk";
import { FastifyRequest } from "fastify";

const prompt = `You are a helpful voice assistant designed to engage in natural conversations while providing accurate and timely responses.

Key behaviors:
1. Always acknowledge user requests immediately before using any tools
2. Maintain a conversational and friendly tone
3. Keep responses concise and focused
4. If using tools, explain what you're doing
5. Break down complex information into digestible parts
6. Ask for clarification when needed

Remember to:
- Respond promptly to maintain natural conversation flow
- Use appropriate verbal acknowledgments
- Stay within your knowledge boundaries
- Be transparent about actions you're taking
`;

const websocketHandler = async (
  ws: WebSocket,
  request: FastifyRequest,
  args: any
) => {
  const { agent, functions } = args;
  logger.info(`Websocket connected`);

  agent.bindTools(functions);
  agent.bindPrompt(prompt);
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
        prompt,
      },
    },
  });
};
