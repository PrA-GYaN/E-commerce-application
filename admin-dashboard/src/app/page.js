import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import Dashboard from './dashboard/page'
import Login from './login/Login'

export default function RootLayout({ children }) {
  return (
    <>
    <ClerkProvider>
          <SignedOut>
            <Login />
          </SignedOut>
          <SignedIn>
            <Dashboard/>
          </SignedIn>
          {children}
    </ClerkProvider>
    </>
  )
}