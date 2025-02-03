import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";


export default function NoAccessPage() {
    const deleteCookies = () => {
        const cookies = document.cookie.split(';');
        
        cookies.forEach(cookie => {
          const cookieName = cookie.split('=')[0].trim();
          const domainsAndPaths = [
            { domain: '.welcome-haddock-40.clerk.accounts.dev', path: '/' },
            { domain: 'localhost', path: '/' }
          ];
    
          domainsAndPaths.forEach(({ domain, path }) => {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`;
          });
        });
        window.location.reload();
      };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <Lock className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-gray-900">
            Access Denied
          </CardTitle>
          <CardDescription className="mt-2 text-gray-600">
            You don&apos;t have permission to view this page. Please contact the administrator for access.
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            onClick={deleteCookies}
          >
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}