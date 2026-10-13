import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import Dashboard from "@/pages/Dashboard";
import HistoryPage from "@/pages/HistoryPage";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#131D2E",
            border: "1px solid #1A2640",
            color: "#E8EDF5",
          },
        }}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
