const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const readline = require("readline");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Create Socket.IO server, bind to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

console.log("🚀 Chat server is running on port 3000");
console.log("� Waiting for your friend to connect...");
console.log("💡 Your friend should connect to your IP address on port 3000\n");

// Create readline interface for your input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let connectedUsers = [];

// Handle new connections
io.on("connection", (socket) => {
  console.log(`✅ Friend connected! ID: ${socket.id}`);
  connectedUsers.push(socket);

  // Now you can start chatting
  if (connectedUsers.length === 1) {
    console.log("🎉 You can now start chatting! Type your messages below:\n");
    promptForMessage();
  }

  // Handle incoming messages from friends
  socket.on("chat message", (msg) => {
    console.log(`� Friend: ${msg}`);
    promptForMessage();
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`❌ Friend disconnected: ${socket.id}`);
    connectedUsers = connectedUsers.filter(user => user.id !== socket.id);
  });
});

function promptForMessage() {
  rl.question("", (message) => {
    if (message.trim()) {
      // Send message to all connected friends
      io.emit("chat message", { sender: "Host", text: message });
      console.log(`✅ You (Host): ${message}`);
    }
    // Wait a moment then prompt again
    setTimeout(promptForMessage, 100);
  });
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  server.close();
  rl.close();
  process.exit(0);
});

// Start the server
server.listen(3000, '0.0.0.0', () => {
  // Server started
});
