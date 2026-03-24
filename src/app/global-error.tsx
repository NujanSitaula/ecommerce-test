'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ margin: '0 0 8px' }}>Application error</h1>
          <p style={{ margin: '0 0 16px', opacity: 0.75 }}>
            A fatal error occurred.
          </p>
          <pre
            style={{
              background: '#f6f7f8',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 8,
              padding: 12,
              whiteSpace: 'pre-wrap',
            }}
          >
            {error?.message}
            {error?.digest ? `\n\nDigest: ${error.digest}` : ''}
          </pre>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.2)',
              background: '#111',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

