import TrendyLayout from '@layouts/trendy/layout';

export default async function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { lang } = await params;
  return <TrendyLayout lang={lang}>{children}</TrendyLayout>;
}
