import UploadVideo from "@/components/UploadVideo";
import VideoList from "@/components/VideoList";

export default function Dashboard() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <VideoList />
      <UploadVideo />
    </main>
  );
}
