import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Ashna Kasireddy — Full Stack Designer + Developer', description: 'Product design, research, and development for people and intelligent systems.' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
