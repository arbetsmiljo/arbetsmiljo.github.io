import z from "zod";

/**
 * This validates quite loosely. Normally a Swedish company ID has to be 10
 * characters, with an optional hyphen separator between characters 6 and 7.
 * So valid examples would be like so:
 *
 * 1. 555666-1234
 * 2. 4445551234
 *
 * In practice Arbetsmiljöverket's data isn't this reliable and sometimes
 * there can be a typo or invalid data here. So here are the list of exceptions
 * that have been allowed for here:
 *
 * 1. An extra number – 44455512349 – presumably a typo.
 * 2. VAT numbers instead of actual company IDs. So e.g. "012345678901".
 * 3. Somebody's name, i.e. "PatrikVernersson".
 * 4. The number "2" on its own (2024/016058-1).
 */
export const CompanyIdSchema = z
  .string()
  .regex(/^(\d{6}(-|)?\d{4}\d?|\d{12}|PatrikVernersson|2)$/, {
    message: "Invalid format, expected 123456-1234",
  })
  .transform((val) => {
    if (val) {
      if (val.includes("-")) {
        return val.split("-").join("");
      }
      if (val.includes("")) {
        return val.split("").join("");
      }
    }
    return val;
  });

/**
 * Any string value is valid as a company name. Most of them end with ` AB` but
 * I haven't bothered to check if it's 100%. Doesn't seem important to lock this
 * down.
 */
export const CompanyNameSchema = z.string();
