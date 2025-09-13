import z from "zod";

export function parseEnv(env: NodeJS.ProcessEnv) {
  const envSchema = z.object({
    DATABASE_URL: z.url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRY: z.string(),
    REFRESH_TOKEN_EXPIRY: z.string(),
    BASE_URL: z.string(),
  });

  const { success, data, error } = envSchema.safeParse(env);
  if (!success) {
    throw new Error(error?.message);
  }

  return data;
}

export const env = parseEnv(process.env);
