
const socket = io();

socket.on('userCount', (count) => {
  console.log(`👥 Users online: ${count}`);
  document.getElementById('userCount').textContent = count;
});

socket.on('chatMessage', (data) => {
  console.log(`💬 ${data.username}: ${data.message}`);
  
  // Display in chat UI
  const messagesDiv = document.getElementById('messages');
  const messageEl = document.createElement('div');
  messageEl.className = 'chat-message';
  messageEl.innerHTML = `
    <strong>${data.username}:</strong> ${data.message}
    <small>${data.timestamp}</small>
  `;
  messagesDiv.appendChild(messageEl);
});

// Listen for typing notifications
socket.on('userTyping', (data) => {
  console.log(`✍️ ${data.username} is typing...`);
});

// ========== SENDING EVENTS ==========

// Send a message
function sendMessage(messageText) {
  socket.emit('sendMessage', {
    message: messageText,
    username: 'Current User' // From localStorage or user data
  });
}

// Notify server user is typing
function notifyTyping() {
  socket.emit('userTyping', {
    username: 'Current User'
  });
}

// ========== SERVER-SIDE (Already implemented in server.js) ==========

/*
io.on('connection', (socket) => {
  console.log(`New user connected: ${socket.id}`);
  
  // Send user count to all clients
  io.emit('userCount', connectedUsers.size);
  
  // Listen for incoming messages
  socket.on('sendMessage', (data) => {
    // Broadcast to all clients
    io.emit('chatMessage', {
      username: data.username,
      message: data.message,
      timestamp: new Date().toLocaleTimeString()
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    io.emit('userCount', connectedUsers.size);
  });
});
*/

// ========== TESTING SOCKET.IO ==========

// 1. Open multiple browser tabs/windows
// 2. Go to: http://localhost:3000/dashboard
// 3. Open browser DevTools (F12)
// 4. Go to Console tab
// 5. Type a message in the chat input
// 6. Watch all connected clients receive the message instantly!

// ========== DEMONSTRATION FLOW ==========
/*
Step 1: User A connects to localhost:3000/dashboard
        ✅ Socket.io connects automatically
        ✅ Server broadcasts userCount = 1

Step 2: User B connects in another tab
        ✅ Socket.io establishes connection
        ✅ Server broadcasts userCount = 2 to both users

Step 3: User A sends message "Hello"
        → socket.emit('sendMessage') → Server receives
        → Server broadcasts to ALL clients (including A)
        ✅ User A sees: "User A: Hello"
        ✅ User B sees: "User A: Hello"

Step 4: User B types "Hi there!"
        → socket.emit('sendMessage')
        → Server receives and broadcasts
        ✅ User A sees: "User B: Hi there!"
        ✅ User B sees: "User B: Hi there!"

Step 5: User A closes tab
        ✅ Server receives 'disconnect' event
        ✅ Server broadcasts userCount = 1
        ✅ User B sees user count update
*/

// ========== CODE EXAMPLES ==========

// Full chat implementation example:
class ChatClient {
  constructor() {
    this.socket = io();
    this.username = 'Anonymous';
    this.setupListeners();
  }

  setupListeners() {
    // Listen for new messages
    this.socket.on('chatMessage', (data) => {
      this.displayMessage(data);
    });

    // Listen for user count
    this.socket.on('userCount', (count) => {
      this.updateUserCount(count);
    });

    // Handle connection errors
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Send message
  sendMessage(messageText) {
    if (!messageText.trim()) return;

    this.socket.emit('sendMessage', {
      message: messageText,
      username: this.username
    });
  }

  // Display message in UI
  displayMessage(data) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${data.userId === this.socket.id ? 'own' : 'other'}`;
    messageEl.innerHTML = `
      <div class="message-info">
        <strong>${data.username}</strong>
        <span class="time">${data.timestamp}</span>
      </div>
      <div class="message-text">${this.escapeHtml(data.message)}</div>
    `;

    document.getElementById('messages').appendChild(messageEl);
    this.scrollToBottom();
  }

  // Update user count display
  updateUserCount(count) {
    document.getElementById('userCount').textContent = `${count} online`;
  }

  // Scroll to bottom
  scrollToBottom() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // XSS prevention
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Usage:
// const chat = new ChatClient();
// chat.username = 'John Doe';
// chat.sendMessage('Hello everyone!');

// ========== ADVANCED FEATURES ==========

// 1. ROOMS (Group different users)
socket.on('joinRoom', (roomName) => {
  socket.join(roomName);
  io.to(roomName).emit('message', 'User joined');
});

// 2. NAMESPACES (Separate communication channels)
const notificationSocket = io('/notifications');
notificationSocket.on('notification', (data) => {
  console.log('New notification:', data);
});

// 3. MESSAGE ACKNOWLEDGEMENT
socket.emit('sendMessage', data, (response) => {
  console.log('Server acknowledged:', response);
});

// ========== SECURITY CONSIDERATIONS ==========
/*
1. Input Validation
   - Don't trust client input
   - Validate message length, format
   - Example: if (message.length > 500) return;

2. XSS Prevention
   - Escape HTML in messages
   - Use textContent instead of innerHTML
   - Example: div.textContent = userInput;

3. Rate Limiting
   - Prevent spam/abuse
   - Limit messages per user per second

4. Authentication
   - Verify user identity with JWT
   - Store in socket.data.userId
   - socket.data.userId = decoded.userId;

5. Authorization
   - Check what data user can receive
   - Only send relevant messages to user
   - Don't send private messages to public room
*/

// Example with authentication:
socket.on('connection', (socket) => {
  const token = socket.handshake.auth.token;

  if (!token || !verifyJWT(token)) {
    socket.disconnect();
    return;
  }

  socket.data.userId = extractUserIdFromToken(token);
  console.log(`User ${socket.data.userId} connected`);
});

// ========== DEBUGGING SOCKET.IO ==========

// Server-side logging
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('sendMessage', (data) => {
    console.log('📨 Message received:', {
      from: socket.id,
      text: data.message,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Client-side debugging
socket.onAny((eventName, ...args) => {
  console.log('🎯 Event:', eventName, args);
});

// Enable Socket.io debugging
localStorage.debug = 'socket.io-client:*';

// ========== PERFORMANCE TIPS ==========

/*
1. Message Size
   - Keep messages small
   - Compress if necessary
   - Avoid sending large objects

2. Connection Pool
   - Reuse connections
   - Don't create new io() for every message

3. Broadcasting
   - Use rooms to limit broadcasts
   - Don't broadcast to everyone every time
   - Example: socket.to(roomId).emit(...)

4. Memory
   - Clean up disconnected connections
   - Don't store all messages in memory
   - Use database for persistence

5. Timeouts
   - Set ping interval: pingInterval: 25000
   - Set ping timeout: pingTimeout: 20000
*/

// ========== TESTING WITH CURL/CLI ==========

// WebSocket testing is harder with curl (it's HTTP)
// Use these alternatives:

// 1. Browser Console
//    Just open the page and use Socket.io normally

// 2. Socket.io Testing Client
//    npm install -g socket.io-client
//    Then use in Node.js scripts

// 3. Online Socket.io Tester
//    https://socket.io/docs/v4/socket-io-protocol/

// ========== WORKING EXAMPLE ==========

/*
File: views/dashboard.ejs (already implemented)

1. Include Socket.io library
   <script src="/socket.io/socket.io.js"></script>

2. Connect to server
   const socket = io();

3. Listen for events
   socket.on('chatMessage', (data) => {
     // Display message
   });

4. Send message
   socket.emit('sendMessage', {
     message: messageInput.value,
     username: currentUser.name
   });

Ready to use! Just go to http://localhost:3000/dashboard
*/

console.log('✅ Socket.io setup complete!');
console.log('Open multiple browser tabs to test real-time chat');
console.log('Visit: http://localhost:3000/dashboard');
