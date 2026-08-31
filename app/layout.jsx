import '../src/index.css';

export const metadata = {
  title: 'WINTER ARC 2026 — Start before January. Finish with proof.',
  description: '90-day personal accountability experience. Choose 4–6 commitments, track them daily, and finish with proof before the new year.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,600;1,6..72,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#07080a] text-[#f1f5f9] antialiased selection:bg-[#38bdf8]/20 selection:text-[#38bdf8] font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
