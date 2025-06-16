import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  message = "Something went wrong", 
  onRetry,
  title = "Error",
  icon = "AlertCircle" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
      >
        <ApperIcon name={icon} className="w-8 h-8 text-red-600" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          icon="RefreshCw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;