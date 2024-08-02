import 'dotenv/config';
import * as z from 'zod';


export const getEnvConfig = () => {
  const envConfig = z.object({
    OPENAI_API_KEY: z.string().trim().min(1),
    SUPABASE_API_URL: z.string().trim().min(1),
    SUPABASE_KEY: z.string().trim().min(1),
    TAVILY_API_KEY: z.string().trim().min(1),
    UPSTASH_REDIS_REST_URL: z.string().trim().min(1),
    UPSTASH_REDIS_REST_TOKEN: z.string().trim().min(1),
    PDF_PATH: z.string().trim().min(1),
  });

  const config = envConfig.parse(process.env);
  return config;
};
