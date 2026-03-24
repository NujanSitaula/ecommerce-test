import MinimalLayout from '@layouts/minimal/layout';

export default async function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { lang } = await params;
  return <MinimalLayout lang={lang}>{children}</MinimalLayout>;
}
