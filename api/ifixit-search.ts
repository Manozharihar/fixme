import { sendError, sendJson } from "./_config.js";

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { success: true });
  }
  if (req.method !== "GET") {
    return sendError(res, 405, "Method not allowed");
  }

  const query = req.query?.q || "";
  if (!query) {
    return sendError(res, 400, "Query parameter 'q' is required");
  }

  try {
    const response = await fetch(`https://www.ifixit.com/api/2.0/search/${encodeURIComponent(query)}?filter=guide`);
    const data = await response.json();

    if (!response.ok) {
      return sendError(res, response.status, "iFixit API error");
    }

    return sendJson(res, 200, data);
  } catch (error: any) {
    console.error("iFixit search failed:", error);
    return sendError(res, 500, "Failed to search iFixit guides");
  }
}