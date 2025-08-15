"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  Trash2,
  Download,
  Loader2,
  FileText,
  FileImage,
  File as FileIcon,
} from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/lib/api/file";

interface UploadedFile {
  _id: string;
  name: string;
  url: string;
  type: string;
}

export default function Dashboard() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await fetch("/api/files");
    const data = await res.json();
    setFiles(data);
  };
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "application/pdf",
    "application/msword",
  ];
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const selectedFilesArray = Array.from(fileList).filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (selectedFilesArray.length < fileList.length) {
      toast.error(
        "Some files were not allowed. Only PNG, JPG, JPEG, DOC, and PDF are accepted."
      );
    }

    setSelectedFiles((prev) => [...prev, ...selectedFilesArray]);
  };
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
    //   const res = await fetch("/api/upload", {
    //     method: "POST",
    //     body: formData,
    //   });
    const res=await uploadFile(formData)
    console.log(res,"uploaded response")

      if (res?.status === 200) {
        setSelectedFiles([]);
        fetchFiles();
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/files/${id}`, { method: "DELETE" });
    fetchFiles();
  };

  const renderSelectedFilePreview = () => {
    if (selectedFiles.length === 0) return null;

    return (
      <div className="mt-4 grid grid-cols-3 gap-4">
        {selectedFiles.map((file, index) => (
          <div key={index} className="relative w-24 h-24">
            {/* Preview */}
            {file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-full h-full object-cover rounded border"
              />
            ) : file.type === "application/pdf" ? (
              <div className="w-full h-full flex flex-col items-center justify-center border rounded bg-gray-50">
                <FileText className="w-8 h-8 text-red-500" />
                <span className="text-xs">PDF</span>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center border rounded bg-gray-50">
                <FileIcon className="w-8 h-8 text-gray-500" />
                <span className="text-xs">File</span>
              </div>
            )}

            {/* Cross icon */}
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">File Dashboard</h1>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center mb-6 bg-gray-50">
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="fileUpload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="w-8 h-8 text-gray-500" />
          <span className="text-gray-600">
            Click to browse or drag and drop
          </span>
        </label>
        {renderSelectedFilePreview()}
        {selectedFiles && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex  justify-center items-center gap-2"
            >
              {uploading && <Loader2 className="animate-spin w-4 h-4" />}
              Upload
            </button>
          </div>
        )}
      </div>

      {/* Files List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">File Name</th>
              <th className="p-3">Preview</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-6 text-gray-500">
                  No files uploaded
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr key={file._id} className="border-t">
                  <td className="p-3">{file.name}</td>
                  <td className="p-3">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-500">No preview</span>
                    )}
                  </td>
                  <td className="p-3 text-right flex justify-end gap-2">
                    <a
                      href={file.url}
                      download
                      className="p-2 bg-green-100 hover:bg-green-200 rounded"
                    >
                      <Download className="w-4 h-4 text-green-700" />
                    </a>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-700" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
