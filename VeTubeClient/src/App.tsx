import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoList from "@/components/VideoList";
import UploadVideo from "@/components/UploadVideo";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VideoList />} />
        <Route path="/upload" element={<UploadVideo />} />
      </Routes>
    </Router>
  );
};

export default App;
