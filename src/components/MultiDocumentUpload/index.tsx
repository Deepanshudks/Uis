import React, { useState, type ChangeEvent, type DragEvent } from "react";
import { File as FileIcon, Trash2 } from "lucide-react";
import type { DocumentType } from "../../mocks";

interface MultiDocumentUploadProps {
  value: DocumentType[];
  onChange: (docs: DocumentType[]) => void;
}

export const MultiDocumentUpload: React.FC<MultiDocumentUploadProps> = ({
  value,
  onChange,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newDocs: DocumentType[] = Array.from(files).map((file) => ({
      name: file.name,
      file,
    }));
    onChange([...value, ...newDocs]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const updatedDocs = [...value];
    updatedDocs.splice(index, 1);
    onChange(updatedDocs);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-sm font-semibold mb-2">Add Documents</h2>

      {/* Document Title Input */}
      <label className="block text-sm font-medium mb-1">Document Title</label>
      <input
        type="text"
        placeholder="TEST DOCUMENT TWO"
        className="w-full border border-green-400 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-400 mb-4"
      />

      {/* Upload Area */}
      <div className="flex items-center gap-3 mb-4">
        {/* Browse Button */}
        <label className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full cursor-pointer flex-1 text-center">
          Browse
          <input
            type="file"
            multiple
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleFiles(e.target.files)
            }
            className="hidden"
          />
        </label>

        <span className="text-gray-500 font-semibold">OR</span>

        {/* Drag Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDrop={handleDrop}
          className={`flex-1 p-3 text-center border-2 border-dashed rounded-md cursor-pointer ${
            dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
          }`}
        >
          Drag and Drop file here
        </div>
      </div>

      {/* File List */}
      <div className="space-y-2">
        {value.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <FileIcon size={16} className="text-gray-600" />
              <span className="text-sm">{doc.name}</span>
            </div>
            <button
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-4">
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
          Add Document
        </button>
      </div>
    </div>
  );
};
