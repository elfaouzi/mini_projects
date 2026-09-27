const io = require("socket.io-client");
const readline = require("readline");

// Replace with your friend's (server host) IP address
const SERVER_IP = "192.168.2.104"; // Your main IP address
const SERVER_URL = `http://${SERVER_IP}:3000`;

console.log(`🔌 Connecting to chat server at ${SERVER_URL}...`);

const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling'],
  timeout: 20000
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

socket.on("connect", () => {
  console.log("✅ Connected to chat server!");
  console.log("📝 You can now type messages. Press Ctrl+C to exit.\n");

  // Start chatting
  promptForMessage();
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});

socket.on("connect_error", (error) => {
  console.log("🚫 Connection failed:", error.message);
  console.log("Make sure the server is running and the IP address is correct");
  process.exit(1);
});

// Listen for incoming messages
socket.on("chat message", (data) => {
  const sender = data.sender || "Unknown";
  const text = data.text || data;
  console.log(`\n💬 ${sender}: ${text}`);
  promptForMessage(); // Re-prompt to keep "You: " at the bottom
});

function promptForMessage() {
  rl.question("", (message) => {
    if (message.trim()) {
      socket.emit("chat message", message);
    }
  });
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Goodbye!');
  socket.disconnect();
  rl.close();
  process.exit(0);
});