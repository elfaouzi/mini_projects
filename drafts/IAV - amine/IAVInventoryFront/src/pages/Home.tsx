import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CubeIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const features = [
    {
      icon: CubeIcon,
      title: 'Inventory Management',
      description: 'Track and manage all school equipment, supplies, and resources in real-time.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Access',
      description: 'Role-based access control ensures data security and proper authorization.'
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics & Reports',
      description: 'Generate detailed reports and analytics for better decision making.'
    },
    {
      icon: UserGroupIcon,
      title: 'Multi-User Support',
      description: 'Support for administrators, managers, and employees with different access levels.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <CubeIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">IAV Inventory System</h1>
            </div>
            <Link
              to="/login"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <span>Login</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-6">
            Welcome to
            <span className="block text-blue-600">IAV Inventory System</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Institut Agronomique et Vétérinaire Hassan II's comprehensive inventory management system. 
            Streamline your equipment tracking, supply management, and resource allocation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Access Dashboard
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <button className="inline-flex items-center px-8 py-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-lg shadow-lg border border-blue-200 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
              About IAV Inventory Management
            </h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-600 mb-4">
                  The IAV Inventory System is designed specifically for Institut Agronomique et Vétérinaire Hassan II 
                  to efficiently manage and track all institutional resources, laboratory equipment, and supplies.
                </p>
                <p className="text-gray-600 mb-6">
                  Our system provides comprehensive inventory tracking, real-time updates, and detailed reporting 
                  capabilities to ensure optimal resource utilization across all departments.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-green-600">
                    <ShieldCheckIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">Secure and reliable</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">Real-time analytics</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">Multi-department support</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">System Access</h4>
                <p className="text-gray-600 text-sm mb-6">
                  To access the inventory system, please log in with your institutional credentials. 
                  Different access levels are available based on your role:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>Administrators:</strong> Full system access and management</li>
                  <li>• <strong>Managers:</strong> Department-level oversight and reporting</li>
                  <li>• <strong>Employees:</strong> Item check-in/out and basic operations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Institut Agronomique et Vétérinaire Hassan II. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2">IAV Inventory Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
