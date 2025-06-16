import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ProgressBar = ({ 
  progress = 0, 
  speed = 0, 
  timeRemaining = 0, 
  fileName = '',
  onCancel,
  status = 'uploading',
  showCancel = true 
}) => {
  const formatSpeed = (bytesPerSecond) => {
    if (bytesPerSecond === 0) return '0 KB/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
    return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (seconds) => {
    if (seconds === 0 || !isFinite(seconds)) return '0s';
    if (seconds < 60) return Math.round(seconds) + 's';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m${remainingSeconds > 0 ? ` ${remainingSeconds}s` : ''}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'bg-accent';
      case 'error': return 'bg-red-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-primary';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'error': return 'AlertCircle';
      case 'pending': return 'Clock';
      default: return 'Upload';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg border border-surface-200 p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            status === 'completed' ? 'bg-accent/10 text-accent' :
            status === 'error' ? 'bg-red-100 text-red-600' :
            status === 'pending' ? 'bg-gray-100 text-gray-500' :
            'bg-primary/10 text-primary'
          }`}>
            <ApperIcon name={getStatusIcon()} className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {fileName}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{Math.round(progress)}%</span>
              {status === 'uploading' && speed > 0 && (
                <>
                  <span>{formatSpeed(speed)}</span>
                  <span>ETA {formatTime(timeRemaining)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {showCancel && status === 'uploading' && onCancel && (
          <Button
            size="sm"
            variant="ghost"
            icon="X"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          />
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full ${getStatusColor()} relative`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {status === 'uploading' && progress > 0 && progress < 100 && (
            <div 
              className="absolute inset-0 opacity-30 animate-progress-stripes"
              style={{
                backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.3) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.3) 75%)',
                backgroundSize: '1rem 1rem'
              }}
            />
          )}
        </motion.div>
      </div>

      {status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 text-sm text-accent font-medium"
        >
          Upload completed!
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 text-sm text-red-600 font-medium"
        >
          Upload failed. Please try again.
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressBar;