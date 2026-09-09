import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Ashna Kasireddy — Product Designer', description: 'AI-forward, product-minded design for agents and humans alike.' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
