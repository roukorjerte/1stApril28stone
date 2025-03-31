import "./globals.css"

export const metadata = {
  title: 'Change password - 28Stone',
  description: 'Lock your deepest secrets with the ultimate password',
}
 
import Head from 'next/head';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>28Stone Security</title>
        <meta name="Password maker" content="Lock your deepest secrets with the ultimate password" />
        <link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet"/>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}


