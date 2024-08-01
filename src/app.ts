import 'dotenv/config';
import * as z from 'zod';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';

import { openAIFactory } from "./factory/implementation/openai/openai";
import { getQuestionLanguageChain, structuredOutputParser } from './chains/language.chain';

// - Receber o input/query do usuário;
// - identificar a linguagem da pergunta do usuário;
// - Pesquisar em base vetorizada se há informação relevante para contextualização;
// - Caso não haja documentos relevantes, realizar pesquisa na internet por conteúdo relevante;
// - Salvar o conteúdo recuperado em base vetorizada;
// - Retornar resposta;

const app = async () => {
  const model = openAIFactory();

  const languageChain = getQuestionLanguageChain(model);
  const runnable = RunnableSequence.from([
    {
      question: new RunnablePassthrough(),
    },
    (input) => ({
      question: input.question.input,
      format_instructions: structuredOutputParser.getFormatInstructions(),
    }),
    languageChain,
  ]);

  const response = await runnable.invoke({ input: 'Hello, how are you?' });
  console.log('response:', response);
};

app();
