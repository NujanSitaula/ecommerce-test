import StandardLayout from '@layouts/standard/layout';

export default async function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { lang } = await params;
  return <StandardLayout lang={lang}>{children}</StandardLayout>;
}
