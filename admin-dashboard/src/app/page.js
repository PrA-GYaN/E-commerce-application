import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import Login from './components/Login'
import Dashboard from './dashboard/page'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
            {/* <SignInButton /> */}
            {/* <Login  /> */}
            <Dashboard/>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}