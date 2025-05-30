import React from 'react';
import { Scissors } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Scissors className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-bold text-gray-800">BG Remover</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Home</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">How It Works</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;