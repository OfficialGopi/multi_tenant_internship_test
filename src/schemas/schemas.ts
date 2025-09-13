import z from "zod";

export const loginBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const createTenantSchema = z.object({
  tenantName: z.string(),
  adminName: z.string(),
  adminEmail: z.email(),
  adminPassword: z.string(),
});
