import React from 'react';

export const metadata = {
  title: "Conway's Game of Life",
  description: 'Interactive Conway\'s Game of Life implementation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
