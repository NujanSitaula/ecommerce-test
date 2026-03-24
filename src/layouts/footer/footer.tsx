'use client';

import Widgets from '@layouts/footer/widget/widget';
import Copyright from '@layouts/footer/copyright';
import { footer } from './data';
const { widgets, payment } = footer;

interface FooterProps {
  variant?: 'default' | 'medium';
  lang: string;
}

const Footer: React.FC<FooterProps> = ({ variant = 'default', lang }) => {
  return (
    <footer className="mt-[50px] lg:mt-14 2xl:mt-16">
      <Widgets widgets={widgets} variant={variant} lang={lang} />
      <Copyright payment={payment} variant={variant} lang={lang} />
    </footer>
  );
};

export default Footer;
