import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  Settings,
  BookOpen,
  Clock,
  Star,
  User
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import fileStorage from "../utils/fileStorage";
import { sanitizeString, sanitizeUrl } from "../utils/sanitize";
import "../styles/dashboard.css";

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDesc, setLinkDesc] = useState('');

  // Course data - in real app, this would come from API
  const courses = useMemo(() => [
    {
      id: 1,
      title: "Art & Culture",
      instructor: "You (Owner)",
      duration: "4 months",
      students: 1200,
      rating: 4.8,
      price: "FREE",
      status: "Active",
      progress: 70,
      thumbnail: "🎨",
      description: "Comprehensive coverage of Indian art, architecture, literature, music, dance, and cultural heritage",
      isOwner: true,
      fileCount: 0
    },
    {
      id: 2,
      title: "Economics",
      instructor: "You (Owner)",
      duration: "5 months",
      students: 1350,
      rating: 4.9,
      price: "FREE",
      status: "Active",
      progress: 45,
      thumbnail: "💰",
      description: "Indian economy, economic planning, budget, banking, and international economics",
      isOwner: true,
      fileCount: 0
    },
    {
      id: 3,
      title: "Geography",
      instructor: "You (Owner)",
      duration: "4 months",
      students: 1100,
      rating: 4.7,
      price: "FREE",
      status: "Active",
      progress: 60,
      thumbnail: "🌍",
      description: "Physical geography, human geography, Indian geography, and environmental issues",
      isOwner: true,
      fileCount: 0
    },
    {
      id: 4,
      title: "History",
      instructor: "You (Owner)",
      duration: "6 months",
      students: 1500,
      rating: 4.8,
      price: "FREE",
      status: "Active",
      progress: 55,
      thumbnail: "🏺",
      description: "Ancient, medieval, and modern Indian history with world history",
      isOwner: true,
      fileCount: 0
    },
    {
      id: 5,
      title: "Polity",
      instructor: "You (Owner)",
      duration: "3 months",
      students: 1400,
      rating: 4.9,
      price: "FREE",
      status: "Active",
      progress: 80,
      thumbnail: "🏛️",
      description: "Indian Constitution, governance, political system, and current affairs",
      isOwner: true,
      fileCount: 0
    },
    {
      id: 6,
      title: "Science & Technology",
      instructor: "You (Owner)",
      duration: "4 months",
      students: 950,
      rating: 4.6,
      price: "FREE",
      status: "Active",
      progress: 30,
      thumbnail: "🔬",
      description: "Physics, chemistry, biology, space technology, and recent scientific developments",
      isOwner: true,
      fileCount: 0
    }
  ], []);

  const course = useMemo(() => {
    return courses.find(c => c.id === parseInt(courseId));
  }, [courses, courseId]);

  const loadFiles = useCallback(() => {
    const allFiles = fileStorage.getAllFiles();
    setFiles(allFiles);
  }, []);

  // Load files on component mount
  useEffect(() => {
    // Load shared materials from static JSON once, then local
    const base = import.meta.env.BASE_URL || '/';
    fetch(`${base}materials.json`)
      .then(res => res.ok ? res.json() : { files: [] })
      .then(data => {
        if (data && data.files && Array.isArray(data.files)) {
          // Import without file blobs
          fileStorage.importData({ files: data.files });
        }
        loadFiles();
      })
      .catch(() => {
        loadFiles();
      });
  }, [loadFiles]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF file only. Other file types are not supported.');
        return;
      }
      
      if (file.size > maxSize) {
        alert('File size should be less than 50MB. Please select a smaller file.');
        return;
      }
      
      // Sanitize filename for display
      file.name = sanitizeString(file.name, 120);
      setSelectedFile(file);
      console.log("PDF file selected:", file.name, "Size:", (file.size / 1024 / 1024).toFixed(2) + "MB");
    }
  }, []);

  const handleUploadFile = useCallback(async () => {
    if (!selectedFile || !course) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const fileData = fileStorage.addLocalFile(selectedFile, { courseId: course.id, folder: course.title });
      
      setTimeout(() => {
        setUploadProgress(100);
        clearInterval(progressInterval);
        
        loadFiles();
        
        setSelectedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
        setShowUploadModal(false);
        
        console.log(`File uploaded successfully to ${course.title}:`, fileData.name);
      }, 500);

    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [selectedFile, course, loadFiles]);

  const handleAddDriveLink = useCallback(() => {
    if (!course) return;
    if (!linkName.trim() || !linkUrl.trim()) {
      alert('Please provide both name and Google Drive link.');
      return;
    }
    try {
      const safeName = sanitizeString(linkName.trim(), 120);
      const safeUrl = sanitizeUrl(linkUrl.trim());
      if (!safeUrl) {
        alert('Invalid URL. Only http/https links are allowed.');
        return;
      }
      const item = fileStorage.addDriveLink({
        name: safeName,
        driveLink: safeUrl,
        description: sanitizeString(linkDesc.trim(), 200),
        courseId: course.id,
        folder: course.title
      });
      setLinkName('');
      setLinkUrl('');
      setLinkDesc('');
      setShowLinkModal(false);
      loadFiles();
      console.log('Drive link added:', item.name);
    } catch (e) {
      console.error('Failed to add link', e);
    }
  }, [course, linkName, linkUrl, linkDesc, loadFiles]);

  const handleDownloadFile = useCallback((fileId) => {
    const file = fileStorage.getFileById(fileId);
    if (file && file.file) {
      const url = URL.createObjectURL(file.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, []);

  const handleDeleteFile = useCallback((fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      const success = fileStorage.deleteFile(fileId);
      if (success) {
        loadFiles();
        console.log("File deleted successfully");
      }
    }
  }, [loadFiles]);

  const getCourseFiles = useMemo(() => {
    if (!course) return [];
    return files.filter(file => file.folder === course.title);
  }, [files, course]);

  if (!course) {
    return (
      <div className="dashboard-container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h1 style={{ color: 'white', fontSize: '32px' }}>Course Not Found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header-container">
        <div className="logo-container">
          <div className="logo-icon">📚</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              UPSC Portal
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              {course.title} - Course Page
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '8px',
              padding: '8px 15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.1)';
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="main-content">
        {/* Main Content */}
        <div className="content-area custom-scrollbar">
          {/* Course Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                {course.title}
              </h1>
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
                Study Materials & Resources
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowUploadModal(true)}
              style={{
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <Upload size={16} />
                Add Files
              </button>
              <button
                onClick={() => setShowLinkModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🔗 Add Drive Link
              </button>
            </div>
          </div>

          {/* Course Info Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px'
              }}>
                {course.thumbnail}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
                  {course.title}
                </h2>
                <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
                  {course.description}
                </p>
                <div style={{ display: 'flex', gap: '30px', color: '#666', fontSize: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} />
                    <span>{course.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} />
                    <span>{course.students} Students</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={16} color="#ffa500" />
                    <span>{course.rating} Rating</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={16} />
                    <span>{getCourseFiles.length} Files</span>
                  </div>
                </div>
              </div>
              <div style={{
                background: course.price === 'FREE' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {course.price}
              </div>
            </div>
          </div>

          {/* Course Files */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxHeight: '60vh',
            overflowY: 'auto'
          }} className="custom-scrollbar">
            <h3 style={{ margin: '0 0 25px 0', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              Course Materials ({getCourseFiles.length})
            </h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {getCourseFiles.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px',
                  color: '#666'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.5 }}>📚</div>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '24px', fontWeight: '600' }}>
                    No files uploaded yet
                  </h3>
                  <p style={{ margin: '0 0 25px 0', fontSize: '16px' }}>
                    Upload your first study material to get started with {course.title}
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    style={{
                      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 24px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    Upload First File
                  </button>
                </div>
              ) : (
                getCourseFiles.map(file => (
                  <div
                    key={file.id}
                    className="file-item"
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px'
                    }}>
                      {fileStorage.getFileIcon(file.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>
                        {file.name}
                      </h4>
                      <div style={{ display: 'flex', gap: '25px', color: '#666', fontSize: '14px' }}>
                        <span>Type: {file.type}</span>
                        <span>Size: {file.size}</span>
                        <span>Uploaded: {file.uploaded}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {file.type === 'LINK' ? (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                          title="Open link"
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                        >
                          🔗
                        </a>
                      ) : (
                        <button 
                          onClick={() => handleDownloadFile(file.id)}
                          className="btn-secondary"
                          title="Download file"
                        >
                          <Download size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setCurrentFile(file);
                          setShowFileModal(true);
                        }}
                        className="btn-secondary"
                        title="View file details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteFile(file.id)}
                        className="btn-danger"
                        title="Delete file"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
              Upload to {course.title}
            </h3>
            <div style={{
              border: '2px dashed #e1e5e9',
              borderRadius: '10px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>{course.thumbnail}</div>
              <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>
                Upload PDF Study Material
              </p>
              <p style={{ color: '#888', margin: '0 0 15px 0', fontSize: '14px' }}>
                Add study materials to your {course.title} course<br/>
                <span style={{ color: '#667eea', fontSize: '12px' }}>Maximum file size: 50MB</span>
              </p>
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="course-file-upload"
                accept=".pdf,application/pdf"
              />
              <label
                htmlFor="course-file-upload"
                style={{
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'inline-block',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Choose PDF Files
              </label>
            </div>

            {selectedFile && (
              <div style={{
                background: 'rgba(76, 175, 80, 0.1)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '20px' }}>📄</div>
                  <div>
                    <p style={{ margin: 0, color: '#333', fontSize: '14px', fontWeight: '600' }}>
                      {selectedFile.name}
                    </p>
                    <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Type: PDF
                    </p>
                  </div>
                </div>
                <div style={{ 
                  background: 'rgba(76, 175, 80, 0.05)', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#4CAF50'
                }}>
                  ✓ Ready to upload to {course.title} course
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadFile}
                disabled={!selectedFile || isUploading}
                style={{
                  background: isUploading ? '#ccc' : 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: isUploading ? 0.7 : 1
                }}
              >
                {isUploading ? `Uploading to ${course.title}... ${uploadProgress}%` : `Upload to ${course.title}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Details Modal */}
      {showFileModal && currentFile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
              File Details
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {fileStorage.getFileIcon(currentFile.type)}
              </div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>
                  {currentFile.name}
                </h4>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  {currentFile.type} • {currentFile.size}
                </p>
                {currentFile.type === 'LINK' && (
                  <p style={{ margin: '6px 0 0 0', fontSize: '12px' }}>
                    <a href={currentFile.url} target="_blank" rel="noopener noreferrer">Open Google Drive link</a>
                  </p>
                )}
              </div>
            </div>

            <div style={{
              background: 'rgba(102, 126, 234, 0.05)',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: '#666' }}>Course:</span>
                  <span style={{ color: '#333', fontWeight: '500', marginLeft: '8px' }}>{currentFile.folder}</span>
                </div>
                <div>
                  <span style={{ color: '#666' }}>Uploaded:</span>
                  <span style={{ color: '#333', fontWeight: '500', marginLeft: '8px' }}>{currentFile.uploaded}</span>
                </div>
                <div>
                  <span style={{ color: '#666' }}>Type:</span>
                  <span style={{ color: '#333', fontWeight: '500', marginLeft: '8px' }}>{currentFile.type}</span>
                </div>
                <div>
                  <span style={{ color: '#666' }}>Size:</span>
                  <span style={{ color: '#333', fontWeight: '500', marginLeft: '8px' }}>{currentFile.size}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowFileModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
              {currentFile.type !== 'LINK' ? (
                <button
                  onClick={() => {
                    handleDownloadFile(currentFile.id);
                    setShowFileModal(false);
                  }}
                  className="btn-primary"
                >
                  Download
                </button>
              ) : (
                <a
                  href={currentFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => setShowFileModal(false)}
                >
                  Open Link
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Drive Link Modal */}
      {showLinkModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '30px', width: '90%', maxWidth: '520px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>Add Google Drive Link</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <input
                type="text"
                placeholder="Material name (e.g., UPSC 2025 Full Pack)"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e1e5e9' }}
              />
              <input
                type="url"
                placeholder="Google Drive link (Anyone with link: Viewer)"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e1e5e9' }}
              />
              <textarea
                placeholder="Short description (optional)"
                value={linkDesc}
                onChange={(e) => setLinkDesc(e.target.value)}
                rows={3}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e1e5e9', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '18px' }}>
              <button className="btn-secondary" onClick={() => { setShowLinkModal(false); setLinkName(''); setLinkUrl(''); setLinkDesc(''); }}>Cancel</button>
              <button className="btn-primary" onClick={handleAddDriveLink}>Add Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

