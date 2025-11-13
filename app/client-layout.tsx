'use client';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { dark } from '@clerk/themes'


export default function ClientLayout({ children }: { children: React.ReactNode }) {

  return (
    <ClerkProvider appearance={{
    baseTheme: dark,
  }}>
      {children}
    </ClerkProvider>
  );
}
