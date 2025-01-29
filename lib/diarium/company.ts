import z from "zod";

/**
 * This validates quite loosely. Normally a Swedish company ID has to be 10
 * characters, with an optional hyphen separator between characters 6 and 7.
 * In practice Arbetsmiljöverket's data isn't this reliable and sometimes
 * there can be a typo. So here are the list of exceptions that have been
 * allowed for here:
 *
 * 1. An extra number.
 */
export const CompanyIdSchema = z
  .string()
  .regex(/^\d{6}-?\d{4}\d?$/, {
    message: "Invalid format, expected 123456-1234",
  })
  .transform((val) => {
    if (val && val.includes("-")) {
      return val.split("-").join("");
    }
    return val;
  });

export const CompanyNameSchema = z.string();
