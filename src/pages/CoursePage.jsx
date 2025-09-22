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

  // Course data
  const courses = useMemo(() => [
    {
      id: 1,
      title: "Art & Culture",
      driveLink: "https://drive.google.com/drive/folders/1rv58lWu3FORi2v2WSZ4hwxIbrC4c9ugw?usp=drive_link",
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
      driveLink: "https://drive.google.com/drive/folders/1qTn6tEG8QjQYumflpgz3-8GVtnrrETin?usp=drive_link",
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
      driveLink: "https://drive.google.com/drive/folders/1Dihi3C410I_0Q6aw9KcvzThLW0ktdQCi?usp=drive_link",
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
      driveLink: "https://drive.google.com/drive/folders/1So8Zd0JBRIv_DHz3OnnQfZknOjiXmd_o?usp=drive_link",
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
      driveLink: "https://drive.google.com/drive/folders/1PL_CglTzsLZVCeCm2Vp_pgMRGh_qWcrn?usp=drive_link",
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
      driveLink: "https://drive.google.com/drive/folders/1Byoy-_ZK0UMveODD_6QtBErMsx50n5lQ?usp=drive_link",
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

  // Load files
  useEffect(() => {
    const base = import.meta.env.BASE_URL || '/';
    fetch(`${base}materials.json`)
      .then(res => res.ok ? res.json() : { files: [] })
      .then(data => {
        if (data && data.files && Array.isArray(data.files)) {
          fileStorage.importData({ files: data.files });
        }
        loadFiles();
      })
      .catch(() => loadFiles());
  }, [loadFiles]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf'];
      const maxSize = 50 * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF file only.');
        return;
      }
      if (file.size > maxSize) {
        alert('File size should be less than 50MB.');
        return;
      }
      file.name = sanitizeString(file.name, 120);
      setSelectedFile(file);
    }
  }, []);

  const handleUploadFile = useCallback(async () => {
    if (!selectedFile || !course) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => prev >= 90 ? 90 : prev + 10);
      }, 100);

      fileStorage.addLocalFile(selectedFile, { courseId: course.id, folder: course.title });

      setTimeout(() => {
        setUploadProgress(100);
        clearInterval(progressInterval);
        loadFiles();
        setSelectedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
        setShowUploadModal(false);
      }, 500);

    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [selectedFile, course, loadFiles]);

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
      if (success) loadFiles();
    }
  }, [loadFiles]);

  const getCourseFiles = useMemo(() => {
    if (!course) return [];
    const courseFiles = files.filter(file => file.folder === course.title);
    // Add Drive link as virtual file
    if (course.driveLink) {
      courseFiles.unshift({
        id: `drive-${course.id}`,
        name: `${course.title} Drive Resources`,
        type: "LINK",
        size: "-",
        uploaded: "-",
        folder: course.title,
        isDriveLink: true,
        driveLink: course.driveLink
      });
    }
    return courseFiles;
  }, [files, course]);

  const handleAddDriveLink = useCallback(() => {
    if (!course) return;
    if (!linkName.trim() || !linkUrl.trim()) {
      alert('Please provide both name and Google Drive link.');
      return;
    }
    const safeName = sanitizeString(linkName.trim(), 120);
    const safeUrl = sanitizeUrl(linkUrl.trim());
    if (!safeUrl) {
      alert('Invalid URL.');
      return;
    }
    fileStorage.addDriveLink({
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
  }, [course, linkName, linkUrl, linkDesc, loadFiles]);

  if (!course) return <div>Course not found</div>;

  return (
    <div className="dashboard-container">
      {/* --- rest of your JSX remains exactly the same --- */}

      {/* Course Files */}
      <div className="content-area custom-scrollbar">
        {getCourseFiles.map(file => (
          <div key={file.id} className="file-item">
            <div className="file-thumbnail">{file.type === "LINK" ? "🔗" : "📄"}</div>
            <div className="file-info">
              <h4>{file.name}</h4>
              {file.description && <p>{file.description}</p>}
              <p>{file.size} • {file.uploaded}</p>
            </div>
            <div className="file-actions">
              {file.isDriveLink ? (
                <a href={file.driveLink} target="_blank" rel="noopener noreferrer" className="btn btn-drive">
                  Open Drive
                </a>
              ) : (
                <>
                  <button onClick={() => handleDownloadFile(file.id)}><Download /></button>
                  <button onClick={() => { setCurrentFile(file); setShowFileModal(true); }}><Eye /></button>
                  <button onClick={() => handleDeleteFile(file.id)}><Trash2 /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- Modals (Upload, File Details, Add Drive Link) remain unchanged --- */}
    </div>
  );
}
