import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import mjml2html from 'mjml';

const rootDir = path.resolve(process.cwd(), '..');

const backendMjmlDir = path.join(rootDir, 'backend/resources/mjml');
const backendViewsDir = path.join(rootDir, 'backend/resources/views/emails');

const templates = [
  {
    src: path.join(backendMjmlDir, 'registration-otp.mjml'),
    out: path.join(backendViewsDir, 'otp.blade.php'),
  },
  {
    src: path.join(backendMjmlDir, 'registration-welcome.mjml'),
    out: path.join(backendViewsDir, 'registration-welcome.blade.php'),
  },
  {
    src: path.join(backendMjmlDir, 'order-success.mjml'),
    out: path.join(backendViewsDir, 'order-success.blade.php'),
  },
  {
    src: path.join(backendMjmlDir, 'order-status-updated.mjml'),
    out: path.join(backendViewsDir, 'order-status-updated.blade.php'),
  },
  {
    src: path.join(backendMjmlDir, 'forgot-password.mjml'),
    out: path.join(backendViewsDir, 'forgot-password.blade.php'),
  },
  {
    src: path.join(backendMjmlDir, 'reset-password-success.mjml'),
    out: path.join(backendViewsDir, 'reset-password-success.blade.php'),
  },
];

fs.mkdirSync(backendViewsDir, { recursive: true });

for (const { src, out } of templates) {
  if (!fs.existsSync(src)) {
    throw new Error(`Missing MJML template: ${src}`);
  }

  const mjmlSource = fs.readFileSync(src, 'utf8');
  const { html, errors } = mjml2html(mjmlSource, {
    filePath: src,
    validationLevel: 'skip',
    minify: false,
  });

  if (errors && errors.length) {
    // eslint-disable-next-line no-console
    console.error(errors);
    throw new Error(`MJML compilation failed for ${src}`);
  }

  fs.writeFileSync(out, html, 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Built ${path.relative(rootDir, out)}`);
}

