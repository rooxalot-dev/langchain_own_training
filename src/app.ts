import 'dotenv/config';
import * as z from 'zod';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';

import { openAIFactory } from "./factory/openai";

// - Receber o input/query do usuário;
// - identificar a linguagem da pergunta do usuário;
// - Pesquisar em base vetorizada se há informação relevante para contextualização;
// - Caso não haja documentos relevantes, realizar pesquisa na internet por conteúdo relevante;
// - Salvar o conteúdo recuperado em base vetorizada;
// - Retornar resposta;

const app = async () => {
  const model = openAIFactory();

  const findUserLanguageTemplate = ChatPromptTemplate.fromTemplate(`
    Based on the user's question below, inform the native tongue used. Do NOT answer anything besides the language.
    User's question: {question},
    Formatting instructions: {format_instructions}
    language:
  `);

  const userChatTemplate = ChatPromptTemplate.fromTemplate(`
    You're a helpful AI assistant. Based on the provided context and conversation, answer the user's question.
    Answer the user's question in the following language: {language}

    Chat history: {chat_history}

    Context: {context}

    User's question: {input}
  `);


  // Language chain
  const languageZodSchema = z.object({ language: z.string().describe(`User's question native tongue language.`) });
  const structuredOutputParser = StructuredOutputParser.fromZodSchema(languageZodSchema);
  const findUserLanguageChain = findUserLanguageTemplate
    .pipe(model)
    .pipe(structuredOutputParser);


  const runnable = RunnableSequence.from([
    {
      question: new RunnablePassthrough(),

    },
    (input) => ({
      question: input.question.input,
      format_instructions: structuredOutputParser.getFormatInstructions(),
    }),
    findUserLanguageChain
  ]);

  const response = await runnable.invoke({ input: 'Olá!!' });
  console.log('response:', response);
};

app();
