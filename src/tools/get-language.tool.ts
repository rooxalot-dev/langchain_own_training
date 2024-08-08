import { z } from 'zod';
import { tool } from "@langchain/core/tools";

import { getQuestionLanguageChain, languageStructuredOutputParser } from "../chains/language.chain";
import { openAIFactory } from "../factory/implementation/openai/openai";

export const getLanguageTool = () => {
  const model = openAIFactory();
  const languageChain = getQuestionLanguageChain(model);

  const languageToolSchema = z.object({
    input: z.string().describe("The language of the query")
  })

  const languageInfoTool = tool(
    async ({ input }) => {
      const language = await languageChain.invoke({
        input,
        format_instructions: languageStructuredOutputParser.getFormatInstructions()
      });
      return language;
    },
    {
      name: 'get_input_language',
      description: `
        Given the user's input, if the language was not obtained yet, get the message's native language and return it in ISO 639-1 standard code.
        If this function was already executed and the language was already obtained, do not execute it again.
      `,
      schema: languageToolSchema,
    }
  );

  return languageInfoTool;
};
