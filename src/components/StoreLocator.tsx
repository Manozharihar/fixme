import React from 'react';
import { MapPin } from 'lucide-react';

export function StoreLocator() {
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:ml-48 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-heading mb-4 accent-text flex items-center gap-4 uppercase tracking-tighter">
          <MapPin size={40} /> SERVICE_CENTERS
        </h1>
        <p className="text-blueprint-muted font-mono text-sm max-w-2xl uppercase opacity-50">
          PHYSICAL_LOCATIONS // AUTHORIZED_REPAIR_DEPOTS
        </p>
      </div>
      
      <div className="h-[600px] w-full border border-artistic-border bg-zinc-900 relative group p-1">
        <iframe 
          width="100%" 
          height="100%" 
          src="https://api.maptiler.com/maps/basic-v2-dark/?key=ug8wAHbnUle2zJya1nSU#2.0/0/0"
          title="Store Locator Map"
          className="grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
        ></iframe>
        <div className="absolute top-4 left-4 bg-black/80 border border-artistic-border px-4 py-2 pointer-events-none">
          <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest">MAP_SYSTEM</div>
          <div className="text-sm font-bold accent-text">LIVE_TRACKING // ACTIVE</div>
        </div>
      </div>
    </div>
  );
}
