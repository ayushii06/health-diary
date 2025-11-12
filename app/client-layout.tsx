'use client';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function ClientLayout({ children }: { children: React.ReactNode }) {

  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
