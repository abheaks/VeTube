import React, { useState } from "react";
import axios from "axios";
import "./UploadVideo.css"; // Import the CSS file

const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    if (!title || !description) {
      alert("Please enter a title and description!");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      console.log({ file });

      const requestBody = {
        title,
        description,
        fileName: file.name,
        thumbnailUrl: "https://picsum.photos/320/180",
      };

      const response = await axios.post(
        "http://localhost:8080/api/videos/upload",
        requestBody
      );

      console.log("Backend response:", response);

      if (!response.data || !response.data.uploadUrl) {
        throw new Error("Failed to retrieve pre-signed URL from the server.");
      }

      const url = response.data.uploadUrl;
      console.log("Pre-signed URL received:", url);

      const uploadResponse = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      if (uploadResponse.status === 200) {
        alert("File uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-video-container">
      <h2 className="upload-video-title">Upload Video</h2>
      <div className="upload-video-form">
        <input
          type="text"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="upload-video-input"
        />
        <textarea
          placeholder="Enter video description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="upload-video-textarea"
        />
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="upload-video-file-input"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="upload-video-button"
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
        {uploading && (
          <>
            <p className="upload-video-progress">Progress: {progress}%</p>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadVideo;
