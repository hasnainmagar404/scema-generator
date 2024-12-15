import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
}

export default function FileUpload({ onUpload, accept = '.csv,.json' }: FileUploadProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
    >
      <input
        type="file"
        ref={fileInput}
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />
      <div className="flex flex-col items-center">
        <Upload className="h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop a file here, or{' '}
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="text-indigo-600 hover:text-indigo-500"
          >
            browse
          </button>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supports CSV and JSON files
        </p>
      </div>
    </div>
  );
}