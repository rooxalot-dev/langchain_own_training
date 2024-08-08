import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { Calculator } from "@langchain/community/tools/calculator";

import { openAIFactory } from "../factory/implementation/openai/openai";
import { getDbInfoTools, getLanguageTool, pythonExecutorTool } from "../tools";

export const getChatbotAgent = async () => {
  // Available tools that should be used automatically by the AI model
  const availableTools = [
    new Calculator(),
    getLanguageTool(),
    (await pythonExecutorTool()),
    ...(await getDbInfoTools()),
  ];

  const model = openAIFactory();

  const agentPrompt = ChatPromptTemplate.fromMessages([
    ["system", "You are very powerful and very helpful assistant"],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    prompt: agentPrompt,
    tools: availableTools,
  });

  const chatbotAgentExecutor = new AgentExecutor({
    agent,
    tools: availableTools,
  });

  return chatbotAgentExecutor;
};
