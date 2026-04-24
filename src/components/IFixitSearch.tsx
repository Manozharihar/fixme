import React, { useState } from 'react';

interface Guide {
  guideid: number;
  title: string;
  summary: string;
  difficulty?: string;
  time_required?: string;
  introduction_rendered?: string;
  tools?: { quantity: number; text: string }[];
  steps?: {
    title?: string;
    lines?: { text_rendered: string }[];
    media?: { data?: { standard: string }[] };
  }[];
}

const IFixitSearch: React.FC<{ initialQuery?: string }> = ({ initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [results, setResults] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const searchGuides = async (searchStr: string = query) => {
    if (!searchStr) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/ifixit-search?q=${encodeURIComponent(searchStr)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      searchGuides(initialQuery);
    }
  }, [initialQuery]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/ifixit-categories`);
      const data = await response.json();
      setCategories(Object.keys(data));
    } catch (error) {
      console.error('Categories failed:', error);
    }
    setLoading(false);
  };

  const loadGuide = async (guideId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/ifixit-guide?id=${guideId}`);
      const guide = await response.json();
      setSelectedGuide(guide);
    } catch (error) {
      console.error('Guide load failed:', error);
    }
    setLoading(false);
  };

  const handleCategoryClick = (category: string) => {
    setQuery(category);
    searchGuides(category);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-artistic-border">
      <h2 className="nav-link mb-8">Repair Guides</h2>
      
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for repair guides (e.g., iPhone battery)"
          className="w-full p-4 bg-zinc-900 border border-artistic-border text-white placeholder-zinc-500 focus:border-artistic-accent outline-none"
        />
        <div className="flex gap-4 mt-4">
          <button
            onClick={searchGuides}
            className="px-6 py-2 bg-artistic-accent text-black font-bold uppercase text-sm hover:bg-white transition-colors"
            disabled={loading}
          >
            Search
          </button>
          <button
            onClick={loadCategories}
            className="px-6 py-2 brutal-border bg-zinc-900 text-white font-bold uppercase text-sm hover:bg-artistic-accent transition-colors"
            disabled={loading}
          >
            Browse Categories
          </button>
        </div>
      </div>

      {loading && <p className="text-zinc-400">Loading...</p>}

      {categories.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="px-4 py-2 bg-zinc-800 text-white text-sm hover:bg-artistic-accent transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Search Results</h3>
          <ul className="space-y-2">
            {results.map((result) => (
              <li key={result.guideid}>
                <button
                  onClick={() => loadGuide(result.guideid)}
                  className="text-left w-full p-4 bg-zinc-900 border border-artistic-border hover:border-artistic-accent transition-colors"
                >
                  <h4 className="font-bold text-artistic-accent">{result.title}</h4>
                  <p className="text-sm text-zinc-400 mt-1">{result.summary}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedGuide && (
        <div className="guide-display">
          <h3 className="text-2xl font-bold mb-4">{selectedGuide.title}</h3>
          <p><strong>Difficulty:</strong> {selectedGuide.difficulty}</p>
          <p><strong>Time Required:</strong> {selectedGuide.time_required}</p>
          <div dangerouslySetInnerHTML={{ __html: selectedGuide.introduction_rendered || '' }} />
          
          {selectedGuide.tools && selectedGuide.tools.length > 0 && (
            <div className="mt-6 p-4 bg-zinc-800">
              <h4 className="font-bold mb-2">Tools Required</h4>
              <ul>
                {selectedGuide.tools.map((tool, idx) => (
                  <li key={idx}>{tool.quantity} x {tool.text}</li>
                ))}
              </ul>
            </div>
          )}

          <h4 className="text-xl font-bold mt-8 mb-4">Steps</h4>
          {selectedGuide.steps && selectedGuide.steps.length > 0 ? (
            selectedGuide.steps.map((step, idx) => (
              <div key={idx} className="mb-6 p-4 border border-artistic-border">
                {step.title && <h5 className="font-bold mb-2">{step.title}</h5>}
                {step.lines && step.lines.map((line, lidx) => (
                  <div key={lidx} dangerouslySetInnerHTML={{ __html: line.text_rendered }} />
                ))}
                {step.media && step.media.data && step.media.data.map((img, iidx) => (
                  <img key={iidx} src={img.standard} alt="Step" className="max-w-full mt-4" />
                ))}
              </div>
            ))
          ) : (
            <p>No steps available.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default IFixitSearch;
