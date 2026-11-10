import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IPA — Institute of Public Affairs',
  description: 'Official institutional portal for the Institute of Public Affairs (IPA). Independent research, media studies, public policy dialogue, and civic awareness initiatives.',
  openGraph: {
    title: 'IPA — Institute of Public Affairs',
    description: 'Official institutional portal for the Institute of Public Affairs (IPA). Independent research, media studies, public policy dialogue, and civic awareness initiatives.',
    type: 'website',
    locale: 'en_US',
    siteName: 'IPA — Institute of Public Affairs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IPA — Institute of Public Affairs',
    description: 'Official institutional portal for the Institute of Public Affairs (IPA). Independent research, media studies, public policy dialogue, and civic awareness initiatives.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-[#242A31] bg-white flex flex-col min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
