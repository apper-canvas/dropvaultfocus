import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import FileCard from '@/components/molecules/FileCard';
import ConfirmDialog from '@/components/molecules/ConfirmDialog';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import { fileService } from '@/services';

const FileGrid = ({ searchQuery, onFilesChange }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, fileId: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (searchQuery?.trim()) {
      searchFiles(searchQuery);
    } else {
      loadFiles();
    }
  }, [searchQuery]);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fileService.getAll();
      setFiles(result);
      if (onFilesChange) {
        onFilesChange(result);
      }
    } catch (err) {
      setError(err.message || 'Failed to load files');
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const searchFiles = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fileService.search(query);
      setFiles(result);
    } catch (err) {
      setError(err.message || 'Failed to search files');
      toast.error('Failed to search files');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = (fileId) => {
    setDeleteDialog({ isOpen: true, fileId });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.fileId) return;
    
    setDeleting(true);
    try {
      await fileService.delete(deleteDialog.fileId);
      setFiles(prev => prev.filter(f => f.id !== deleteDialog.fileId));
      toast.success('File deleted successfully');
      
      // Update parent component
      if (onFilesChange) {
        const updatedFiles = files.filter(f => f.id !== deleteDialog.fileId);
        onFilesChange(updatedFiles);
      }
    } catch (err) {
      toast.error('Failed to delete file');
    } finally {
      setDeleting(false);
      setDeleteDialog({ isOpen: false, fileId: null });
    }
  };

  const handlePreview = (file) => {
    if (file.thumbnailUrl) {
      // Open image in new tab for preview
      window.open(file.thumbnailUrl, '_blank');
    }
  };

  if (loading) {
    return <SkeletonLoader count={6} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadFiles}
      />
    );
  }

  if (files.length === 0) {
    return (
      <EmptyState 
        title="No files found"
        description={searchQuery ? "No files match your search criteria" : "Upload your first file to get started"}
        actionLabel={searchQuery ? null : "Upload Files"}
        onAction={searchQuery ? null : () => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AnimatePresence>
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <FileCard
                file={file}
                onDelete={handleDeleteFile}
                onPreview={handlePreview}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, fileId: null })}
        onConfirm={confirmDelete}
        title="Delete File"
        message="Are you sure you want to delete this file? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={deleting}
      />
    </>
  );
};

export default FileGrid;