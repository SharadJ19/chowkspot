import React from 'react';

export const LogoWordmark: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 310 80'
    width='100%'
    height='100%'
    aria-label='ChowkSpot Wordmark'
    {...props}
  >
    <defs>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;800&display=swap');
        .brand-wordmark {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>
      <linearGradient id='emeraldText' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stopColor='#10b981' />
        <stop offset='100%' stopColor='#047857' />
      </linearGradient>
    </defs>
    <g transform='translate(0, 58)'>
      <text
        x='0'
        y='0'
        className='brand-wordmark'
        fontWeight='800'
        fontSize='54'
        letterSpacing='-2'
        fill='#0f172a'
      >
        chowk
      </text>
      <text
        x='176'
        y='0'
        className='brand-wordmark'
        fontWeight='300'
        fontSize='54'
        letterSpacing='-2'
        fill='#0f172a'
      >
        spot
      </text>
      <circle cx='277.5' cy='-42' r='4' fill='url(#emeraldText)' />
    </g>
  </svg>
);
