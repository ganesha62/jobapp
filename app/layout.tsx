import React from 'react';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Management Admin',
  description: 'Admin interface for managing job postings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // You can choose 'light', 'dark', or detect system preference dynamically
  const colorScheme = 'light';

  return (
    <html lang="en" data-mantine-color-scheme={colorScheme}>
      <head>
        <ColorSchemeScript defaultColorScheme={colorScheme} />
      </head>
      <body>
        <MantineProvider defaultColorScheme={colorScheme}>
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
