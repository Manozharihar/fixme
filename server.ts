import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const expressApp = express();
  const PORT = 3000;

  expressApp.use(express.json());

  // API routes
  expressApp.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Firebase Data API - Guides
  expressApp.get("/api/guides", async (req, res) => {
    try {
      const guidesRef = collection(db, "guides");
      const snapshot = await getDocs(guidesRef);
      const guides = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.json(guides);
    } catch (error) {
      console.error("Error fetching guides:", error);
      res.status(500).json({ error: "Failed to fetch guides" });
    }
  });

  expressApp.get("/api/guides/:id", async (req, res) => {
    try {
      const guideRef = doc(db, "guides", req.params.id);
      const snapshot = await getDoc(guideRef);
      if (snapshot.exists()) {
        res.json({
          id: snapshot.id,
          ...snapshot.data()
        });
      } else {
        res.status(404).json({ error: "Guide not found" });
      }
    } catch (error) {
      console.error("Error fetching guide:", error);
      res.status(500).json({ error: "Failed to fetch guide" });
    }
  });

  // Firebase Data API - Parts
  expressApp.get("/api/parts", async (req, res) => {
    try {
      const partsRef = collection(db, "parts");
      const snapshot = await getDocs(partsRef);
      const parts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.json(parts);
    } catch (error) {
      console.error("Error fetching parts:", error);
      res.status(500).json({ error: "Failed to fetch parts" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    expressApp.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    expressApp.use(express.static(distPath));
    expressApp.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  expressApp.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
