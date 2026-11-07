import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'EchoSpiro | Ultrasonic Doppler Spirometry Workstation',
  description:
    'Sovereign, zero-hardware, browser-native active ultrasonic Doppler spirometry and contactless pulmonary triage workstation for VITB - JHU Health-Hack 2027.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#030712] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}
      >
        {children}
      </body>
    </html>
  );
}
