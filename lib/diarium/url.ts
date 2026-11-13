export const DIARIUM_BASE_URL =
  "https://www.av.se/om-oss/diarium-och-allmanna-handlingar/bestall-handlingar/";

export type DiariumSearchParameterName =
  | "SearchText"
  | "FromDate"
  | "ToDate"
  | "SelectedArendeProcess"
  | "SelectedHandlingType"
  | "SelectedCounty"
  | "SelectedMunicipality"
  | "OnlyActive"
  | "SelectedSortOrder"
  | "sortDirection"
  | "sortOrder"
  | "p";

export type DiariumSearchParameters = Partial<
  Record<DiariumSearchParameterName, string>
>;

export function diariumSearchUrl(params: DiariumSearchParameters): string {
  const url = new URL(DIARIUM_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
}

export function diariumCaseUrl(caseId: string): string {
  return `${DIARIUM_BASE_URL}Case/?id=${caseId}`;
}
