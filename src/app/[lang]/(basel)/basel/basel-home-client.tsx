/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import Link from '@components/ui/link';
import { ROUTES } from '@utils/routes';
import Heading from '@components/ui/heading';
import { ProductGrid } from '@components/product/product-grid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

const heroSlides = [
  {
    // Remote hero image (1900x900) sourced from Unsplash CDN
    bg: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1900&h=900&q=80',
    title: 'Classic Bags',
    subtitle: 'Leather essentials collection',
    cta: 'Shop now',
    href: ROUTES.PRODUCTS,
  },
  {
    // Remote hero image (1900x900) sourced from Unsplash CDN
    bg: 'https://images.unsplash.com/photo-1684973775764-eca6563e758d?auto=format&fit=crop&w=1900&h=900&q=80',
    title: 'Pashmina Scarves',
    subtitle: 'Soft wraps for every season',
    cta: 'Explore',
    href: ROUTES.PRODUCTS,
  },
];

export default function BaselHomeClient({ lang }: { lang: string }) {
  return (
    <div>
      <section>
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop
        >
          {heroSlides.map((s) => (
            <SwiperSlide key={s.bg}>
              <div className="basel-heroSlide">
                <Image
                  src={s.bg}
                  alt={s.title}
                  fill
                  priority
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                />
                <div className="basel-heroOverlay" />
                <div className="container basel-heroContent">
                  <div className="row">
                    <div className="col-12 col-lg-7">
                      <div className="basel-heroAccent" />
                      <div className="basel-sectionKicker mb-2">
                        {s.subtitle}
                      </div>
                      <h1 className="basel-heroTitle fw-bold mb-3 mb-lg-4">{s.title}</h1>
                      <Link
                        href={`/${lang}${s.href}`}
                        className="btn basel-heroCta"
                      >
                        {s.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="py-4 py-lg-5">
        <div className="container">
          <div className="text-center mb-3 mb-lg-4">
            <div className="basel-sectionKicker">Made the hard way</div>
            <Heading variant="heading" className="basel-sectionTitle mt-2">
              Featured categories
            </Heading>
            <p className="text-muted mb-0 basel-sectionDesc">
              Basel Co. is a powerful eCommerce experience. Visit our shop page
              to see all main features for your store.
            </p>
          </div>

          <div className="d-none d-lg-block">
            <div className="row g-4 basel-featured-row">
              <div className="col-lg-6 d-flex">
                <Link
                  href={`/${lang}${ROUTES.CATEGORY}/bags`}
                  className="text-decoration-none d-block flex-grow-1 h-100"
                >
                  <div className="basel-categoryCard h-100">
                    <Image
                      src="https://images.unsplash.com/photo-1691480250099-a63081ecfcb8?auto=format&fit=crop&w=1200&h=900&q=80"
                      alt="Bags"
                      width={1200}
                      height={900}
                      className="w-100 h-100 d-block"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="basel-categoryMask" />
                    <div className="basel-categoryBadge">
                      <span className="badge text-bg-light px-3 py-2">
                        Bags
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 basel-featured-col">
                <div className="basel-featured-half">
                  <Link
                    href={`/${lang}${ROUTES.CATEGORY}/handbags`}
                    className="text-decoration-none d-block h-100"
                  >
                    <div className="basel-categoryCard basel-featured-card h-100">
                      <Image
                        src="https://images.unsplash.com/photo-1537440437066-c585a62baf1f?auto=format&fit=crop&w=1200&h=900&q=80"
                        alt="Handbags"
                        width={900}
                        height={600}
                        className="w-100 h-100 d-block"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="basel-categoryMask" />
                      <div className="basel-categoryBadge">
                        <span className="badge text-bg-light px-3 py-2">
                          Handbags
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="basel-featured-half">
                  <Link
                    href={`/${lang}${ROUTES.CATEGORY}/scarves`}
                    className="text-decoration-none d-block h-100"
                  >
                    <div className="basel-categoryCard basel-featured-card h-100">
                      <Image
                        src="https://images.unsplash.com/photo-1636394485983-f4e5260b56d6?auto=format&fit=crop&w=1200&h=900&q=80"
                        alt="Scarves"
                        width={900}
                        height={600}
                        className="w-100 h-100 d-block"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="basel-categoryMask" />
                      <div className="basel-categoryBadge">
                        <span className="badge text-bg-light px-3 py-2">
                          Scarves
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="col-lg-3 d-flex">
                <Link
                  href={`/${lang}${ROUTES.CATEGORY}/pashmina`}
                  className="text-decoration-none d-block flex-grow-1 h-100"
                >
                  <div className="basel-categoryCard h-100">
                    <Image
                      src="https://images.unsplash.com/photo-1687345837167-ffd9476219e5?auto=format&fit=crop&w=1200&h=900&q=80"
                      alt="Pashmina"
                      width={900}
                      height={900}
                      className="w-100 h-100 d-block"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="basel-categoryMask" />
                    <div className="basel-categoryBadge">
                      <span className="badge text-bg-light px-3 py-2">
                        Pashmina
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="d-lg-none">
            <div className="row g-2 g-lg-4 basel-featured-row">
              {[
                {
                  img: 'https://images.unsplash.com/photo-1691480250099-a63081ecfcb8?auto=format&fit=crop&w=1200&h=900&q=80',
                  label: 'Bags',
                  slug: 'bags',
                },
                {
                  img: 'https://images.unsplash.com/photo-1537440437066-c585a62baf1f?auto=format&fit=crop&w=1200&h=900&q=80',
                  label: 'Handbags',
                  slug: 'handbags',
                },
                {
                  img: 'https://images.unsplash.com/photo-1636394485983-f4e5260b56d6?auto=format&fit=crop&w=1200&h=900&q=80',
                  label: 'Scarves',
                  slug: 'scarves',
                },
                {
                  img: 'https://images.unsplash.com/photo-1687345837167-ffd9476219e5?auto=format&fit=crop&w=1200&h=900&q=80',
                  label: 'Pashmina',
                  slug: 'pashmina',
                },
              ].map((cat) => (
                <div key={cat.label} className="col-12 col-sm-6 d-flex">
                  <Link
                    href={`/${lang}${ROUTES.CATEGORY}/${cat.slug}`}
                    className="text-decoration-none d-block flex-grow-1 h-100"
                  >
                    <div className="basel-categoryCard h-100">
                      <Image
                        src={cat.img}
                        alt={cat.label}
                        width={1200}
                        height={900}
                        className="w-100 h-100 d-block"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="basel-categoryMask" />
                      <div className="basel-categoryBadge">
                        <span className="badge text-bg-light px-3 py-2">
                          {cat.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 py-lg-5 basel-sectionAlt">
        <div className="container">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-end justify-content-between gap-2 gap-sm-3 mb-3 mb-lg-4">
            <div>
              <Heading variant="heading" className="basel-sectionTitle mb-1 mb-sm-2">
                Featured products
              </Heading>
              <p className="text-muted mb-0 basel-sectionDesc d-none d-sm-block">
                This section uses your existing product query + card components.
              </p>
            </div>
            <Link href={`/${lang}${ROUTES.PRODUCTS}`} className="btn basel-btnPrimary btn-sm">
              View all
            </Link>
          </div>

          <ProductGrid lang={lang} variant="basel" />
        </div>
      </section>

      <section className="basel-newsletter">
        <div className="container">
          <div className="row align-items-center g-3 g-lg-4">
            <div className="col-12 col-lg-6 text-center text-lg-start">
              <h3 className="basel-newsletterTitle mb-1">
                Join our newsletter
              </h3>
              <p className="basel-newsletterText mb-0">
                Sign up to be the first to hear about new drops and promotions.
              </p>
            </div>
            <div className="col-12 col-lg-6">
              <form className="basel-newsletterForm">
                <input
                  className="form-control form-control-lg basel-newsletterInput"
                  type="email"
                  placeholder="Email address"
                  aria-label="Email address"
                />
                <button type="button" className="btn btn-lg basel-newsletterBtn">
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

