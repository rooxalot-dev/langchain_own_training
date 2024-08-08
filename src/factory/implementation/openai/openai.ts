import "dotenv/config";
import { ChatOpenAI, OpenAIChatInput } from "@langchain/openai"
import { type BaseChatModelParams } from "@langchain/core/language_models/chat_models";

type OpenAIConstructorType = Partial<OpenAIChatInput> & BaseChatModelParams;

export const openAIFactory = (config?: OpenAIConstructorType) => {
  const defaultConfig: OpenAIConstructorType = {
    model: process.env.OPENAI_MODEL,
    temperature: 0.5,
    verbose: true,
  };

  const model = new ChatOpenAI({ ...defaultConfig, ...config });
  return model;
}
