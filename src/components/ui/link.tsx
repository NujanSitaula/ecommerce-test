import NextLink, { LinkProps as NextLinkProps } from 'next/link';

const Link: React.FC<
  NextLinkProps & {
    className?: string;
    children?: React.ReactNode;
    title?: string;
  }
> = ({ children, className, title, ...props }) => {
  return (
    <NextLink {...props} title={title} className={className}>
      {children}
    </NextLink>
  );
};

export default Link;
