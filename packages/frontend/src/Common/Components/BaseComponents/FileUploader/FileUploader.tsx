import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, LinearProgress, IconButton, Chip } from '@mui/material';
import { Upload, X, CheckCircle, AlertCircle, File, Image, FileText, LogIn, ExternalLink, Copy } from 'lucide-react';
import { designSystem, spacing } from '../styles/theme'
import { LoginResponse } from 'shared-types';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../../../Stores/CoreAndIntegration/useAuthStore';
import { showAlert } from '../ShowAlert';
import { Button, Button as CustomButton } from '../../BaseComponents/Button';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'application/zip'
];
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});
export interface FileUploadRequest {
  file: File;
  folderId?: string;
  category: 'חוזה' | 'חשבונית' | 'קבלה' | 'שונות';
  customerId?: string;
  description?: string;
}
export interface FileItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  fileUrl?: string
  errorMessage?: string;
}
export interface FileUploaderProps {
 folderPath: string;
  onFilesUploaded?: (files: FileItem[]) => void;
}
const FileUploader: React.FC<FileUploaderProps> = ({ folderPath, onFilesUploaded }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [category, setCategory] = useState<'חוזה' | 'חשבונית' | 'קבלה' | 'שונות'>('שונות');
  const [customerId, setCustomerId] = useState<string>('');
  const [folderId, setFolderId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const { setUser, setSessionId } = useAuthStore();
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      console.log(':inbox_tray: Files selected via input:', selectedFiles);
      addFiles(selectedFiles);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    console.log(':inbox_tray: Files dropped:', droppedFiles);
    addFiles(droppedFiles);
  };
  const addFiles = (newFiles: File[]) => {
    console.log(':inbox_tray: Adding files:', newFiles);
    const validFiles = newFiles.filter(file => {
      // בדיקת גודל קובץ
      if (file.size > MAX_FILE_SIZE) {
        showAlert(
          'קובץ גדול מדי',
          `הקובץ "${file.name}" גדול מדי (${formatFileSize(file.size)}). מקסימום: ${formatFileSize(MAX_FILE_SIZE)}`,
          'warning'
        );
        return false;
      }
      // בדיקת סוג קובץ (אופציונלי)
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        console.warn(`:warning: סוג קובץ לא נתמך: ${file.type} עבור ${file.name}`);
        // לא חוסם, רק מזהיר
      }
      return true;
    });
    const filesWithId: FileItem[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      status: 'pending',
      progress: 0,
    }));
    setFiles(prev => {
      const updated = [...prev, ...filesWithId];
      console.log(':page_facing_up: Updated files list:', updated);
      return updated;
    });
  };
  const removeFile = (id: string) => {
    console.log(':wastebasket: Removing file with id:', id);
    setFiles(prev => prev.filter(file => file.id !== id));
  };
  const uploadFile = async (fileItem: FileItem, retryCount = 0) => {
    console.log(`:rocket: Starting upload for file "${fileItem.file.name}", attempt #${retryCount + 1}`);
    setFiles(prev =>
      prev.map(f =>
        f.id === fileItem.id ? { ...f, status: 'uploading', progress: 0 } : f
      )
    );
    const formData = new FormData();
    formData.append('file', fileItem.file);
    formData.append('category', category);
    formData.append('conflictResolution', 'rename'); // טיפול בקבצים כפולים
    if (customerId) formData.append('customerId', customerId);
    if (folderId) formData.append('folderId', folderId);
    if (description) formData.append('description', description);
    if (folderPath) formData.append('folderPath', folderPath);
    try {
      const res = await axios.post(
        'http://localhost:3001/api/drive/upload',
        // 'http://localhost:3001/v3/files',
        // 'http://localhost:3001/api/drive/upload/v3/files',
        formData,
        {
          withCredentials: true,
          timeout: 120000, // 2 דקות timeout לקבצים של 10MB
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setFiles(prev =>
                prev.map(f =>
                  f.id === fileItem.id ? { ...f, progress: percent } : f
                )
              );
              console.log(`:arrow_up: Upload progress for "${fileItem.file.name}": ${percent}%`);
            }
          }
        }
      );
      console.log(':inbox_tray: Response data:', res.data);
      const fileUrl = `https://drive.google.com/file/d/${res.data.id}/view`;
      console.log(':link: קישור לקובץ בדרייב:', fileUrl);
      setFiles(prev =>
        prev.map(f =>
          f.id === fileItem.id ? { ...f, status: 'success', progress: 100, fileUrl: fileUrl } : f
        )
      );
      if (onFilesUploaded) onFilesUploaded([{ ...fileItem, status: 'success', progress: 100, fileUrl: fileUrl }]);
      console.log(`:white_check_mark: Upload successful for "${fileItem.file.name}"`);
    } catch (error: any) {
      console.error(`:x: Upload failed for "${fileItem.file.name}"`, error);
      if (retryCount < 2) {
        console.log(`:arrows_counterclockwise: Retrying upload for "${fileItem.file.name}"`);
        uploadFile(fileItem, retryCount + 1);
      } else {
        // טיפול בשגיאות ספציפיות
        let errorMessage = 'שגיאה בהעלאה';
        if (error.response?.status === 413) {
          errorMessage = 'הקובץ גדול מדי';
        } else if (error.response?.status === 403) {
          errorMessage = 'אין הרשאות או מקום בדרייב';
        } else if (error.response?.status === 429) {
          errorMessage = 'יותר מדי בקשות - נסה שוב מאוחר יותר';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'זמן ההעלאה פג - הקובץ גדול מדי';
        }
        setFiles(prev =>
          prev.map(f =>
            f.id === fileItem.id ? { ...f, status: 'error', errorMessage } : f  // עדכון השגיאה
          )
        );
        showAlert(
          'שגיאה בהעלאה',
          `${errorMessage}: ${fileItem.file.name}`,
          'error'
        );
      }
    }
  };
  // עיצוב גודל קובץ לקריאה נוחה
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 בתים';
    const k = 1024;
    const sizes = ['בתים', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  // קבלת אייקון מתאים לפי סוג קובץ
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/'))
      return <Image size={24} color={designSystem.colors.primary} />;
    if (fileType === 'application/pdf')
      return <FileText size={24} color={designSystem.colors.error} />;
    return <File size={24} color={designSystem.colors.neutral[500]} />;
  };
  // קבלת אייקון סטטוס (הצלחה/שגיאה)
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={20} color={designSystem.colors.success} />;
      case 'error':
        return <AlertCircle size={20} color={designSystem.colors.error} />;
      default:
        return null;
    }
  };
  // קבלת תגית סטטוס (צ'יפ)
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label="ממתין" size="small" sx={{
          backgroundColor: designSystem.colors.neutral[100],
          color: designSystem.colors.neutral[700]
        }} />;
      case 'uploading':
        return <Chip label="מעלה..." size="small" sx={{
          backgroundColor: designSystem.colors.primary,
          color: 'white'
        }} />;
      case 'success':
        return <Chip label="הועלה בהצלחה" size="small" sx={{
          backgroundColor: designSystem.colors.success,
          color: 'white'
        }} />;
      case 'error':
        return <Chip label="שגיאה" size="small" sx={{
          backgroundColor: designSystem.colors.error,
          color: 'white'
        }} />;
      default:
        return null;
    }
  };

return (
    <Box sx={{
      maxWidth: 800,
      mx: 'auto',
      p: spacing(6),
      fontFamily: designSystem.typography.fontFamily.hebrew,
      direction: 'rtl'
    }}>
      {/* שדות העלאה מתקדמים */}
      {/* <Card sx={{ mb: spacing(6), p: spacing(4) }}>
        <Typography variant="h6" sx={{ mb: spacing(2) }}>פרטי העלאה</Typography>
        <Box sx={{ display: 'flex', gap: spacing(4), flexWrap: 'wrap' }}>
          <Box>
            <label>קטגוריה:</label>
            <select value={category} onChange={e => setCategory(e.target.value as any)} style={{ marginRight: 8 }}>
              <option value="חוזה">חוזה</option>
              <option value="חשבונית">חשבונית</option>
              <option value="קבלה">קבלה</option>
              <option value="שונות">שונות</option>
            </select>
          </Box>
          <Box>
            <label>מזהה לקוח:</label>
            <input value={customerId} onChange={e => setCustomerId(e.target.value)} style={{ marginRight: 8 }} />
          </Box>
          <Box>
            <label>מזהה תיקיה:</label>
            <input value={folderId} onChange={e => setFolderId(e.target.value)} style={{ marginRight: 8 }} />
          </Box>
          <Box>
            <label>תיאור:</label>
            <input value={description} onChange={e => setDescription(e.target.value)} style={{ marginRight: 8 }} />
          </Box>
        </Box>
        <Box>
          <label>נתיב תיקייה:</label>
          <input
            value={folderPath}
            onChange={e => setFolderPath(e.target.value)}
            placeholder="לדוגמה: פרויקטים/2024/מסמכים/שם_הקובץ.pdf"
            style={{ marginRight: 8, width: '300px' }}
          />
        </Box>
      </Card> */}
      {/* כותרת */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          color: designSystem.colors.primary,
          fontWeight: 'bold',
          mb: spacing(8),
          fontSize: designSystem.typography.fontSize['3xl']
        }}
      >
        :file_folder: העלאת קבצים ל-Google Drive
      </Typography>
      {/* אזור גרירה */}
      <Card
        sx={{
          mb: spacing(6),
          border: isDragOver
            ? `3px dashed ${designSystem.colors.primary}`
            : `2px dashed ${designSystem.colors.neutral[300]}`,
          backgroundColor: isDragOver
            ? designSystem.colors.neutral[50]
            : 'white',
          borderRadius: designSystem.borderRadius.lg,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            borderColor: designSystem.colors.primary,
            backgroundColor: designSystem.colors.neutral[50],
            boxShadow: designSystem.shadows.md
          }
        }}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <CardContent sx={{ textAlign: 'center', py: spacing(12) }}>
          <Box sx={{ mb: spacing(6) }}>
            <Upload
              size={80}
              color={isDragOver ? designSystem.colors.primary : designSystem.colors.neutral[300]}
              style={{ transition: 'color 0.3s ease' }}
            />
          </Box>
          <Typography variant="h5" gutterBottom sx={{
            color: designSystem.colors.neutral[700],
            fontSize: designSystem.typography.fontSize.xl,
            fontWeight: 600
          }}>
            גרור קבצים לכאן
          </Typography>
          <Typography variant="body1" sx={{
            color: designSystem.colors.neutral[500],
            mb: spacing(6),
            fontSize: designSystem.typography.fontSize.base
          }}>
            או לחץ לבחירת קבצים מהמחשב
          </Typography>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <CustomButton
            variant="primary"
            size="lg"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="flex items-center gap-2"
            style={{
              backgroundColor: designSystem.colors.primary,
              padding: `${spacing(3)}px ${spacing(8)}px`,
              fontSize: designSystem.typography.fontSize.lg,
              fontWeight: 600,
              borderRadius: designSystem.borderRadius.md,
            }}
          >
            <Upload size={20} />
            :file_folder: בחר קבצים מהמחשב
          </CustomButton>
        </CardContent>
      </Card>
      {/* רשימת קבצים */}
      {files.length > 0 && (
        <Card sx={{
          boxShadow: designSystem.shadows.lg,
          borderRadius: designSystem.borderRadius.lg,
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 0 }}>
            {/* כותרת רשימה */}
            <Box sx={{
              p: spacing(6),
              borderBottom: `1px solid ${designSystem.colors.neutral[200]}`,
              backgroundColor: designSystem.colors.neutral[50]
            }}>
              <Typography variant="h6" sx={{
                color: designSystem.colors.neutral[700],
                fontSize: designSystem.typography.fontSize.lg,
                fontWeight: 600
              }}>
                :clipboard: קבצים שנבחרו ({files.length})
              </Typography>
            </Box>
            {/* רשימת קבצים */}
            <Box sx={{ p: spacing(4) }}>
              {files.map((fileItem, index) => (
                <Card
                  key={fileItem.id}
                  sx={{
                    mb: index === files.length - 1 ? 0 : spacing(4),
                    border: `1px solid ${designSystem.colors.neutral[200]}`,
                    borderRadius: designSystem.borderRadius.md,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: designSystem.shadows.md,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
12:55
<CardContent sx={{ p: spacing(6) }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing(4) }}>
                      {/* אייקון קובץ */}
                      <Box sx={{
                        p: spacing(4),
                        borderRadius: designSystem.borderRadius.md,
                        backgroundColor: designSystem.colors.neutral[50],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getFileIcon(fileItem.file.type)}
                      </Box>
                      {/* תצוגה מקדימה */}
                      {fileItem.file.type.startsWith('image/') && (
                        <Box sx={{ mt: spacing(2) }}>
                          <img
                            src={URL.createObjectURL(fileItem.file)}
                            alt={fileItem.file.name}
                            style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '1px solid #eee' }}
                          />
                        </Box>
                      )}
                      {fileItem.file.type === 'application/pdf' && (
                        <Box sx={{ mt: spacing(2) }}>
                          <embed
                            src={URL.createObjectURL(fileItem.file)}
                            type="application/pdf"
                            width="120"
                            height="120"
                            style={{ borderRadius: 8, border: '1px solid #eee' }}
                          />
                        </Box>
                      )}
                      {/* פרטי קובץ */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{
                          color: designSystem.colors.neutral[900],
                          mb: spacing(1),
                          fontWeight: 600,
                          fontSize: designSystem.typography.fontSize.base
                        }}>
                          {fileItem.file.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing(4) }}>
                          <Typography variant="body2" sx={{
                            color: designSystem.colors.neutral[500],
                            fontSize: designSystem.typography.fontSize.sm
                          }}>
                            {formatFileSize(fileItem.file.size)}
                          </Typography>
                          {getStatusChip(fileItem.status)}
                          {fileItem.status === 'success' && fileItem.fileUrl && (
                            <Box sx={{ mt: spacing(2), display: 'flex', gap: spacing(1) }}>
                              <IconButton
                                size="small"
                                onClick={() => window.open(fileItem.fileUrl, '_blank')}
                                sx={{
                                  color: designSystem.colors.primary,
                                  '&:hover': {
                                    backgroundColor: designSystem.colors.primary + '10',
                                    transform: 'scale(1.1)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                                title="פתח בדרייב"
                              >
                                <ExternalLink size={18} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => navigator.clipboard.writeText(fileItem.fileUrl!)}
                                sx={{
                                  color: designSystem.colors.neutral[600],
                                  '&:hover': {
                                    backgroundColor: designSystem.colors.neutral[100],
                                    transform: 'scale(1.1)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                                title="העתק קישור"
                              >
                                <Copy size={18} />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                        {/* פס התקדמות */}
                        {fileItem.status === 'uploading' && (
                          <LinearProgress
                            variant="determinate"
                            value={fileItem.progress}
                            sx={{
                              mt: spacing(4),
                              height: spacing(2),
                              borderRadius: designSystem.borderRadius.sm,
                              backgroundColor: designSystem.colors.neutral[200],
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: designSystem.colors.secondary,
                                borderRadius: designSystem.borderRadius.sm
                              }
                            }}
                          />
                        )}
                      </Box>
                      {/* כפתורים */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing(2) }}>
                        {getStatusIcon(fileItem.status)}
                        <IconButton
                          onClick={() => removeFile(fileItem.id)}
                          size="small"
                          sx={{
                            color: designSystem.colors.error,
                            '&:hover': {
                              backgroundColor: designSystem.colors.error + '10',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <X size={18} />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
            {/* כפתור העלאה */}
            <Box sx={{
              p: spacing(6),
              borderTop: `1px solid ${designSystem.colors.neutral[200]}`
            }}>
              <CustomButton
                variant="secondary"
                size="lg"
                disabled={files.filter(f => f.status === 'pending' || f.status === 'error').length === 0}
                onClick={() => {
                  files.forEach(fileItem => {
                    if (fileItem.status === 'pending' || fileItem.status === 'error') {
                      uploadFile(fileItem);
                    }
                  });
                }}
                style={{
                  width: '100%',
                  backgroundColor: files.filter(f => f.status === 'pending' || f.status === 'error').length === 0
                    ? designSystem.colors.neutral[300]
                    : designSystem.colors.secondary,
                  color: files.filter(f => f.status === 'pending' || f.status === 'error').length === 0
                    ? designSystem.colors.neutral[500]
                    : designSystem.colors.neutral[900],
                  padding: `${spacing(4)}px`,
                  fontSize: designSystem.typography.fontSize.lg,
                  fontWeight: 'bold',
                  borderRadius: designSystem.borderRadius.md,
                  cursor: files.filter(f => f.status === 'pending' || f.status === 'error').length === 0
                    ? 'not-allowed'
                    : 'pointer',
                }}
                className="flex items-center justify-center gap-2"
              >
                <Upload size={24} />
                :rocket: העלה ל-Google Drive ({files.filter(f => f.status === 'pending' || f.status === 'error').length} קבצים)
              </CustomButton>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
export default FileUploader;