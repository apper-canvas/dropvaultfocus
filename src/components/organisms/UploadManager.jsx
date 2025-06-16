import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DropZone from '@/components/molecules/DropZone';
import ProgressBar from '@/components/molecules/ProgressBar';
import ApperIcon from '@/components/ApperIcon';
import { fileService, uploadQueueService } from '@/services';

const UploadManager = ({ onUploadComplete }) => {
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const simulateUpload = async (file, queueItem) => {
    const updateProgress = async (progress, speed = 0, timeRemaining = 0) => {
      await uploadQueueService.update(queueItem.fileId, {
        progress,
        speed,
        timeRemaining,
        status: progress >= 100 ? 'completed' : 'uploading'
      });
      
      setUploadQueue(prev => 
        prev.map(item => 
          item.fileId === queueItem.fileId 
            ? { ...item, progress, speed, timeRemaining, status: progress >= 100 ? 'completed' : 'uploading' }
            : item
        )
      );
    };

    // Simulate upload progress
    const fileSize = file.size;
    let uploadedBytes = 0;
    const chunkSize = Math.max(fileSize / 20, 1024 * 100); // At least 100KB chunks
    const baseSpeed = 1024 * 1024 * 2; // 2MB/s base speed
    
    while (uploadedBytes < fileSize) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      uploadedBytes = Math.min(uploadedBytes + chunkSize, fileSize);
      const progress = (uploadedBytes / fileSize) * 100;
      const speed = baseSpeed + (Math.random() - 0.5) * baseSpeed * 0.3;
      const timeRemaining = (fileSize - uploadedBytes) / speed;
      
      await updateProgress(progress, speed, timeRemaining);
    }

    // Complete upload
    const thumbnailUrl = fileService.generateThumbnail(file);
    const newFile = await fileService.create({
      name: file.name,
      size: file.size,
      type: file.type,
      thumbnailUrl
    });

    return newFile;
  };

  const handleFilesAdded = async (files) => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Add files to upload queue
      const queueItems = [];
      for (const file of files) {
        const queueItem = await uploadQueueService.create({
          fileId: `upload_${Date.now()}_${Math.random()}`,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          status: 'pending'
        });
        queueItems.push({ ...queueItem, file });
      }

      setUploadQueue(prev => [...prev, ...queueItems]);

      // Process uploads
      const uploadPromises = queueItems.map(async (queueItem) => {
        try {
          const uploadedFile = await simulateUpload(queueItem.file, queueItem);
          
          // Remove from queue after completion
          setTimeout(() => {
            setUploadQueue(prev => prev.filter(item => item.fileId !== queueItem.fileId));
            uploadQueueService.delete(queueItem.fileId);
          }, 2000);

          return uploadedFile;
        } catch (error) {
          // Update queue item with error status
          await uploadQueueService.update(queueItem.fileId, { status: 'error' });
          setUploadQueue(prev => 
            prev.map(item => 
              item.fileId === queueItem.fileId 
                ? { ...item, status: 'error' }
                : item
            )
          );
          throw error;
        }
      });

      const uploadedFiles = await Promise.allSettled(uploadPromises);
      const successfulUploads = uploadedFiles
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      if (successfulUploads.length > 0) {
        toast.success(`${successfulUploads.length} file${successfulUploads.length > 1 ? 's' : ''} uploaded successfully`);
        if (onUploadComplete) {
          onUploadComplete(successfulUploads);
        }
      }

      const failedUploads = uploadedFiles.filter(result => result.status === 'rejected');
      if (failedUploads.length > 0) {
        toast.error(`${failedUploads.length} file${failedUploads.length > 1 ? 's' : ''} failed to upload`);
      }

    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = async (fileId) => {
    try {
      await uploadQueueService.delete(fileId);
      setUploadQueue(prev => prev.filter(item => item.fileId !== fileId));
      toast.info('Upload cancelled');
    } catch (error) {
      toast.error('Failed to cancel upload');
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <DropZone
        onFilesAdded={handleFilesAdded}
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        maxSize={50 * 1024 * 1024} // 50MB
        disabled={isUploading}
      />

      {/* Upload Queue */}
      <AnimatePresence>
        {uploadQueue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <ApperIcon name="Upload" className="w-4 h-4" />
              <span>Uploading {uploadQueue.length} file{uploadQueue.length > 1 ? 's' : ''}</span>
            </div>
            
            {uploadQueue.map((item) => (
              <ProgressBar
                key={item.fileId}
                progress={item.progress || 0}
                speed={item.speed || 0}
                timeRemaining={item.timeRemaining || 0}
                fileName={item.fileName || item.file?.name || 'Unknown file'}
                status={item.status}
                onCancel={() => handleCancelUpload(item.fileId)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadManager;