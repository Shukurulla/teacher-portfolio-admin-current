"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFileById,
  updateFile,
  fetchFilePreview,
  clearCurrentFile,
} from "../store/slices/fileSlice";
import { toast } from "react-hot-toast";
import {
  FiFileText,
  FiImage,
  FiVideo,
  FiMusic,
  FiDownload,
  FiCheck,
  FiX,
  FiUser,
  FiCalendar,
} from "react-icons/fi";

const FileDetail = () => {
  const { fileId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentFile: fileData,
    filePreview,
    loading,
    error,
  } = useSelector((state) => state.files);
  const user = JSON.parse(localStorage.getItem("admin"));

  const [ratings, setRatings] = useState([]);
  const [resultMessage, setResultMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentFile = fileData?.data || null;

  useEffect(() => {
    dispatch(fetchFileById(fileId));
    dispatch(fetchFilePreview(fileId));

    return () => {
      dispatch(clearCurrentFile());
    };
  }, [dispatch, fileId]);

  useEffect(() => {
    if (currentFile) {
      setResultMessage(currentFile.resultMessage || "");
      const initialRatings =
        currentFile.files?.map((file) => file.rating || null) || [];
      setRatings(initialRatings);
    }
  }, [currentFile]);

  const handleRatingChange = (fileIndex, value) => {
    const newRatings = [...ratings];
    newRatings[fileIndex] = value ? Number(value) : null;
    setRatings(newRatings);
  };

  const handleApprove = async () => {
    if (ratings.some((rating) => rating === null)) {
      toast.error("Iltimos, barcha fayllar uchun baho belgilang");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedFiles = currentFile.files.map((file, index) => ({
        ...file,
        rating: ratings[index],
      }));

      await dispatch(
        updateFile({
          id: fileId,
          data: {
            status: "Tasdiqlandi",
            resultMessage,
            files: updatedFiles,
            inspector: {
              id: user._id,
              name: `${user.firstName} ${user.lastName}`,
              role: user.role,
              date: new Date(),
            },
          },
        })
      ).unwrap();

      toast.success("Fayl muvaffaqiyatli tasdiqlandi");
      navigate("/admin/files");
    } catch (error) {
      toast.error(error.message || "Faylni tasdiqlashda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!resultMessage.trim()) {
      toast.error("Iltimos, rad etish sababini kiriting");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        updateFile({
          id: fileId,
          data: {
            status: "Tasdiqlanmadi",
            resultMessage,
            inspector: {
              id: user._id,
              name: `${user.firstName} ${user.lastName}`,
              role: user.role,
              date: new Date(),
            },
          },
        })
      ).unwrap();

      toast.success("Fayl rad etildi");
      navigate("/admin/files");
    } catch (error) {
      toast.error(error.message || "Faylni rad etishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileType = (fileName) => {
    const extension = fileName?.split(".").pop()?.toLowerCase() || "";

    const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const videoTypes = ["mp4", "webm", "ogg", "mov", "avi"];
    const audioTypes = ["mp3", "wav", "ogg", "m4a"];
    const documentTypes = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];
    const archiveTypes = ["zip", "rar", "7z"];
    const pdf = ["pdf"];

    if (imageTypes.includes(extension)) return "image";
    if (videoTypes.includes(extension)) return "video";
    if (audioTypes.includes(extension)) return "audio";
    if (documentTypes.includes(extension)) return "document";
    if (archiveTypes.includes(extension)) return "archive";
    if (pdf.includes(extension)) return "pdf";
    return "unknown";
  };

  const renderFilePreview = (file) => {
    if (!file) return null;

    const fileUrl = `http://localhost:7474${file.fileUrl}`;
    const fileType = getFileType(file.fileUrl);

    switch (fileType) {
      case "image":
        return (
          <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
            <img
              src={fileUrl}
              alt="Yuborilgan rasm"
              className="max-w-full max-h-[500px] object-contain rounded-md shadow-sm"
              onError={(e) => {
                e.target.src = "/placeholder-image.svg";
              }}
            />
          </div>
        );

      case "pdf":
        return (
          <div className="h-[600px] bg-gray-50 rounded-lg overflow-hidden">
            <iframe
              src={fileUrl}
              className="w-full h-full border-0"
              title="PDF ko'rish"
            ></iframe>
          </div>
        );

      case "video":
        return (
          <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
            <video
              controls
              className="max-w-full max-h-[500px] rounded-md shadow-sm"
            >
              <source
                src={fileUrl}
                type={`video/${file.fileName?.split(".").pop()}`}
              />
              Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
            </video>
          </div>
        );

      case "audio":
        return (
          <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
            <audio controls className="w-full">
              <source
                src={fileUrl}
                type={`audio/${file.fileName?.split(".").pop()}`}
              />
              Sizning brauzeringiz audio elementini qo'llab-quvvatlamaydi.
            </audio>
          </div>
        );

      case "document":
      case "archive":
      case "unknown":
      default:
        return (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg mb-4 text-gray-700">
              Ushbu turdagi faylni brauzerda ko'rish mumkin emas
            </p>
            <a
              href={fileUrl}
              download
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiDownload className="mr-2" />
              Yuklab olish
            </a>
          </div>
        );
    }
  };

  if (loading && !currentFile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Xatolik!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!currentFile) {
    return (
      <div
        className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Diqqat!</strong>
        <span className="block sm:inline"> Fayl topilmadi.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fayl Ko'rinishi Bo'limi */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Yuklangan Fayllar
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {currentFile.files?.map((file, index) => (
                <div
                  key={file._id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="p-4 bg-gray-50">
                    {renderFilePreview(file)}
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-800">
                        {file.fileTitle}
                      </h3>
                      <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Baho:
                        </label>
                        <select
                          value={ratings[index] || ""}
                          onChange={(e) =>
                            handleRatingChange(index, e.target.value)
                          }
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          disabled={currentFile.status !== "Tekshirilmoqda"}
                        >
                          <option value="">Baho tanlang</option>
                          {currentFile.achievments.ratings.map((item) => (
                            <option key={item._id} value={item.rating}>
                              {item.about} ({item.rating} ball)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ma'lumotlar va Amallar Bo'limi */}
        <div className="space-y-6">
          {/* Fayl Ma'lumotlari */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Fayl ma'lumotlari
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    O'qituvchi
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentFile.from?.firstName} {currentFile.from?.lastName}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Yutuq</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentFile.achievments?.title}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bo'lim</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentFile.achievments?.section}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Holat</h3>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currentFile.status === "Tasdiqlandi"
                          ? "bg-green-100 text-green-800"
                          : currentFile.status === "Tasdiqlanmadi"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {currentFile.status}
                    </span>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Yuborilgan sana
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(currentFile.createdAt).toLocaleDateString(
                      "uz-UZ",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tasdiqlash/Radd Qilish Bo'limi */}
          {currentFile.status === "Tekshirilmoqda" && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Amallar</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sharh:
                    </label>
                    <textarea
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Fayl haqida sharh yozing..."
                      value={resultMessage}
                      onChange={(e) => setResultMessage(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleApprove}
                      disabled={true}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <FiCheck className="mr-2" />
                      Tasdiqlash
                    </button>
                    <button
                      onClick={handleReject}
                      // disabled={isSubmitting || !resultMessage.trim()}
                      disabled={true}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <FiX className="mr-2" />
                      Rad etish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tekshiruvchi Ma'lumotlari */}
          {currentFile.inspector && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Tekshiruvchi
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiUser className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Ismi
                      </h3>
                      <p className="text-sm text-gray-900">
                        {currentFile.inspector.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiCalendar className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Tekshirilgan sana
                      </h3>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          currentFile.inspector.date
                        ).toLocaleDateString("uz-UZ", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Natija Xabari */}
          {currentFile.status !== "Tekshirilmoqda" &&
            currentFile.resultMessage && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Natija xabari
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-900 whitespace-pre-line">
                    {currentFile.resultMessage}
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FileDetail;
