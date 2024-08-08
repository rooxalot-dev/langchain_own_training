import 'dotenv/config';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { createSqlQueryChain, CreateSqlQueryChainFields } from 'langchain/chains/sql_db';
import { QuerySqlTool } from 'langchain/tools/sql';
import {  } from 'langchain/tools/sql';

import { getPostgresDatasource } from "../db/postgres/sql.database";

export const getDbAccessChain = async (
  model: BaseLanguageModel,
  runQuery: boolean = false
) => {
  const dialect: CreateSqlQueryChainFields['dialect'] =
    process.env.DB_DIALECT as CreateSqlQueryChainFields['dialect'] || 'postgres';

  const dataSource = await getPostgresDatasource();

  const sqlQueryChain = await createSqlQueryChain({
    db: dataSource,
    dialect,
    llm: model,
  });

  // Start: Rewrite the QueryCheckerTool runnable implementation to provide more details and ensure the returned answer is the query without explanations.
  const queryCheckSystemPromptTemplate = `
    Double check the user's {dialect} query for common mistakes, including:
    - Using NOT IN with NULL values
    - Using UNION when UNION ALL should have been used
    - Using BETWEEN for exclusive ranges
    - Data type mismatch in predicates
    - Properly quoting identifiers
    - Using the correct number of arguments for functions
    - Casting to the correct data type
    - Using the proper columns for joins

    If there are any of the above mistakes, rewrite the query. If there are no mistakes, just reproduce the original query.
    Don't give any explanations or detials or commentaries, just return the SQL query and nothing more.
    Return the query in a plain string, without any markdown notations.
  `;

  const queryCheckerSystemPrompt = await ChatPromptTemplate.fromMessages([
    ["system", queryCheckSystemPromptTemplate],
    ["human", "{query}"],
  ]).partial({ dialect });

  const queryCheckChain = queryCheckerSystemPrompt.pipe(model).pipe(new StringOutputParser());
  // End: Rewrite the QueryCheckerTool runnable implementation to provide more details and ensure the returned answer is the query without explanations.

  const executeQueryDbTool: QuerySqlTool = new QuerySqlTool(dataSource);

  if (runQuery) {
    return RunnableSequence.from([
      {
        query: async (i) => sqlQueryChain.invoke(i),
      },
      queryCheckChain,
      executeQueryDbTool,
    ]);
  }

  return sqlQueryChain;
};
