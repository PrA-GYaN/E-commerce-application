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
          <SignedOut>
            {/* <SignInButton /> */}
            <Login  />
            {/* <Dashboard/> */}
          </SignedOut>
          <SignedIn>
            {/* <UserButton /> */}
            <Dashboard/>
          </SignedIn>
          {children}
    </ClerkProvider>
  )
}