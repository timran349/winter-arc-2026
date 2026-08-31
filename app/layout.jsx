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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0b0c0a] text-[#f4f6f3] antialiased selection:bg-[#9fe870] selection:text-[#163300] font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
