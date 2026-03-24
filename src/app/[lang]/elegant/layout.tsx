import ElegantLayout from '@layouts/elegant/layout';

export default async function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { lang } = await params;
  return <ElegantLayout lang={lang}>{children}</ElegantLayout>;
}
