import {
  DiariumDocumentIdSchema,
  DiariumDocumentDateSchema,
  DiariumDocumentOriginSchema,
  DiariumDocumentTypeSchema,
} from "../src/document";

describe("DiariumDocumentIdSchema", () => {
  it("accepts a valid ID", () => {
    expect(DiariumDocumentIdSchema.parse("1234/123456-0")).toEqual(
      "1234/123456-0",
    );
  });

  it("rejects an invalid ID", () => {
    expect(() => DiariumDocumentIdSchema.parse("9183")).toThrow();
  });
});

describe("DiariumDocumentDateSchema", () => {
  it("accepts a valid date", () => {
    expect(DiariumDocumentDateSchema.parse("2020-01-02")).toEqual("2020-01-02");
  });

  it("rejects an invalid date", () => {
    expect(() => DiariumDocumentDateSchema.parse("Monday")).toThrow();
  });
});

describe("DiariumDocumentOriginSchema", () => {
  it("accepts a valid origin", () => {
    expect(DiariumDocumentOriginSchema.parse("Upprättad")).toEqual("Upprättad");
  });

  it("rejects an invalid origin", () => {
    expect(() => DiariumDocumentOriginSchema.parse("Fel")).toThrow();
  });
});

describe("DiariumDocumentTypeSchema", () => {
  it("accepts a valid type", () => {
    expect(DiariumDocumentTypeSchema.parse("Anmälan")).toEqual("Anmälan");
  });

  it("rejects an invalid type", () => {
    expect(() => DiariumDocumentTypeSchema.parse("Upprättad")).toThrow();
  });
});
