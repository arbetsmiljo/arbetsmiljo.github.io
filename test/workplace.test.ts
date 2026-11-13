import { WorkplaceIdSchema } from "../src/workplace";

describe("WorkplaceIdSchema", () => {
  it("accepts a valid ID", () => {
    expect(WorkplaceIdSchema.parse("12345678")).toEqual("12345678");
  });

  it("rejects an invalid ID", () => {
    expect(() => WorkplaceIdSchema.parse("9183")).toThrow();
  });
});
