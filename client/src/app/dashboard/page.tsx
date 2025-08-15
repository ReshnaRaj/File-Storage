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
import { uploadFile, deleteFile, getFiles, downloadFile } from "@/lib/api/file";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { logout } from "../../redux/slice/authSlice";

interface UploadedFile {
  _id: string;
  fileName: string;
  url: string;
  type: string;
  mimeType: string;
}

export default function Dashboard() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDownload = async (fileId: string, filename: string) => {
    console.log(filename, fileId, "kkkkk");
    try {
      await downloadFile(fileId, filename);
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    const res = await getFiles();

    setFiles(res?.data);
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
      const res = await uploadFile(formData);

      if (res?.status === 201) {
        setSelectedFiles([]);
        fetchFiles();
        toast.success("Files uploaded successfully");
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
    await deleteFile(id);
    toast.success("File deleted successfully");
    fetchFiles();
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    window.location.href = "/login"; // Redirect to login page
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
  useEffect(() => {
    if (token) {
      fetchFiles();
    }
  }, [token]);
  console.log(files, "file dataaa");
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">File Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

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

        {/* Files List as Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 p-6">
              No files uploaded
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file._id}
                className="bg-white shadow rounded-lg p-4 flex flex-col items-center relative group hover:shadow-lg transition"
              >
                {/* Preview */}
                <div
                  className="w-32 h-32 flex items-center justify-center mb-2 cursor-pointer"
                  onClick={() => setPreviewImage(file.url)}
                >
                  {file.mimeType.startsWith("image/") ? (
                    <img
                      src={file.url}
                      alt={file.fileName}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : file.mimeType === "application/pdf" ? (
                    <div className="flex flex-col items-center justify-center w-full h-full border rounded bg-gray-50">
                      <FileText className="w-10 h-10 text-red-500" />
                      <span className="text-xs">PDF</span>
                    </div>
                  ) : file.mimeType === "application/msword" ||
                    file.mimeType ===
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                    <div className="flex flex-col items-center justify-center w-full h-full border rounded bg-gray-50">
                      <FileIcon className="w-10 h-10 text-blue-500" />
                      <span className="text-xs">DOC</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">No preview</span>
                  )}
                </div>
                {/* File Name */}
                <div className="font-medium text-sm text-center mb-2 truncate w-full">
                  {file.fileName}
                </div>
                {/* Actions */}
                <div className="flex justify-center gap-3 mt-auto">
                  <button
                    onClick={() => handleDownload(file._id, file.fileName)}
                    className="p-2 bg-green-100 hover:bg-green-200 rounded"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-green-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-700" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* File Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setPreviewImage(null)}
          >
            <div
              className="bg-white p-4 rounded shadow-lg max-w-3xl max-h-[90%]"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const file = files.find((f) => f.url === previewImage);
                if (!file) return null;
                if (file.mimeType.startsWith("image/")) {
                  return (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full max-h-[80vh] object-contain"
                    />
                  );
                } else if (file.mimeType === "application/pdf") {
                  return (
                    <iframe
                      src={previewImage}
                      title="PDF Preview"
                      className="w-[600px] h-[80vh]"
                    />
                  );
                } else if (
                  file.mimeType === "application/msword" ||
                  file.mimeType ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ) {
                  return (
                    <iframe
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                        previewImage
                      )}`}
                      title="DOC Preview"
                      className="w-[600px] h-[80vh]"
                    />
                  );
                }
                return <span>Preview not available</span>;
              })()}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setPreviewImage(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
