import AncientLayout from '@layouts/ancient/layout';

export default async function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { lang } = await params;
  return <AncientLayout lang={lang}>{children}</AncientLayout>;
}
