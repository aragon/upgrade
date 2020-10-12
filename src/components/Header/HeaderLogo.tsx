import React from 'react'
// @ts-ignore
import { unselectable, GU } from '@aragon/ui'
import headerLogoSvg from '../../assets/aragon-logo-mark.svg'

function HeaderLogo(): JSX.Element {
  return (
    <div
      css={`
        ${unselectable};
        display: flex;
        align-items: center;
      `}
    >
      <img alt="Aragon Migrate" src={headerLogoSvg} width={6 * GU} />
    </div>
  )
}

export default HeaderLogo