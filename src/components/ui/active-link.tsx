import Link from 'next/link';
import React, { Children } from 'react';

const ActiveLink = ({
  children,
  lang,
  activeClassName,
  href,
  ...props
}: any) => {
  const child = Children.only(children);
  const childClassName = child.props.className || '';

  const className =
    lang === href
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName;

  // Strip deprecated props like `legacyBehavior` so they are not forwarded to `Link`
  const { legacyBehavior: _legacyBehavior, ...linkProps } = props;

  return (
    <Link href={href} {...linkProps}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  );
};

export default ActiveLink;
