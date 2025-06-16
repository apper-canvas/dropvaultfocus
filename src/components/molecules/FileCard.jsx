import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const FileCard = ({ file, onDelete, onPreview }) => {
  const [imageError, setImageError] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'Image';
    if (type.includes('pdf')) return 'FileText';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'Sheet';
    if (type.includes('presentation') || type.includes('powerpoint')) return 'Presentation';
    if (type.includes('document') || type.includes('word')) return 'FileText';
    if (type.includes('video/')) return 'Video';
    if (type.includes('audio/')) return 'Music';
    return 'File';
  };

  const getFileTypeColor = (type) => {
    if (type.startsWith('image/')) return 'text-green-600 bg-green-100';
    if (type.includes('pdf')) return 'text-red-600 bg-red-100';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'text-emerald-600 bg-emerald-100';
    if (type.includes('presentation')) return 'text-orange-600 bg-orange-100';
    if (type.includes('document')) return 'text-blue-600 bg-blue-100';
    if (type.includes('video/')) return 'text-purple-600 bg-purple-100';
    if (type.includes('audio/')) return 'text-pink-600 bg-pink-100';
    return 'text-gray-600 bg-gray-100';
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(file);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(file.id);
    }
  };

return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-surface-200 h-80 flex flex-col"
    >
      {/* Thumbnail/Icon Section */}
      <div className="aspect-square bg-surface-50 flex items-center justify-center relative overflow-hidden">
        {file.thumbnailUrl && !imageError ? (
          <img
            src={file.thumbnailUrl}
            alt={file.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getFileTypeColor(file.type)}`}>
            <ApperIcon name={getFileIcon(file.type)} className="w-8 h-8" />
          </div>
        )}
        
        {/* Preview Button Overlay */}
        {file.type.startsWith('image/') && (
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            onClick={handlePreview}
            className="absolute inset-0 bg-black/40 flex items-center justify-center text-white"
          >
            <ApperIcon name="Eye" className="w-6 h-6" />
          </motion.button>
        )}
      </div>
{/* File Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-gray-900 text-sm mb-1 break-words leading-tight line-clamp-2">
            {file.name}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>{formatFileSize(file.size)}</span>
            <span>{format(new Date(file.uploadDate), 'MMM d')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
{file.type.startsWith('image/') && (
            <Button
              size="sm"
              variant="ghost"
              icon="Eye"
              onClick={handlePreview}
              className="flex-1"
            >
              Preview
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            icon="Trash2"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;