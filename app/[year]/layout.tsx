import { selectYears } from "@/lib/year";

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ year: string }[]> {
  const years = await selectYears();
  return years.map((year) => ({ year }));
}

export default function YearLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
