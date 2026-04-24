import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar.tsx";
import { Hero } from "./components/Hero.tsx";
import { Cart } from "./components/Cart.tsx";
import { Receipt } from "./components/Receipt.tsx";
import IFixitSearch from "./components/IFixitSearch.tsx";
import { StoreLocator } from "./components/StoreLocator.tsx";
import { CartProvider, useCart } from "./context/CartContext";
import { MOCK_PARTS, MOCK_GUIDES } from "./constants.ts";
import { Guide, Part } from "./types.ts";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Wrench, Package, ShieldCheck, Maximize2, ChevronLeft, ChevronRight, PenTool as Tool, Terminal, LogIn } from "lucide-react";
import { cn } from "./lib/utils";

function Home() {
  const [guides, setGuides] = React.useState<Guide[]>(MOCK_GUIDES);
  const [parts, setParts] = React.useState<Part[]>(MOCK_PARTS);

  return (
    <div className="min-h-screen md:ml-20">
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-artistic-border">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="nav-link">Featured Manuals</h2>
          </div>
          <Link to="/guides" className="text-xs opacity-50 font-mono hover:text-artistic-accent">
            [ VIEW_ALL ]
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <Link key={guide.id} to={`/guides/${guide.id}`} className="blueprint-card group">
              <div className="flex justify-between items-start mb-4">
                <span className={cn(
                  "text-[10px] px-2 py-1 font-bold uppercase",
                  guide.difficulty === "Difficult" ? "bg-artistic-accent text-black" : "bg-zinc-700 text-white"
                )}>
                  {guide.difficulty === "Difficult" ? "HARD" : guide.difficulty === "Moderate" ? "MEDIUM" : "EASY"}
                </span>
                <span className="font-mono text-[10px] opacity-50">ID: {guide.id.toUpperCase().slice(0, 8)}</span>
              </div>
              <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-artistic-accent transition-colors">
                {guide.name}
              </h3>
              <div className="flex gap-8 mt-8">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] opacity-40 uppercase">TIME</span>
                  <span className="text-sm">{guide.time}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] opacity-40 uppercase">TOOLS</span>
                  <span className="text-sm">{guide.tools.length} SENSORS</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-artistic-border">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="nav-link">Marketplace_Inventory</h2>
          </div>
          <Link to="/shop" className="text-xs opacity-50 font-mono hover:text-artistic-accent">
            [ ENTER_DEPOT ]
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {parts.map((part) => (
            <div key={part.id} className="bg-zinc-900 border border-artistic-border p-6 flex flex-col group">
              <div className="flex-1">
                <div className="aspect-square bg-zinc-800 border border-artistic-border mb-4 flex items-center justify-center overflow-hidden">
                  <img src={part.image} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                </div>
                <h4 className="font-bold text-lg leading-tight">{part.name}</h4>
                <p className="text-xs text-zinc-500 mt-2 font-body italic">Verified compatibility with {part.compatibility.length} models.</p>
                <div className="text-2xl font-bold mt-4 font-heading">₹{Math.round(part.price * 80).toLocaleString('en-IN')}</div>
              </div>
              <AddToCartButton part={part} />
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-artistic-border mt-20">
        <div className="flex justify-between items-center opacity-30 font-mono text-[10px]">
          <span>Fix Me </span>
          <span>© 2026 MANOZ HARIHAR</span>
        </div>
      </footer>
</div>
  );
}

function Guides() {
  const [guides, setGuides] = React.useState<Guide[]>(MOCK_GUIDES);
  const [filter, setFilter] = React.useState("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const location = useLocation();

  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('search');
    setSearchQuery(search || "");
  }, [location.search]);

  const categories = ["ALL", ...new Set(guides.map(g => g.category))];
  
  const filteredGuides = filter === "ALL" 
    ? guides 
    : guides.filter(g => g.category === filter);

  if (searchQuery) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:ml-20">
        <IFixitSearch initialQuery={searchQuery} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:ml-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-16">
        <div>
          <h1 className="text-4xl font-heading mb-4 accent-text">DIRECTORY</h1>
          <p className="text-blueprint-muted font-mono text-sm max-w-2xl uppercase opacity-50">
            ARCHIVE_OF_HARDWARE_SOVEREIGNTY // SELECT_MODEL
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "nav-link transition-all px-4 py-2 brutal-border text-xs",
                filter === cat ? "accent-text bg-zinc-900 border-artistic-accent" : "opacity-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map(guide => (
          <Link key={guide.id} to={`/guides/${guide.id}`} className="blueprint-card group">
            <div className="flex justify-between items-start mb-4">
              <span className={cn(
                "text-[10px] px-2 py-1 font-bold uppercase transition-colors",
                guide.difficulty === "Difficult" ? "bg-artistic-accent text-black" : "bg-zinc-700 text-white"
              )}>
                {guide.difficulty}
              </span>
              <div className="flex flex-col items-end">
                <span className="font-mono text-[8px] opacity-40 uppercase tracking-tighter mb-1">{guide.category}</span>
                <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest">REF_{guide.id.toUpperCase().slice(0, 4)}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 group-hover:text-artistic-accent transition-colors leading-tight h-14 overflow-hidden">{guide.name}</h3>
            <div className="flex justify-between items-center text-xs font-mono opacity-50 pt-4 border-t border-artistic-border">
              <span>{guide.time}</span>
              <span>VERIFIED_OK</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function GuideDetail() {
  const { id } = useParams();
  const [ifixitGuide, setIfixitGuide] = React.useState<any>(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      loadIfixitGuide(id);
    }
  }, [id]);

  const loadIfixitGuide = async (guideId: string) => {
    setLoading(true);
    try {
      const guideResponse = await fetch(`https://www.ifixit.com/api/2.0/guides/${guideId}`);
      const guideData = await guideResponse.json();
      setIfixitGuide(guideData);
    } catch (error) {
      console.error('Failed to load iFixit guide:', error);
    }
    setLoading(false);
  };

  if (!ifixitGuide && !loading) return <div className="pt-32 text-center font-mono">GUIDE_NOT_FOUND</div>;
  if (loading) return <div className="pt-32 text-center font-mono">LOADING_STREAMS...</div>;

  const displayGuide = ifixitGuide;
  const steps = ifixitGuide.steps;

  return (
    <div className="pt-20 min-h-screen md:ml-20">
      <div className="border-b border-artistic-border bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 text-artistic-accent text-[10px] font-mono mb-4 uppercase tracking-widest">
                <Link to="/guides" className="hover:underline">DIRECTORY</Link>
                <span>/</span>
                <span className="text-zinc-500">{displayGuide.type || "DEVICE"}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">{displayGuide.title}</h1>
            </div>
            <div className="flex gap-4">
              <div className="brutal-border py-4 px-6 bg-zinc-950">
                <div className="text-[10px] font-mono opacity-40 uppercase mb-1">SCORE</div>
                <div className="text-2xl font-bold accent-text">{displayGuide.difficulty || "MODERATE"}</div>
              </div>
              <div className="brutal-border py-4 px-6 bg-zinc-950">
                <div className="text-[10px] font-mono opacity-40 uppercase mb-1">DURATION</div>
                <div className="text-2xl font-bold">{displayGuide.time_required || "1-2 HOURS"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {loading && <div className="text-center font-mono mb-8">LOADING...</div>}
        
        {steps && steps.length > 0 ? (
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Steps list */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="nav-link mb-8">Navigation_Steps</h2>
              {steps.map((step: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    "w-full text-left p-6 brutal-border transition-all duration-200 relative group flex gap-6 items-center",
                    activeStep === index 
                      ? "bg-zinc-900 border-artistic-accent" 
                      : "bg-transparent opacity-50 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  <div className={cn(
                    "font-mono text-lg font-bold shrink-0",
                    activeStep === index ? "accent-text" : "text-zinc-500"
                  )}>
                    [{String(index + 1).padStart(2, '0')}]
                  </div>
                  <div>
                    <h4 className="text-lg font-bold uppercase transition-colors group-hover:accent-text">
                      {step.title || `Step ${index + 1}`}
                    </h4>
                  </div>
                </button>
              ))}
            </div>

            {/* Viewer component */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-28 brutal-border bg-zinc-900 p-1">
                <div className="aspect-[4/5] relative overflow-hidden bg-black">
                  {steps[activeStep].media?.data?.[0]?.standard ? (
                    <img 
                      src={steps[activeStep].media.data[0].standard} 
                      alt={steps[activeStep].title || `Step ${activeStep + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      No image available
                    </div>
                  )}
                  <div className="absolute top-4 left-4 font-mono text-[10px] bg-black/80 px-2 py-1 brutal-border uppercase">
                    RAW_FEED // {String(activeStep + 1).padStart(3, '0')}
                  </div>
                </div>
                <div className="p-8 border-t border-artistic-border">
                  <div>
                    {steps[activeStep].lines?.map((line: any, idx: number) => (
                      <div key={idx} dangerouslySetInnerHTML={{ __html: line.text_rendered }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements - Sidebar Style */}
            <div className="lg:col-span-3 space-y-12">
              {displayGuide?.tools && displayGuide.tools.length > 0 && (
                <div>
                  <h2 className="nav-link mb-6">Tools_Required</h2>
                  <div className="space-y-2">
                    {displayGuide.tools.map((tool: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 brutal-border bg-zinc-950/50 group">
                        <div className="text-xs font-mono uppercase tracking-tight">{tool.text}</div>
                        <span className="text-xs text-zinc-500">x{tool.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-mono text-zinc-500">No steps available for this guide.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SupplyDepot() {
  const [parts, setParts] = React.useState<Part[]>(MOCK_PARTS);
  const [filter, setFilter] = React.useState("ALL");

  const categories = ["ALL", ...new Set(parts.map(p => p.category))];
  
  const filteredParts = filter === "ALL" 
    ? parts 
    : parts.filter(p => p.category === filter);

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:ml-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-16">
        <div>
          <h1 className="text-6xl font-bold tracking-tighter uppercase leading-none">SUPPLY_DEPOT</h1>
          <p className="text-zinc-500 font-body text-lg max-w-md mt-4">
            Industrial components for sovereignty. Every part is verified by the core lab.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "nav-link transition-all px-4 py-2 brutal-border",
                filter === cat ? "accent-text bg-zinc-900 border-artistic-accent" : "opacity-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredParts.map((part) => (
          <div key={part.id} className="bg-black brutal-border p-6 group flex flex-col">
            <div className="flex-1">
              <div className="aspect-square bg-zinc-900 brutal-border mb-6 overflow-hidden relative group">
                <img 
                  src={part.image} 
                  alt={part.name}
                  className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute top-4 right-4 bg-black/80 brutal-border px-2 py-1">
                  <div className="text-[8px] font-mono opacity-50 uppercase tracking-widest">SUCCESS</div>
                  <div className="text-xs font-bold accent-text">{part.successRate}%</div>
                </div>
              </div>
              <div className="font-mono text-[10px] accent-text mb-2 uppercase tracking-widest">{part.category}</div>
              <h4 className="text-xl font-bold leading-tight h-14 overflow-hidden mb-6">{part.name}</h4>
              <div className="text-3xl font-bold mb-8">₹{Math.round(part.price * 80).toLocaleString('en-IN')}</div>
            </div>
            <AddToCartButton part={part} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AddToCartButton({ part }: { part: Part }) {
  const { addToCart } = useCart();
  return (
    <button 
      className="w-full bg-artistic-accent text-black font-bold py-3 uppercase text-[10px] tracking-widest mt-6 hover:bg-white transition-colors"
      onClick={() => addToCart(part)}
    >
      Add to Repair Kit
    </button>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/:id" element={<GuideDetail />} />
          <Route path="/shop" element={<SupplyDepot />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/locator" element={<StoreLocator />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
