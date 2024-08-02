import { VectorStore } from "@langchain/core/vectorstores";
import { Embeddings } from "@langchain/core/embeddings";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

import { getEnvConfig } from "../../../config/config";

export const getClient = async () => {
  const { SUPABASE_API_URL, SUPABASE_KEY } = getEnvConfig();
  const client = createClient(SUPABASE_API_URL, SUPABASE_KEY);
  return client;
};

export async function getSupabaseVectorStore (
  embeddings: Embeddings = new OpenAIEmbeddings()
): Promise<VectorStore> {
  const client = await getClient();

  const vectorStore = new SupabaseVectorStore(
    embeddings,
    {
      client,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  return vectorStore;
};
