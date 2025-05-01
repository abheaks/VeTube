import React from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ url }) => {
    return (
        <div style={{ maxWidth: "800px", margin: "auto", height: "500px" }}>
            <ReactPlayer url={url} controls width="100%" height="100%" />
        </div>
    );
};

export default VideoPlayer;
