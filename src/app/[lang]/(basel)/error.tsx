'use client';

import React from 'react';
import Link from '@components/ui/link';

export default function BaselSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-5">
      <h1 className="mb-3">Basel page error</h1>
      <p className="text-muted mb-4">
        The Basel theme route failed to render.
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
          Reload Basel home
        </Link>
      </div>
    </div>
  );
}

