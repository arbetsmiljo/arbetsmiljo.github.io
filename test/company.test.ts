import { CompanyIdSchema } from "../src/company";

describe("CompanyIdSchema", () => {
  it("accepts a valid ID", () => {
    expect(CompanyIdSchema.parse("1234561234")).toEqual("1234561234");
  });

  it("accepts a VAT ID", () => {
    expect(CompanyIdSchema.parse("556743252001")).toEqual("556743252001");
  });

  it("strips the dash if present", () => {
    expect(CompanyIdSchema.parse("123456-1234")).toEqual("1234561234");
  });

  it("strips a tab separator if present", () => {
    expect(CompanyIdSchema.parse("7164258548")).toEqual("7164258548");
  });

  it("accepts an invalid ID", () => {
    expect(CompanyIdSchema.parse("9183")).toEqual("9183");
  });
});
