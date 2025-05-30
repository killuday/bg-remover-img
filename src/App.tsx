import  { useEffect, useState } from "react";
import { initializeModel } from "./lib/process";
import BackgroundRemover from "./components/BackgroundRemover";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const initialized = await initializeModel();
        if (!initialized) {
          throw new Error("Failed to initialize background removal model");
        }
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    })();
  }, []);



  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg">Loading background removal model...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main className="flex-grow container mx-auto px-4 py-8">
      <BackgroundRemover />
    </main>
    <Footer />
  </div>
  );
}
