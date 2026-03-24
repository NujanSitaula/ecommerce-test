'use client';

import React from 'react';
import Link from '@components/ui/link';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-5">
      <h1 className="mb-3">Something went wrong</h1>
      <p className="text-muted mb-4">
        An unexpected error occurred while rendering this page.
      </p>
      <pre
        className="p-3 bg-light border rounded small"
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {error?.message}
        {error?.digest ? `\n\nDigest: ${error.digest}` : ''}
      </pre>
      <div className="d-flex gap-2 mt-4">
        <button type="button" className="btn btn-dark" onClick={reset}>
          Try again
        </button>
        <Link className="btn btn-outline-dark" href="/en/basel">
          Go to Basel home
        </Link>
      </div>
    </div>
  );
}

