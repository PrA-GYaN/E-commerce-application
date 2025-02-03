import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { FaCogs, FaChartLine ,FaBox} from 'react-icons/fa';

export default function Welcome() {
  return (
    <div className="bg-gradient-to-r from-blue-500 via-teal-400 to-indigo-600 p-10 flex flex-col items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-3/4 lg:w-2/3 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome to the Admin Dashboard!
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          This is where you can manage category, inventory, and other aspects of your platform.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-100 hover:bg-gray-200 transition duration-200 ease-in-out">
            <CardHeader>
              <div className="flex items-center">
                <FaCogs className="text-4xl text-blue-500 mr-4" />
                <h3 className="text-xl font-semibold text-gray-800">
                Category Management
                </h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
              Create, update, and delete categories with name and image.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-100 hover:bg-gray-200 transition duration-200 ease-in-out">
            <CardHeader>
              <div className="flex items-center">
                <FaBox className="text-4xl text-teal-500 mr-4" />
                <h3 className="text-xl font-semibold text-gray-800">
                Product Management
                </h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
              Admins can create, update, and delete products with details
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-100 hover:bg-gray-200 transition duration-200 ease-in-out">
            <CardHeader>
              <div className="flex items-center">
                <FaChartLine className="text-4xl text-indigo-500 mr-4" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Analytics
                </h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                View detailed platform statistics.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            Explore Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}