import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { compressImage } from '../../utils/compressImage';

const FileUpload = ({ label, onFileChange, error, acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'], maxSizeMB = 5 }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    let file = acceptedFiles[0];

    // If it's an image, compress it!
    if (file.type.startsWith('image/')) {
      setIsCompressing(true);
      try {
        file = await compressImage(file);
      } catch (err) {
        console.error("Compression failed", err);
      } finally {
        setIsCompressing(false);
      }
    }

    setFile(file);
    onFileChange(file);

    // Generate preview
    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null); // PDFs don't need image preview
    }
  }, [onFileChange]);

  // Clean up the object URL to prevent memory leaks!
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    onFileChange(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand-blue bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
        <input {...getInputProps()} />
        {isCompressing ? (
          <p className="text-brand-amber">Compressing image...</p>
        ) : file ? (
          <div className="flex flex-col items-center gap-2">
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-32 max-w-full rounded shadow-sm" />
            ) : (
              <div className="text-gray-500 text-sm">📄 {file.name}</div>
            )}
            <div className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(); }} className="text-brand-red text-sm font-medium hover:underline">Remove</button>
          </div>
        ) : (
          <div className="text-gray-500">
            <p className="text-sm">Drag & drop or click to upload</p>
            <p className="text-xs mt-1">Max {maxSizeMB}MB ({acceptedTypes.join(', ')})</p>
          </div>
        )}
      </div>
      {error && <span role="alert" className="text-brand-red text-xs mt-1 block">{error}</span>}
    </div>
  );
};

export default FileUpload;