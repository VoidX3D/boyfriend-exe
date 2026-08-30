/* =============================================================================
 *  BOYFRIEND.EXE  —  scripts/dev.js
 * -----------------------------------------------------------------------------
 *  Tiny zero-dependency static dev server (no npm install required).
 *  Run with:  npm run dev   (or: node scripts/dev.js)
 *  Serves the project root with correct MIME types and a tiny live-reload
 *  tick so the browser refreshes when files change.
 * ========================================================================== */
const http = require("http");
const fs = require("fs");
const path = require("path");
const watch = require("fs").watch;

const ROOT = path.resolve(__dirname, "..");
const PORT = process.env.PORT || 5173;
const HOST = "127.0.0.1";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".mp3": "audio/mpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

let reloadToken = Date.now();

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  // injected live-reload client
  if (urlPath === "/__reload.js") {
    res.writeHead(200, { "content-type": "text/javascript" });
    res.end("const es=new EventSource('/__reload');es.onmessage=()=>location.reload();");
    return;
  }

  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end("forbidden"); return; }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "content-type": MIME[ext] || "application/octet-stream",
      "cache-control": "no-cache"
    });
    let out = data;
    if (ext === ".html") {
      const inject = '<script src="/__reload.js"></script>';
      out = Buffer.from(data.toString().replace("</body>", inject + "</body>"));
    }
    res.end(out);
  });
});

// live-reload event stream
const clients = [];
server.on("upgrade", (req, socket) => {
  if (req.url === "/__reload") {
    socket.write("HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\n\r\n");
    clients.push(socket);
    socket.on("close", () => {
      const idx = clients.indexOf(socket);
      if (idx >= 0) clients.splice(idx, 1);
    });
  }
});

watch(ROOT, { recursive: true }, () => {
  reloadToken = Date.now();
  clients.forEach((c) => { try { c.write("data: reload\n\n"); } catch (e) {} });
});

function shutdown(sig) {
  console.log("\n" + sig + " — shutting down...");
  server.close(() => { console.log("Server stopped."); process.exit(0); });
  setTimeout(() => process.exit(1), 2000);
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

server.listen(PORT, HOST, () => {
  console.log("BOYFRIEND.EXE dev server running at http://" + HOST + ":" + PORT);
});
