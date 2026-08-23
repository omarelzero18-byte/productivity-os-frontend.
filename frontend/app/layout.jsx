import './globals.css';

export const metadata = {
  title: 'Personal Productivity OS',
  description: 'مساعده الشخصيه NOUR lv1 لإدارة مهامك اليومية والأسبوعية',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
