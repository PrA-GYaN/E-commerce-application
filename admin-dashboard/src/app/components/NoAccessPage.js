import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Navbar from "./navbar";


export default function NoAccessPage() {
    const onPageChange = () => {
        console.log('Access Denied');
        };

  return (
    <>
    <Navbar onPageChange={onPageChange}/>
    <div className="flex items-center justify-center h-96 bg-gradient-to-r from-gray-50 to-gray-100">
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
      </Card>
    </div>
    </>
  );
}