import 'dotenv/config';
import * as z from 'zod';
import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from "@langchain/core/output_parsers";

export const languageZodSchema = z.string().describe(`User's question native tongue language.`);
export const languageStructuredOutputParser = StructuredOutputParser.fromZodSchema(languageZodSchema);

export const getQuestionLanguageChain = (model: BaseLanguageModel) => {
  const findUserLanguageTemplate = ChatPromptTemplate.fromTemplate(`
    Based on the user's question below, inform the native tongue used.
    Inform the language in lowercase with the ISO 639-1 standard code.
    Do NOT answer anything besides the language.
    User's question: {input},
    Formatting instructions: {format_instructions}
    language:
  `);

  // Language chain
  const chain = findUserLanguageTemplate
    .pipe(model)
    .pipe(languageStructuredOutputParser);

  return chain;
}
