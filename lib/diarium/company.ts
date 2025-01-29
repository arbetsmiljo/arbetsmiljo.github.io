import z from "zod";

export const CompanyIdSchema = z
  .string()
  .regex(/^\d{6}-?\d{4}$/, {
    message: "Invalid format, expected 123456-1234",
  })
  .optional()
  .transform((val) => {
    if (val && val.includes("-")) {
      return val.split("-").join("");
    }
    return val;
  });

export const CompanyNameSchema = z.string();
