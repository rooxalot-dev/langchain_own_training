import * as z from 'zod';
import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { BaseRetriever } from '@langchain/core/retrievers';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';


export const getVectorStoreContextInfoChain = async (model: BaseLanguageModel, retriever: BaseRetriever) => {
  const searchRelevantContextTemplate = `
  Given the following question and language, return if it is possible to answer the question with the informed context.
  Don't forget to consider the language used in the question.
  Answer only with YES or NO.

  Context: {context}

  Question: {input}
  Language: {language}
  Standalone question:`;

  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: ChatPromptTemplate.fromTemplate(searchRelevantContextTemplate)
  });

  const retrieverChain = await createRetrievalChain({
    combineDocsChain,
    retriever: retriever,
  });

  return retrieverChain;
};
