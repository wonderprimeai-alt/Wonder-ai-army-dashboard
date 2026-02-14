import './globals.css';

export const metadata = {
  title: 'Wonder AI Army - Command Center',
  description: 'Real-time intelligence dashboard for Wonder Creative Studio AI agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
