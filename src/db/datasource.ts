import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";

export const getDatasource = async () => {
  const datasource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "northwind",
});
  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });

  console.log(db.allTables.map((t) => t.tableName));
};
