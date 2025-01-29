import z from "zod";

export enum DiariumCounty {
  "STOCKHOLMS LÄN" = "01",
  "UPPSALA LÄN" = "03",
  "SÖDERMANLANDS LÄN" = "04",
  "ÖSTERGÖTLANDS LÄN" = "05",
  "JÖNKÖPINGS LÄN" = "06",
  "KRONOBERGS LÄN" = "07",
  "KALMAR LÄN" = "08",
  "GOTLANDS LÄN" = "09",
  "BLEKINGE LÄN" = "10",
  "SKÅNE LÄN" = "12",
  "HALLANDS LÄN" = "13",
  "VÄSTRA GÖTALANDS LÄN" = "14",
  "VÄRMLANDS LÄN" = "17",
  "ÖREBRO LÄN" = "18",
  "VÄSTMANLANDS LÄN" = "19",
  "DALARNAS LÄN" = "20",
  "GÄVLEBORGS LÄN" = "21",
  "VÄSTERNORRLANDS LÄN" = "22",
  "JÄMTLANDS LÄN" = "23",
  "VÄSTERBOTTENS LÄN" = "24",
  "NORRBOTTENS LÄN" = "25",
  "FIKTIV" = "99",
}

export type DiariumCountyName = keyof typeof DiariumCounty;
export type DiariumCountyId = `${DiariumCounty}`;

export const DiariumCountyIdSchema = z.union(
  [
    z.literal("01"),
    z.literal("03"),
    z.literal("04"),
    z.literal("05"),
    z.literal("06"),
    z.literal("07"),
    z.literal("08"),
    z.literal("09"),
    z.literal("10"),
    z.literal("12"),
    z.literal("13"),
    z.literal("14"),
    z.literal("17"),
    z.literal("18"),
    z.literal("19"),
    z.literal("20"),
    z.literal("21"),
    z.literal("22"),
    z.literal("23"),
    z.literal("24"),
    z.literal("25"),
    z.literal("99"),
  ],
  {
    message: "Invalid county ID",
  },
);

export const DiariumCountyNameSchema = z.union(
  [
    z.literal("STOCKHOLMS LÄN"),
    z.literal("UPPSALA LÄN"),
    z.literal("SÖDERMANLANDS LÄN"),
    z.literal("ÖSTERGÖTLANDS LÄN"),
    z.literal("JÖNKÖPINGS LÄN"),
    z.literal("KRONOBERGS LÄN"),
    z.literal("KALMAR LÄN"),
    z.literal("GOTLANDS LÄN"),
    z.literal("BLEKINGE LÄN"),
    z.literal("SKÅNE LÄN"),
    z.literal("HALLANDS LÄN"),
    z.literal("VÄSTRA GÖTALANDS LÄN"),
    z.literal("VÄRMLANDS LÄN"),
    z.literal("ÖREBRO LÄN"),
    z.literal("VÄSTMANLANDS LÄN"),
    z.literal("DALARNAS LÄN"),
    z.literal("GÄVLEBORGS LÄN"),
    z.literal("VÄSTERNORRLANDS LÄN"),
    z.literal("JÄMTLANDS LÄN"),
    z.literal("VÄSTERBOTTENS LÄN"),
    z.literal("NORRBOTTENS LÄN"),
    z.literal("FIKTIV"),
  ],
  {
    message: "Invalid county name",
  },
);
