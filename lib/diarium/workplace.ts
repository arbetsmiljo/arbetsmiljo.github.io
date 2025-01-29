import z from "zod";

export const WorkplaceIdSchema = z.string().regex(/^\d{8}$/, {
  message: "Invalid format, expected 12345678",
});

export const WorkplaceNameSchema = z.string();
