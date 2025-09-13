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

export const createNotesSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateNotesSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export const inviteMemberToTenantSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
});
