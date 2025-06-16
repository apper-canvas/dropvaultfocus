const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let files = [];

// Load initial data
import initialFiles from '../mockData/files.json';
files = [...initialFiles];

const fileService = {
  async getAll() {
    await delay(300);
    return [...files];
  },

  async getById(id) {
    await delay(200);
    const file = files.find(f => f.id === id);
    return file ? { ...file } : null;
  },

  async create(fileData) {
    await delay(400);
    const newFile = {
      id: Date.now().toString(),
      uploadDate: new Date().toISOString(),
      progress: 100,
      ...fileData
    };
    files.unshift(newFile);
    return { ...newFile };
  },

  async update(id, updates) {
    await delay(300);
    const index = files.findIndex(f => f.id === id);
    if (index !== -1) {
      files[index] = { ...files[index], ...updates };
      return { ...files[index] };
    }
    throw new Error('File not found');
  },

  async delete(id) {
    await delay(250);
    const index = files.findIndex(f => f.id === id);
    if (index !== -1) {
      const deletedFile = files[index];
      files.splice(index, 1);
      return { ...deletedFile };
    }
    throw new Error('File not found');
  },

  async search(query) {
    await delay(200);
    if (!query.trim()) return [...files];
    
    const searchTerm = query.toLowerCase();
    return files.filter(file => 
      file.name.toLowerCase().includes(searchTerm) ||
      file.type.toLowerCase().includes(searchTerm)
    );
  },

  generateThumbnail(file) {
    // Simulate thumbnail generation for images
    if (file.type.startsWith('image/')) {
      return `https://picsum.photos/200/200?random=${Date.now()}`;
    }
    return null;
  }
};

export default fileService;