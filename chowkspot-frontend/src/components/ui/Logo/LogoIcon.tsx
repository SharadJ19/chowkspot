import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 100 100'
    width='100%'
    height='100%'
    aria-label='ChowkSpot Icon'
    {...props}
  >
    <defs>
      <linearGradient id='emeraldIcon' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stopColor='#10b981' />
        <stop offset='100%' stopColor='#047857' />
      </linearGradient>
      <linearGradient id='darkSlateIcon' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stopColor='#334155' />
        <stop offset='100%' stopColor='#0f172a' />
      </linearGradient>
    </defs>
    <g transform='translate(0, -5)'>
      <path
        d='M 50 15 C 25 15, 15 35, 15 50 C 15 72, 38 88, 50 95'
        fill='none'
        stroke='url(#darkSlateIcon)'
        strokeWidth='7'
        strokeLinecap='round'
      />
      <path
        d='M 50 15 C 75 15, 85 35, 85 50 C 85 72, 62 88, 50 95'
        fill='none'
        stroke='url(#emeraldIcon)'
        strokeWidth='7'
        strokeLinecap='round'
      />
      <circle cx='50' cy='45' r='7' fill='url(#emeraldIcon)' />
    </g>
  </svg>
);
