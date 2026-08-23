import './globals.css';

export const metadata = {
  title: 'NOUR OS — نظام عمر الشخصي',
  description: 'مساعدك الشخصي NOUR lv1 لإدارة مهامك اليومية والأسبوعية',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void-950 font-body text-mist-300 antialiased">{children}</body>
    </html>
  );
}
