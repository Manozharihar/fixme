import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/guides?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleBrowseCategories = async () => {
    setLoading(true);
    try {
      const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const response = await fetch(`${API_BASE}/api/ifixit-categories`);
      const data = await response.json();
      const categoryNames = Object.keys(data);
      setCategories(categoryNames);
      console.log("Categories fetched:", categoryNames);
    } catch (error) {
      console.error('Categories failed:', error);
    }
    setLoading(false);
    navigate("/guides");
  };

  return (
    <div className="relative pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] uppercase">
              RIGHT TO<br />REPAIR.
            </h1>
            <p className="mt-6 text-zinc-400 max-w-md font-body text-lg">
              The archive of hardware sovereignty. Supporting the{" "}
              <a 
                href="https://righttorepairindia.gov.in/" 
                target="_blank" 
                rel="no-referrer"
                className="text-artistic-accent hover:underline inline-flex items-center gap-1"
              >
                India Right to Repair
              </a>{" "}
              initiative for electronics, farming, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-80 group"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search repair guides..."
                className="w-full p-4 pr-12 bg-zinc-900 border border-artistic-border text-white placeholder-zinc-500 focus:border-artistic-accent outline-none"
              />
              <button
                onClick={handleSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-artistic-accent transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2 font-mono uppercase"></p>
            <button
              onClick={handleBrowseCategories}
              disabled={loading}
              className="w-full mt-4 px-6 py-2 brutal-border bg-zinc-900 text-white font-bold uppercase text-xs hover:bg-artistic-accent hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Browse Categories"}
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
