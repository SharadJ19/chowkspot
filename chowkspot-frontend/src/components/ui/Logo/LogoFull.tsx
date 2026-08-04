import React from 'react';

export interface LogoSvgProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

export const LogoFull: React.FC<LogoSvgProps> = ({
  color = 'currentColor',
  ...props
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 540 120'
    width='100%'
    height='100%'
    aria-label='ChowkSpot Logo'
    {...props}
  >
    <defs>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;800&display=swap');
        .brand-text {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>
      <linearGradient id='emerald' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stopColor='#10b981' />
        <stop offset='100%' stopColor='#047857' />
      </linearGradient>
      <linearGradient id='darkSlate' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stopColor='#334155' />
        <stop offset='100%' stopColor='#0f172a' />
      </linearGradient>
    </defs>
    <g transform='translate(10, 10)'>
      <path
        d='M 50 15 C 25 15, 15 35, 15 50 C 15 72, 38 88, 50 95'
        fill='none'
        stroke='url(#darkSlate)'
        strokeWidth='7'
        strokeLinecap='round'
      />
      <path
        d='M 50 15 C 75 15, 85 35, 85 50 C 85 72, 62 88, 50 95'
        fill='none'
        stroke='url(#emerald)'
        strokeWidth='7'
        strokeLinecap='round'
      />
      <circle cx='50' cy='45' r='7' fill='url(#emerald)' />
    </g>
    <g transform='translate(125, 75)'>
      <text
        x='0'
        y='0'
        className='brand-text'
        fontWeight='800'
        fontSize='54'
        letterSpacing='-2'
        fill={color}
      >
        chowk
      </text>
      <text
        x='176'
        y='0'
        className='brand-text'
        fontWeight='300'
        fontSize='54'
        letterSpacing='-2'
        fill={color}
      >
        spot
      </text>
      <circle cx='277.5' cy='-42' r='4' fill='url(#emerald)' />
    </g>
  </svg>
);
