import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Dofus Expense Management',
  description: 'Manage your Dofus expenses efficiently',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
