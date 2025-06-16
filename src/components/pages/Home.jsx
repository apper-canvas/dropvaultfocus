import { useState } from 'react';
import { motion } from 'framer-motion';
import UploadManager from '@/components/organisms/UploadManager';
import FileGrid from '@/components/organisms/FileGrid';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [totalFiles, setTotalFiles] = useState(0);

  const handleUploadComplete = (uploadedFiles) => {
    // Refresh the file grid by triggering a re-render
    setSearchQuery(''); // Reset search to show all files
  };

  const handleFilesChange = (files) => {
    setTotalFiles(files.length);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                File Manager
              </h1>
              <p className="text-gray-600">
                Upload, organize, and manage your files with ease
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Files" className="w-4 h-4" />
                <span>{totalFiles} files</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search files by name or type..."
            />
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <UploadManager onUploadComplete={handleUploadComplete} />
        </motion.div>

        {/* Files Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Your Files'}
            </h2>
          </div>
          
          <FileGrid
            searchQuery={searchQuery}
            onFilesChange={handleFilesChange}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;