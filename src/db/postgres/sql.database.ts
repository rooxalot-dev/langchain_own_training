import "dotenv/config";
import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";

let currentDataSource: DataSource | null = null;

export const getPostgresDatasource = async () => {
  const {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
  } = process.env;

  if (!currentDataSource) {
    currentDataSource = new DataSource({
      type: 'postgres',
      host: DB_HOST || '',
      port: parseInt(DB_PORT || '5432'),
      username: DB_USERNAME || '',
      password: DB_PASSWORD || '',
      database: DB_DATABASE || '',
    });
  }

  try {
    if (!currentDataSource.isInitialized) {
      currentDataSource = await currentDataSource.initialize();
    }

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: currentDataSource,
    });

    return db;
  } catch (error) {
    console.log('getPostgresDatasource error', error);
    throw new Error('Error loading the Postgres Datasource');
  }
};
