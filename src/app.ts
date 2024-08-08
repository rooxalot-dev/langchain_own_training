import 'dotenv/config';
import * as z from 'zod';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough, } from '@langchain/core/runnables';

import { openAIFactory } from "./factory/implementation/openai/openai";
import { getQuestionLanguageChain, languageStructuredOutputParser } from './chains/language.chain';
import { getVectorStoreContextInfoChain } from './chains/get-vectorestore-context-info.chain';
import { getSupabaseVectorStore } from './vectorestores/implementation/supabase/supabase';
import { getPostgresDatasource } from './db/postgres/sql.database';
import { dbAccessChain } from './chains/db-query.chain';
import { getDbAgent, invokeDbAgent } from './agents/db.agent';

// - Receber o input/query do usuário;
// - identificar a linguagem da pergunta do usuário;
// - Pesquisar em base vetorizada se há informação relevante para contextualização;
// - Caso não haja documentos relevantes, realizar pesquisa na internet por conteúdo relevante;
// - Salvar o conteúdo recuperado em base vetorizada;
// - Retornar resposta na lingua do usuário;

const app = async () => {
  const model = openAIFactory({ });
  const vectorStore = await getSupabaseVectorStore();
  const retriever = await vectorStore.asRetriever();

  // const testRetrieverReponse = await retriever.invoke('');
  // console.log('testRetrieverReponse', testRetrieverReponse);

  // const languageChain = getQuestionLanguageChain(model);
  // const vectorStoreContextInfoChain = await getVectorStoreContextInfoChain(model, retriever);

  // const runnable = RunnableSequence.from([
  //   (prevInput) => ({
  //     input: prevInput.question,
  //     format_instructions: languageStructuredOutputParser.getFormatInstructions(),
  //   }),
  //   // With this method below, we can always send the current runnable response to the overall sequence
  //   // Making it possible to access the original unchanged inputs since the first call
  //   RunnablePassthrough.assign({
  //     language: languageChain,
  //   }),
  //   RunnablePassthrough.assign({
  //     availableContext: vectorStoreContextInfoChain
  //   })
  // ]);

  // const response = await runnable.invoke({ question: 'Hello, how are you?' });
  // console.log('response:', response);

  const dbQueryChain = await dbAccessChain(model, true);

  const answerPrompt = PromptTemplate.fromTemplate(`
    Given the following user question, corresponding SQL query, and SQL result, answer the user question.
    Question: {question}
    SQL Result: {result}
    Answer: `
  );

  const runnable = RunnableSequence.from([
    RunnablePassthrough.assign({ question: (input) => input.question }),
    RunnablePassthrough.assign({
      result: async (input) => await dbQueryChain.invoke({ question: input.question })
    }),
    answerPrompt,
    model,
    new StringOutputParser(),
  ]);

  const dbAgent = await getDbAgent(model);
  //dbAgent.verbose = true;

  const dbChainResponse = await invokeDbAgent(model, `
      Responda a seguinte pergunta: Quantos pedidos foram criados para o Brasil no ano de 1996? Liste a quantidade de pedidos pelo nome do cliente e endereço do mesmo
    `);

  console.log('invokeDbAgent', dbChainResponse.output);
};

app();
