import Image from 'next/image';
import Link from '@components/ui/link';
import cn from 'classnames';
import { siteSettings } from '@settings/site-settings';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  href = siteSettings.logo.href,
  ...props
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'inline-block focus:outline-none max-w-[131px] w-full',
        className,
      )}
      {...props}
    >
      <Image
        src={siteSettings.logo.url}
        alt={siteSettings.logo.alt}
        width={siteSettings.logo.width}
        height={siteSettings.logo.height}
        loading="eager"
      />
    </Link>
  );
};

export default Logo;
