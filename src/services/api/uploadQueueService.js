const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let uploadQueue = [];

const uploadQueueService = {
  async getAll() {
    await delay(100);
    return [...uploadQueue];
  },

  async getById(fileId) {
    await delay(100);
    const item = uploadQueue.find(q => q.fileId === fileId);
    return item ? { ...item } : null;
  },

  async create(queueItem) {
    await delay(100);
    const newItem = {
      fileId: Date.now().toString(),
      progress: 0,
      speed: 0,
      timeRemaining: 0,
      status: 'pending',
      ...queueItem
    };
    uploadQueue.push(newItem);
    return { ...newItem };
  },

  async update(fileId, updates) {
    await delay(100);
    const index = uploadQueue.findIndex(q => q.fileId === fileId);
    if (index !== -1) {
      uploadQueue[index] = { ...uploadQueue[index], ...updates };
      return { ...uploadQueue[index] };
    }
    throw new Error('Queue item not found');
  },

  async delete(fileId) {
    await delay(100);
    const index = uploadQueue.findIndex(q => q.fileId === fileId);
    if (index !== -1) {
      const deletedItem = uploadQueue[index];
      uploadQueue.splice(index, 1);
      return { ...deletedItem };
    }
    throw new Error('Queue item not found');
  },

  async clear() {
    await delay(100);
    uploadQueue = [];
    return true;
  }
};

export default uploadQueueService;