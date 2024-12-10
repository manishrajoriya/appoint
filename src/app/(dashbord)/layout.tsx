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
        
        <body suppressHydrationWarning={true}>
         
          {children}
        </body>
        
      </html>
     
  )
}