import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'grid' }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {skeletons.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden"
          >
            {/* Thumbnail skeleton */}
            <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
              </div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {skeletons.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;