import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40 px-6">
      <div className="h-full flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Upload" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">DropVault</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search files..."
          />
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Files" className="w-4 h-4" />
            <span>Total Files</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;