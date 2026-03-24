'use client';

import Link from '@components/ui/link';

export default function BaselFooter() {
  return (
    <footer className="basel-footer">
      <div className="container py-4 py-lg-5">
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="fw-bold fs-5 mb-2">Basel</div>
            <p className="mb-3 text-muted small">
              Worldwide fashion store since 1978. Premium quality, curated
              collections, and timeless style.
            </p>
            <div className="d-flex gap-3 basel-socialIcons">
              <a href="#" aria-label="Facebook"><i className="icons icon-social-facebook" /></a>
              <a href="#" aria-label="Instagram"><i className="icons icon-social-instagram" /></a>
              <a href="#" aria-label="Twitter"><i className="icons icon-social-twitter" /></a>
            </div>
          </div>

          <div className="col-6 col-lg-2 offset-lg-1">
            <h6 className="mb-2 mb-lg-3 text-uppercase small fw-bold">Shop</h6>
            <ul className="list-unstyled mb-0 d-grid gap-1">
              <li>
                <Link href="#" className="text-decoration-none text-muted small">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="#" className="text-decoration-none text-muted small">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-decoration-none text-muted small">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="mb-2 mb-lg-3 text-uppercase small fw-bold">Support</h6>
            <ul className="list-unstyled mb-0 d-grid gap-1">
              <li>
                <Link href="#" className="text-decoration-none text-muted small">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-decoration-none text-muted small">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="#" className="text-decoration-none text-muted small">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="mb-2 mb-lg-3 text-uppercase small fw-bold">Company</h6>
            <ul className="list-unstyled mb-0 d-grid gap-1">
              <li>
                <Link href="#" className="text-decoration-none text-muted small">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-decoration-none text-muted small">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-decoration-none text-muted small">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-decoration-none text-muted small">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="basel-footerBottom">
        <div className="container small text-muted text-center">
          &copy; {new Date().getFullYear()} Basel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
