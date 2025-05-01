import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null); // State for selected video URL

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/videos");
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const videoClickHandler = async (video) => {
    console.log("Video clicked:", video);

    try {
      const response = await fetch(
        `http://localhost:8080/api/videos/${video.id}/access-url`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch video access URL");
      }
      const data = await response.json();
      console.log("Access URL received:", data.accessUrl);

      setSelectedVideoUrl(data.accessUrl); // Set the new video URL
    } catch (error) {
      console.error("Error fetching video access URL:", error);
      alert("Failed to load video. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading videos...</div>;
  }

  if (error) {
    return <div className="text-center mt-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="px-4">
      <div
        className="flex flex-wrap gap-4 justify-start"
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        {videos.map((video) => (
          <Card
            key={video.id}
            className="shadow-none border border-gray-300 rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            style={{ width: "300px", margin: "26px" }}
            onClick={() => videoClickHandler(video)} // Fetch new video URL on click
          >
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="rounded-t-lg w-full aspect-video object-cover"
            />
            <CardContent className="flex flex-col mt-2 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <CardTitle className="text-sm font-medium line-clamp-2">
                    {video.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    {video.description}
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        {selectedVideoUrl != null && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={() => setSelectedVideoUrl(null)} // Clear selected video URL
          >
            Close{" "}
          </button>
        )}
        {selectedVideoUrl && (
          <div className="mt-6">
            <VideoPlayer url={selectedVideoUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoList;
