import { ChatOpenAI, OpenAIChatInput } from "@langchain/openai"
import { type BaseChatModelParams } from "@langchain/core/language_models/chat_models";

type OpenAIConstructorType = Partial<OpenAIChatInput> & BaseChatModelParams;

export const openAIFactory = (config?: OpenAIConstructorType) => {
  const defaultConfig: OpenAIConstructorType = {
    model: "gpt-3.5-turbo",
    temperature: 0.7,
  };

  const model = new ChatOpenAI({ ...defaultConfig, ...config});
  return model;
}
