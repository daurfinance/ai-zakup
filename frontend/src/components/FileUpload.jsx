import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Upload, 
  File, 
  X, 
  Download, 
  Eye, 
  Trash2, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  FileText,
  Image,
  Archive
} from 'lucide-react';

const FileUpload = ({ 
  entityType, 
  entityId, 
  category = 'general',
  multiple = true,
  accept = '*',
  maxSize = 10 * 1024 * 1024, // 10MB
  onUploadComplete,
  onFileDelete,
  initialFiles = [],
  disabled = false,
  className = ''
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  
  const [files, setFiles] = useState(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);

  const allowedTypes = {
    documents: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
    images: ['.jpg', '.jpeg', '.png', '.gif'],
    archives: ['.zip', '.rar'],
    all: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.rar']
  };

  const getFileIcon = (mimeType, fileName) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (mimeType === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return <FileText className="h-5 w-5 text-green-600" />;
    } else if (mimeType.includes('zip') || mimeType.includes('rar')) {
      return <Archive className="h-5 w-5 text-purple-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const errors = [];

    // Проверка размера
    if (file.size > maxSize) {
      errors.push(t('files.errorFileSize', { 
        maxSize: formatFileSize(maxSize) 
      }));
    }

    // Проверка типа файла
    if (accept !== '*') {
      const acceptedTypes = allowedTypes[accept] || allowedTypes.all;
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!acceptedTypes.includes(fileExtension)) {
        errors.push(t('files.errorFileType', { 
          allowedTypes: acceptedTypes.join(', ') 
        }));
      }
    }

    return errors;
  };

  const handleFileSelect = useCallback((selectedFiles) => {
    const fileList = Array.from(selectedFiles);
    const validFiles = [];
    const fileErrors = [];

    fileList.forEach(file => {
      const validationErrors = validateFile(file);
      if (validationErrors.length === 0) {
        validFiles.push(file);
      } else {
        fileErrors.push({
          fileName: file.name,
          errors: validationErrors
        });
      }
    });

    if (fileErrors.length > 0) {
      setErrors(fileErrors);
    } else {
      setErrors([]);
    }

    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  }, [maxSize, accept]);

  const uploadFiles = async (filesToUpload) => {
    if (!entityType || !entityId) {
      setErrors([{ fileName: 'System', errors: [t('files.errorMissingEntity')] }]);
      return;
    }

    setUploading(true);
    setErrors([]);

    const formData = new FormData();
    
    if (multiple) {
      filesToUpload.forEach(file => {
        formData.append('files', file);
      });
    } else {
      formData.append('file', filesToUpload[0]);
    }

    const endpoint = multiple ? '/api/files/upload-multiple' : '/api/files/upload';
    const url = `${endpoint}?entityType=${entityType}&entityId=${entityId}&category=${category}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        if (multiple) {
          // Обработка результата множественной загрузки
          if (result.uploaded && result.uploaded.length > 0) {
            setFiles(prev => [...prev, ...result.uploaded]);
            onUploadComplete?.(result.uploaded);
          }
          
          if (result.errors && result.errors.length > 0) {
            setErrors(result.errors);
          }
        } else {
          // Обработка результата одиночной загрузки
          setFiles(prev => [...prev, result]);
          onUploadComplete?.([result]);
        }
      } else {
        setErrors([{ fileName: 'Upload', errors: [result.message || t('files.errorUpload')] }]);
      }
    } catch (error) {
      setErrors([{ fileName: 'Network', errors: [t('files.errorNetwork')] }]);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  }, [disabled, handleFileSelect]);

  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      handleFileSelect(selectedFiles);
    }
    // Очистка input для возможности повторной загрузки того же файла
    e.target.value = '';
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setFiles(prev => prev.filter(file => file.id !== fileId));
        onFileDelete?.(fileId);
      } else {
        const error = await response.json();
        setErrors([{ fileName: 'Delete', errors: [error.message || t('files.errorDelete')] }]);
      }
    } catch (error) {
      setErrors([{ fileName: 'Network', errors: [t('files.errorNetwork')] }]);
    }
  };

  const handleDownloadFile = (fileId, fileName) => {
    const link = document.createElement('a');
    link.href = `/api/files/${fileId}?token=${localStorage.getItem('token')}`;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviewFile = (fileId) => {
    window.open(`/api/files/${fileId}/preview?token=${localStorage.getItem('token')}`, '_blank');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : disabled
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept === '*' ? undefined : allowedTypes[accept]?.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
            <p className="text-sm text-gray-600">{t('files.uploading')}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className={`h-8 w-8 mb-2 ${disabled ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className={`text-sm mb-2 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
              {dragOver
                ? t('files.dropFiles')
                : t('files.dragDropOrClick')
              }
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('files.selectFiles')}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              {t('files.maxSize')}: {formatFileSize(maxSize)}
            </p>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">{error.fileName}</p>
                {error.errors.map((err, errIndex) => (
                  <p key={errIndex} className="text-sm text-red-600">{err}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            {t('files.uploadedFiles')} ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file.mimeType, file.originalName)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file.mimeType.startsWith('image/') && (
                    <button
                      onClick={() => handlePreviewFile(file.id)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title={t('files.preview')}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDownloadFile(file.id, file.originalName)}
                    className="p-1 text-gray-400 hover:text-green-600"
                    title={t('files.download')}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title={t('files.delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {files.length > 0 && errors.length === 0 && !uploading && (
        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          <p className="text-sm text-green-800">
            {t('files.uploadSuccess', { count: files.length })}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
