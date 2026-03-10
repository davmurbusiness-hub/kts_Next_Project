import React from "react";
import '@styles/styles.css'
import { roboto } from '@/fonts/roboto';
import { StoreProvider } from "@providers/StoreProvider";
import {QueryParamsStoreInitializer, } from "@hooks/useQueryParamsStoreInit";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: '%s | Cinema',
        default: 'Cinema',
    },
    description: 'Подборка фильмов и сериалов для вечера',
};

export default function RootLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={roboto.variable}>
      <body className={roboto.className}>
      <StoreProvider>
          <QueryParamsStoreInitializer />
          {children}
      </StoreProvider>
      </body>
    </html>
  );
}
