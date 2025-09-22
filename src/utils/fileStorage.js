// File Storage Utility for UPSC Portal
import secureStorage from './secureStorage';

class FileStorage {
  constructor() {
    this.storageKey = 'upsc-portal-materials';
    this.files = this.loadFiles();
  }

  // Load files from localStorage
  loadFiles() {
    try {
      const stored = secureStorage.getItem(this.storageKey);
      return stored ? stored : [];
    } catch (error) {
      console.error('Error loading files:', error);
      return [];
    }
  }

  // Save files to localStorage
  saveFiles() {
    try {
      secureStorage.setItem(this.storageKey, this.files);
    } catch (error) {
      console.error('Error saving files:', error);
    }
  }

  // Add a new local file (frontend-only, small files). Uses object URL; not persistent across reloads
  addLocalFile(file, { courseId, folder = 'General' } = {}) {
    const fileData = {
      id: Date.now() + Math.random(),
      name: file.name,
      type: this.getFileType(file.name),
      size: this.formatFileSize(file.size),
      uploaded: 'Just now',
      folder: folder,
      courseId: courseId || null,
      // Use object URL for runtime access; will be invalid after reload
      url: URL.createObjectURL(file),
      source: 'LOCAL_RUNTIME',
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    this.files.push(fileData);
    this.saveFiles();
    return fileData;
  }

  // Add a Google Drive link as material
  addDriveLink({ name, driveLink, courseId, folder = 'General', description = '' }) {
    const fileData = {
      id: Date.now() + Math.random(),
      name: name || 'Material',
      type: 'LINK',
      size: '0 Bytes',
      uploaded: 'Just now',
      folder,
      courseId: courseId || null,
      url: driveLink,
      driveLink,
      description,
      source: 'DRIVE',
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    this.files.push(fileData);
    this.saveFiles();
    return fileData;
  }

  // Get all files
  getAllFiles() {
    return this.files;
  }

  // Get files by folder
  getFilesByFolder(folder) {
    return this.files.filter(file => file.folder === folder);
  }

  // Get files by course
  getFilesByCourse(courseId) {
    return this.files.filter(file => file.courseId === courseId);
  }

  // Get file by ID
  getFileById(id) {
    return this.files.find(file => file.id === id);
  }

  // Delete file
  deleteFile(id) {
    const index = this.files.findIndex(file => file.id === id);
    if (index > -1) {
      this.files.splice(index, 1);
      this.saveFiles();
      return true;
    }
    return false;
  }

  // Rename file
  renameFile(id, newName) {
    const file = this.getFileById(id);
    if (file) {
      file.name = newName;
      file.lastModified = new Date().toISOString();
      this.saveFiles();
      return true;
    }
    return false;
  }

  // Move file to different folder
  moveFile(id, newFolder) {
    const file = this.getFileById(id);
    if (file) {
      file.folder = newFolder;
      file.lastModified = new Date().toISOString();
      this.saveFiles();
      return true;
    }
    return false;
  }

  // Get file type from extension
  getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const typeMap = {
      'pdf': 'PDF',
      'doc': 'DOC',
      'docx': 'DOC',
      'txt': 'TXT',
      'zip': 'ZIP',
      'rar': 'RAR',
      'jpg': 'IMAGE',
      'jpeg': 'IMAGE',
      'png': 'IMAGE',
      'gif': 'IMAGE',
      'mp4': 'VIDEO',
      'avi': 'VIDEO',
      'mp3': 'AUDIO',
      'wav': 'AUDIO',
      'xlsx': 'EXCEL',
      'xls': 'EXCEL',
      'pptx': 'POWERPOINT',
      'ppt': 'POWERPOINT'
    };
    return typeMap[extension] || 'PDF'; // Default to PDF for UPSC study materials
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get file icon
  getFileIcon(type) {
    const iconMap = {
      'PDF': '📚',
      'DOC': '📝',
      'TXT': '📄',
      'ZIP': '📦',
      'RAR': '📦',
      'IMAGE': '🖼️',
      'VIDEO': '🎥',
      'AUDIO': '🎵',
      'EXCEL': '📊',
      'POWERPOINT': '📈',
      'LINK': '🔗',
      'FILE': '📁'
    };
    return iconMap[type] || '📚'; // Default to book icon for PDFs
  }

  // Search files
  searchFiles(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.files.filter(file => 
      file.name.toLowerCase().includes(lowercaseQuery) ||
      file.folder.toLowerCase().includes(lowercaseQuery) ||
      file.type.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get folders
  getFolders() {
    const folders = [...new Set(this.files.map(file => file.folder))];
    return folders.sort();
  }

  // Get file statistics
  getStats() {
    const totalFiles = this.files.length;
    const totalSize = this.files.reduce((sum, file) => {
      // Convert size back to bytes for calculation
      const sizeStr = file.size;
      const size = parseFloat(sizeStr);
      const unit = sizeStr.split(' ')[1];
      const multipliers = { 'Bytes': 1, 'KB': 1024, 'MB': 1024*1024, 'GB': 1024*1024*1024 };
      return sum + (size * (multipliers[unit] || 1));
    }, 0);

    const folders = this.getFolders().length;
    const fileTypes = [...new Set(this.files.map(file => file.type))].length;

    return {
      totalFiles,
      totalSize: this.formatFileSize(totalSize),
      folders,
      fileTypes
    };
  }

  // Export files data
  exportData() {
    return {
      files: this.files.map(file => ({
        ...file,
        file: null // Don't export the actual file object
      })),
      exportDate: new Date().toISOString()
    };
  }

  // Import files data
  importData(data) {
    try {
      if (data.files && Array.isArray(data.files)) {
        this.files = data.files;
        this.saveFiles();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Create a singleton instance
const fileStorage = new FileStorage();

export default fileStorage;


