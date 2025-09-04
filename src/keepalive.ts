// src/keepalive.ts
import http from "http";

const PORT = process.env.PORT ? Number(process.env.PORT) : 10000;

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ok");
});

server.listen(PORT, () => {
  console.log(`[keepalive] listening on ${PORT}`);
});
