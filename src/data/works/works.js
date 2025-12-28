// Works data - Portfolio showcase items
export const works = [
  {
    id: 'project-1',
    title: 'Modern Living Space',
    description: 'Interior Design & Styling',
    src: '/Products/pconfig.webp',
    color: '#000000',
    category: 'Interior Design',
    year: '2024',
    client: 'Luxury Homes Inc.',
    details: 'A stunning modern living space featuring minimalist design principles, premium materials, and seamless integration of technology. This project showcases our ability to create sophisticated environments that balance aesthetics with functionality.',
    images: [
      '/Products/pconfig.webp',
      '/Products/ppacket.webp',
      '/Products/plife.webp'
    ],
    tags: ['Modern', 'Minimalist', 'Residential']
  },
  {
    id: 'project-2',
    title: 'Corporate Headquarters',
    description: 'Architecture & Design',
    src: '/Products/ppacket2.webp',
    color: '#2c2c2c',
    category: 'Architecture',
    year: '2024',
    client: 'TechCorp Global',
    details: 'A cutting-edge corporate headquarters designed to inspire innovation and collaboration. The space features flexible work environments, state-of-the-art facilities, and sustainable design elements throughout.',
    images: [
      '/Products/ppacket2.webp',
      '/Products/plife2.webp',
      '/Products/pconfig.webp'
    ],
    tags: ['Corporate', 'Sustainable', 'Innovation']
  },
  {
    id: 'project-3',
    title: 'Boutique Hotel Lobby',
    description: 'Hospitality Design',
    src: '/Products/plife.webp',
    color: '#EFE8D3',
    category: 'Hospitality',
    year: '2023',
    client: 'Grandeur Hotels',
    details: 'An elegant boutique hotel lobby that welcomes guests with warmth and sophistication. The design combines classic luxury with contemporary elements, creating a memorable first impression.',
    images: [
      '/Products/plife.webp',
      '/Products/plife2.webp',
      '/Products/ppacket.webp'
    ],
    tags: ['Luxury', 'Hospitality', 'Elegant']
  },
  {
    id: 'project-4',
    title: 'Urban Apartment Renovation',
    description: 'Residential Remodel',
    src: '/Products/plife2.webp',
    color: '#706D63',
    category: 'Residential',
    year: '2023',
    client: 'Private Client',
    details: 'A complete transformation of a downtown apartment, maximizing space and natural light. The renovation preserves the building\'s historic character while introducing modern amenities and contemporary design.',
    images: [
      '/Products/plife2.webp',
      '/Products/pconfig.webp',
      '/Products/ppacket2.webp'
    ],
    tags: ['Renovation', 'Urban', 'Historic']
  },
  {
    id: 'project-5',
    title: 'Restaurant & Bar Design',
    description: 'Commercial Interior',
    src: '/Products/ppacket.webp',
    color: '#EFE8D3',
    category: 'Commercial',
    year: '2023',
    client: 'Culinary Arts Group',
    details: 'A vibrant restaurant and bar space designed to create an immersive dining experience. The design emphasizes atmosphere, flow, and the integration of kitchen and dining areas.',
    images: [
      '/Products/ppacket.webp',
      '/Products/plife.webp',
      '/Products/pconfig.webp'
    ],
    tags: ['Restaurant', 'Vibrant', 'Commercial']
  }
];

// Helper function to get work by ID
export const getWorkById = (id) => {
  return works.find(work => work.id === id);
};

// Helper function to get works by category
export const getWorksByCategory = (category) => {
  return works.filter(work => work.category === category);
};

