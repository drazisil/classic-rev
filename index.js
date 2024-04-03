import net from "node:net";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://957f1c23865b8a31bafe1c62d4a80179@o1413557.ingest.us.sentry.io/4507017679536128",
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
    op: "test",
    name: "My First Test Transaction",
  });
  
  setTimeout(() => {
    try {
      foo();
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      transaction.finish();
    }
  }, 99);

function onServerClose() {
  console.log("Server closed");
}

/**
 * @param {net.Socket} socket
 */
function onServerConnection(socket) {
    const { remoteAddress, remotePort } = socket;
  console.log(`Client connected: ${remoteAddress}:${remotePort}`);
  socket.on("end", () => {
    console.log("Client disconnected");
  });
  socket.on("data", (data) => {
    console.log("Client data:", data.toString("hex"));
  });
}

/**
 * @param {Error} error
 */
function errorHandler(error) {
  console.error("Server error:", error);
}

/**
 *
 * @param {net.Server} server
 */
function addInteruptHandler(server) {
  process.on("SIGINT", () => {
    console.log("Server interrupted");
    server.close((err) => {
      if (err) {
        console.error("Server close error:", err);
        return;
      }
      console.log("Server closed");
    });
  });
}

/**
 * @param {net.DropArgument} data
 */
function onServerDrop(data) {
  console.log("Server dropped");
  const { localAddress, localPort, remoteAddress, remotePort } = data;
  console.log(
    `Server: ${localAddress}:${localPort} dropped ${remoteAddress}:${remotePort}`
  );
  server.close();
}

const server = net.createServer();
console.log("Server created");
server.on("connection", onServerConnection);
server.on("close", onServerClose);
server.on("error", errorHandler);
server.on("drop", onServerDrop);
server.listen({
    host: "0.0.0.0",
    port: 3000,
}, () => {
    console.log("Server listening");
    addInteruptHandler(server);
});
