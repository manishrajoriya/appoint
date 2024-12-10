import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
      <html lang="en">
        <ClerkProvider>
        <body suppressHydrationWarning={true}>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {children}
        </body>
        </ClerkProvider>
      </html>
     
  )
}