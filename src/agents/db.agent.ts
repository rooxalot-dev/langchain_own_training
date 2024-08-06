import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { ChainValues } from "@langchain/core/utils/types";
import { AgentAction, AgentFinish, AgentStep,  } from "@langchain/core/agents";
import { createSqlAgent, SqlToolkit } from "langchain/agents/toolkits/sql"

import { getPostgresDatasource } from '../db/postgres/sql.database';

export const getDbAgent = async (model: BaseLanguageModel) => {
  const db = await getPostgresDatasource();
  const sqlToolkit = new SqlToolkit(db, model);
  const sqlAgentExecutor = createSqlAgent(model, sqlToolkit);

  return sqlAgentExecutor;
}

export const invokeDbAgent = async (model: BaseLanguageModel, input: string) => {
  type AgentExecutorOutputType = ChainValues & { intermediateSteps: AgentStep[] };

  const db = await getPostgresDatasource();
  const sqlToolkit = new SqlToolkit(db, model);
  const sqlAgentExecutor = createSqlAgent(model, sqlToolkit);

  const result = await sqlAgentExecutor.invoke({ input }) as AgentExecutorOutputType;

  console.log(`Intermediate steps ${JSON.stringify(result.intermediateSteps, null, 2)}`);

  return result;
}
