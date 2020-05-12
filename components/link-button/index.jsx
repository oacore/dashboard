import React from 'react'
import Link from 'next/link'

import { Button } from 'design'

const LinkButton = ({
  children,
  dataProviderId,
  className,
  tag = 'a',
  href = '',
  variant = 'contained',
  ...passProps
}) => (
  <Link
    href={`/data-providers/[data-provider-id]/${href}`}
    as={`/data-providers/${dataProviderId}/${href}`}
    passHref
  >
    <Button className={className} variant={variant} tag={tag} {...passProps}>
      {children}
    </Button>
  </Link>
)

export default LinkButton
