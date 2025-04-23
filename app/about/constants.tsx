import { Layers, Palette, Layout } from 'lucide-react';
import { ReactElement } from 'react';

interface Service {
  title: string;
  description: string;
  icon: ReactElement;
  href: string;
}

export const brands = [
  {
    name: 'Olsson',
    logo: '/assets/images/olsson.png'
  },
  {
    name: 'Wega',
    logo: '/assets/images/wega.png'
  },
  {
    name: 'AMC',
    logo: '/assets/images/amc.png'
  },
  {
    name: 'Têxtil Cristina',
    logo: '/assets/images/cristina.png'
  },
  {
    name: 'Dura Mais',
    logo: '/assets/images/dura-mais.png'
  },
  {
    name: 'Forno D\'Lenha',
    logo: '/assets/images/forno-d-lenha.png'
  },
  {
    name: 'Hotel D\'Sintra',
    logo: '/assets/images/d-sintra.png'
  },
  {
    name: 'Divino',
    logo: '/assets/images/divino.png'
  },
  {
    name: 'JVLN',
    logo: '/assets/images/jvln.png'
  }
];

export const services: Service[] = [
  {
    title: 'branding',
    description: 'branding.description',
    icon: <Layers className="w-5 h-5" />,
    href: '/services'
  },
  {
    title: 'visualIdentity',
    description: 'visualIdentity.description',
    icon: <Palette className="w-5 h-5" />,
    href: '/services'
  },
  {
    title: 'artDirection',
    description: 'artDirection.description',
    icon: <Layout className="w-5 h-5" />,
    href: '/services'
  },
];

export const team = [
  { 
    name: 'Pedro Xavier', 
    role: 'Co-founder',
    image: '/assets/images/pedro.webp'
  },
  { 
    name: 'Pedro Jaques', 
    role: 'Co-founder',
    image: '/assets/images/jacao.webp'
  },
  { 
    name: 'Miguel Soares', 
    role: 'Designer',
    image: '/assets/images/Captura de tela 2025-04-12 145420.png'
  }
];

export const neonAccent = '#52ddeb';

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}; 