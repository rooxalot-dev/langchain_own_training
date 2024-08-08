import { SqlToolkit } from "langchain/agents/toolkits/sql";

import { openAIFactory } from "../factory/implementation/openai/openai";
import { getPostgresDatasource } from "../db/postgres/sql.database";

export const getDbInfoTools = async () => {
  const model = openAIFactory();
  const dataSource = await getPostgresDatasource();
  const sqlToolKit = new SqlToolkit(dataSource, model);

  return sqlToolKit.getTools();
};
