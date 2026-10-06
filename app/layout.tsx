import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Ashna Kasireddy — Product design + creative technology', description: 'Product design, accessible experiences, and working prototypes.' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
