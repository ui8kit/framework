export type NavItem = { id: string; title: string; url: string };
export type FooterLink = { label: string; href: string };
export type FooterSection = { title: string; links: FooterLink[] };

export { Header } from './Header';
export { Footer } from './Footer';
export { Sidebar } from './Sidebar';
