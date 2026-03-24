import type { Metadata } from 'next';
import ProductSingleDetails from '@components/product/product';
import RelatedProductFeed from '@components/product/feeds/related-product-feed';
import ScrollToTopOnSlug from '@components/common/scroll-to-top-on-slug';
import BaselBreadcrumb from '../../../(basel)/basel/basel-breadcrumb';
import { fetchProduct } from '@framework/product/get-product';
import { ROUTES } from '@utils/routes';

type PageProps = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

const getBaseStoreName = () =>
  process.env.NEXT_PUBLIC_STORE_NAME ||
  process.env.NEXT_PUBLIC_SITE_NAME ||
  'BoroBazar';

const getSiteBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_FRONTEND_URL ||
  'http://localhost:3001';

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;

  const baseStoreName = getBaseStoreName();
  const siteBaseUrl = getSiteBaseUrl().replace(/\/$/, '');

  let product: any = null;
  try {
    product = await fetchProduct(slug);
  } catch {
    product = null;
  }

  const safeSlug = typeof slug === 'string' ? slug : String(slug ?? '');
  const prettySlug = safeSlug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  if (!product) {
    return {
      title: prettySlug ? `${prettySlug} - ${baseStoreName}` : baseStoreName,
    };
  }

  const seo = (product as any).seo ?? {};
  const rawTitle =
    seo.seo_title ||
    (product as any).meta_title ||
    product.name ||
    (typeof slug === 'string' ? slug : '');

  const title = `${rawTitle} - ${baseStoreName}`;

  const description: string | undefined =
    seo.seo_description ||
    (product as any).meta_description ||
    (typeof product.description === 'string'
      ? product.description
      : undefined);

  const canonicalPath =
    seo.canonical_url ||
    `${ROUTES.PRODUCT}${safeSlug}?lang=${encodeURIComponent(lang)}`;

  const canonicalUrl = canonicalPath.startsWith('http')
    ? canonicalPath
    : `${siteBaseUrl}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`;

  const ogTitle = seo.og_title || rawTitle || baseStoreName;
  const ogDescription = seo.og_description || description || undefined;
  const ogImage = seo.og_image_url || (product.image?.original as string | undefined);
  const ogType = seo.og_type || 'website';
  const ogUrl = seo.og_url_override || canonicalUrl;

  const twitterTitle = seo.twitter_title || ogTitle;
  const twitterDescription = seo.twitter_description || ogDescription;
  const twitterImage = seo.twitter_image_url || ogImage;
  const twitterCard =
    seo.twitter_card_type || (twitterImage ? 'summary_large_image' : 'summary');

  const robots =
    typeof seo.meta_robots === 'string' && seo.meta_robots.trim().length > 0
      ? seo.meta_robots.trim()
      : 'index,follow';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      type: ogType,
      siteName: baseStoreName,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
    },
    twitter: {
      card: twitterCard as any,
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params;
  return (
    <>
      <ScrollToTopOnSlug slug={slug} />
      <BaselBreadcrumb lang={lang} />
      <div className="pb-4 pb-lg-5">
        <div className="container">
          <ProductSingleDetails lang={lang} variant="basel" />
        </div>
      </div>

      <section className="border-top py-4 py-lg-5">
        <div className="container">
          <RelatedProductFeed
            uniqueKey="basel-related-products"
            lang={lang}
            productSlug={slug}
          />
        </div>
      </section>
    </>
  );
}
