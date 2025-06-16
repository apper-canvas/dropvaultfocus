import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const DropZone = ({ onFilesAdded, accept, maxSize, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter - 1 === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      // Check file type if accept is specified
      if (accept && !accept.includes(file.type)) {
        return false;
      }
      // Check file size if maxSize is specified
      if (maxSize && file.size > maxSize) {
        return false;
      }
      return true;
    });

    if (validFiles.length > 0 && onFilesAdded) {
      onFilesAdded(validFiles);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <motion.div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragging ? '#5B21B6' : '#E5E7EB',
          backgroundColor: isDragging ? '#F3F4F6' : '#FFFFFF',
          scale: isDragging ? 1.02 : 1
        }}
        transition={{ duration: 0.2 }}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200 hover:border-primary hover:bg-surface-50
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isDragging ? 'border-primary bg-surface-50' : 'border-surface-300'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />

        <AnimatePresence mode="wait">
          {isDragging ? (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4"
              >
                <ApperIcon name="Upload" className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Drop files here
              </h3>
              <p className="text-gray-600">
                Release to upload your files
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4">
                <ApperIcon name="Upload" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload your files
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop files here, or click to browse
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {accept && (
                  <span className="px-2 py-1 bg-surface-100 rounded">
                    {accept.replace(/\//g, '/').toUpperCase()}
                  </span>
                )}
                {maxSize && (
                  <span className="px-2 py-1 bg-surface-100 rounded">
                    Max {formatFileSize(maxSize)}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DropZone;