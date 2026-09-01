import '../src/index.css';

export const metadata = {
  title: 'Arc 90 — Start before January. Finish with proof.',
  description: '90-day personal accountability experience. Choose 4–6 commitments, track them daily, and finish with proof before the new year.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Funnel+Sans:ital,wght@0,300..800;1,300..800&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-zinc-900 antialiased selection:bg-[#FF4500] selection:text-white font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
