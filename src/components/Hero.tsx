import { Search, ChevronRight, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function Hero() {
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
            <div className="brutal-border p-4 flex justify-between items-center bg-zinc-900 group-hover:border-artistic-accent transition-colors">
              <span className="font-mono text-xs opacity-50 uppercase">SEARCH_DB</span>
              <Search className="w-4 h-4 opacity-50" />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
