import { Photo } from '../types';

export const initialPhotos: Photo[] = [
  {
    id: 'photo-1',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs64HIEYvLup-cqa5Gdr2grVVZMziwu-En9sDAzh91DTPSDpNxFmC-tc26yHLgetEy2ORPiS32i2iYl7YuSRoBuaZENTD5F3F7G61pd3gTi6vOgPUa7GtWDTuBZhb9tOezwjl4fAu23pxdA5B5WbXpyZ45lg5B2N8U3xtL-x2O_EnHucEugZxUNX3vHnQNdKrSCTtvZ_jJz_ndQiiQuLmo6QIbN8Ge2-wJXgMwB03uaTWBkdwhUhEo',
    caption: 'Beautiful floral cradle decor & ceremony setup.',
    location: 'Cradle Area',
    uploadedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    timeAgo: '4m ago',
    likesCount: 58,
    sharesCount: 24,
    photographer: 'Royal Events Studio',
    aspectRatio: 'portrait',
    tags: ['cradle', 'decor', 'floral', 'naming']
  },
  {
    id: 'photo-2',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZZKsi1t12ARBHNS28ZNB0HBhbIdp1NYK6iVOnrnHLlAkQ6ErLor6EvTqRIJ1vQLGkNwzPFfXz8tMD8RDHc6UYfYgat_ZPOIMWghQ4SzbXUVw1FVSbNWQBHIrLgYY-9p03S4qekudFNdtxFJFWGi1sgR-hMRUmXZkzxjMOXhwymeb0Bv4ZnEw024WfwbJSzmbR5bNGy8_xYMP8XZBXIGjBs2PQv847geQdrQKWo51dMeCd66sL4kdG',
    caption: 'Sacred Pooja Mandap with traditional oil lamps & brass decor.',
    location: 'Pooja Mandap',
    uploadedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    timeAgo: '12m ago',
    likesCount: 72,
    sharesCount: 39,
    photographer: 'Royal Events Studio',
    aspectRatio: 'portrait',
    tags: ['pooja', 'mandap', 'tradition', 'rituals']
  },
  {
    id: 'photo-3',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmNi8vlNh-_diTHIq_LUiaEO3wKYjhctSPdiQrr6U8zJufoIPUjPqP1uqBzCFRHLNk4QpJ_W4-LQ6tT-jmDGZiuwiHkgn0a3_r3_7KBBb-oVuzhKfc2owv_W_bHMcq0w93INZgZy0xkTGIdoz523rpOT-2rweyrrW23nk5KrO-XTED06A-X8EHGsIBbJTbS_uuY8PDrFMfep_j24TD6koB97mLJoV869QBRGM1ul9y5BYykkOynHXk',
    caption: 'Traditional festive sweets & welcome drink setup.',
    location: 'Dining & Feast',
    uploadedAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    timeAgo: '28m ago',
    likesCount: 49,
    sharesCount: 21,
    photographer: 'Royal Events Studio',
    aspectRatio: 'square',
    tags: ['sweets', 'feast', 'welcome', 'hospitality']
  },
  {
    id: 'photo-4',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAayETvjd7DniJjXi2MQL_Wsgfa0nHl--1ePGNyIYtEk-g6z-5oJSE45pnXJFuvkR_G6Shtb9hGlY65NSNcvfgBTmuESFt2_tdOZE3uPCNhAF3VxPOTqGwy-45Gy3CSCIgSFqpvJCin2olmJ1Mls13AmS_BOiAqgG-jfdwHw-T0dZ54tSRnIgvyhI-Aryjd4gUrEkxcxfh7cu7vvF4UHyVjFEO1V1abgoWPmSV9JVjXbPrf4R1b5i31',
    caption: 'Grand Entrance welcome arch with marigold & rose flowers.',
    location: 'Welcome Entrance',
    uploadedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    timeAgo: '35m ago',
    likesCount: 63,
    sharesCount: 18,
    photographer: 'Royal Events Studio',
    aspectRatio: 'landscape',
    tags: ['entrance', 'flowers', 'welcome']
  },
  {
    id: 'photo-5',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6Fi8osBNFZdv4XX_v-l-40sv2bIaBsJBscJoqyYwlA1LQedE-axuNhh1lci61jHqJvMbET8IcDiX93ZTubeYfGQHsejrDyxAiC8iFqDpbN1GTWn6ZeUABIy-glKswXvID9W_onJluEg6G8RBHEK9XKEFWDQB8OCO9TlXclfCZjcXVIVEMDJ0MrzptRfhY7aub_2Z9P5MSk5EloqHouXqOBOhAKsesH_t1FK4S8orWnXdqkcfkRkFT',
    caption: 'Family & guests gathering to bless the baby princess.',
    location: 'Grand Hall',
    uploadedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    timeAgo: '42m ago',
    likesCount: 94,
    sharesCount: 43,
    photographer: 'Royal Events Studio',
    aspectRatio: 'portrait',
    tags: ['family', 'blessings', 'guests', 'moments']
  },
  {
    id: 'photo-6',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuPGktacnY7WwoBNC7Th9L688_6AEnhFi00ksAwRwlIZE_ffAS5cQnUXdCDEOGdE5FC3rrR8b2VIQXSAQxgZOQaD7n0eHscab8F0rw4hMad8OycYMNERFEXdc1ULEQcnfek1QdB0eUKeA4fKrNEoovJI-61S7WM8-LZR0rpzdwi7qZBe5hKvofzAXBl_rlF9ifpecuxpBCa3BVSXTf-SK4e5bUIb2Kw4lW7ltxeLv0S_UiIcgrBrwt',
    caption: 'Official naming announcement and family stage celebration.',
    location: 'Grand Hall',
    uploadedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    timeAgo: '55m ago',
    likesCount: 112,
    sharesCount: 56,
    photographer: 'Royal Events Studio',
    aspectRatio: 'portrait',
    tags: ['naming', 'stage', 'announcement', 'celebration']
  }
];
