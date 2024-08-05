import 'dotenv/config';
import * as z from 'zod';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough, } from '@langchain/core/runnables';

import { openAIFactory } from "./factory/implementation/openai/openai";
import { getQuestionLanguageChain, structuredOutputParser } from './chains/language.chain';
import { getVectorStoreContextInfoChain } from './chains/get-vectorestore-context-info.chain';
import { getSupabaseVectorStore } from './vectorestores/implementation/supabase/supabase';
import { getPostgresDatasource } from './db/postgres/datasource';
import { dbAccessChain } from './chains/db-query.chain';

// - Receber o input/query do usuário;
// - identificar a linguagem da pergunta do usuário;
// - Pesquisar em base vetorizada se há informação relevante para contextualização;
// - Caso não haja documentos relevantes, realizar pesquisa na internet por conteúdo relevante;
// - Salvar o conteúdo recuperado em base vetorizada;
// - Retornar resposta na lingua do usuário;

const app = async () => {
  const model = openAIFactory({ verbose: true });
  const vectorStore = await getSupabaseVectorStore();
  const retriever = await vectorStore.asRetriever();

  // const testRetrieverReponse = await retriever.invoke('');
  // console.log('testRetrieverReponse', testRetrieverReponse);

  // const languageChain = getQuestionLanguageChain(model);
  // const vectorStoreContextInfoChain = await getVectorStoreContextInfoChain(model, retriever);

  // const runnable = RunnableSequence.from([
  //   (prevInput) => ({
  //     input: prevInput.question,
  //     format_instructions: structuredOutputParser.getFormatInstructions(),
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
  const dbChainResponse = await dbQueryChain.invoke({ question: 'How many states are there per region?' });
  console.log('dbChainResponse', dbChainResponse);
};

app();
