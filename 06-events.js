// Events Module
// Node.js is event-driven. Many built-in modules (http, fs, streams) use events internally.
// The EventEmitter class lets you create your own custom events.

// The EventEmitter class is defined and exposed by the node:events module:

// import { EventEmitter } from "node:events";
const EventEmitter = require("events");

// ============================================
// Creating an EventEmitter instance
// ============================================

const emitter = new EventEmitter();

// ============================================
// .on() — Listen for an event
// ============================================

// Register a listener for the "greet" event
const eventFunction = () => {
  console.log("Hello! Someone triggered the greet event.");
};
emitter.on("greet", eventFunction);

// Register another listener for the same event (both will run)
emitter.on("greet", () => {
  console.log("Greetings! Second listener for greet.");
});

// ============================================
// .emit() — Trigger an event
// ============================================

emitter.emit("greet");
// Output:
// Hello! Someone triggered the greet event.
// Greetings! Second listener for greet.

// ============================================
// Passing data with events
// ============================================

emitter.on("userLogin", (username) => {
  console.log(`${username} just logged in!`);
});

emitter.emit("userLogin", "Praveen");
// Output: Praveen just logged in!

// Passing multiple arguments
emitter.on("order", (item, quantity, price) => {
  console.log(`Order: ${quantity}x ${item} at $${price} each`);
});

emitter.emit("order", "Pizza", 2, 12.99);
// Output: Order: 2x Pizza at $12.99 each

// ============================================
// .once() — Listen for an event only ONCE
// ============================================

emitter.once("welcome", () => {
  console.log("Welcome! This only runs once.");
});

emitter.emit("welcome"); // Output: Welcome! This only runs once.
emitter.emit("welcome"); // Nothing happens — listener was removed after first call

// ============================================
// .removeListener() / .off() — Remove a listener
// ============================================

function onMessage(msg) {
  console.log("Message:", msg);
}

emitter.on("message", onMessage);
emitter.emit("message", "Hello"); // Output: Message: Hello

emitter.off("message", onMessage); // Remove the listener
emitter.emit("message", "Hello again"); // Nothing happens

// ============================================
// .removeAllListeners() — Remove all listeners for an event
// ============================================

emitter.removeAllListeners("greet");
emitter.removeAllListeners(); // Removes ALL listeners for ALL events

// ============================================
// Real-world use cases
// ============================================

// 1. HTTP Server (built-in event usage)
// const http = require('http');
// const server = http.createServer();
// server.on('request', (req, res) => { res.end('Hello'); });
// server.listen(3000);

// 2. File Streams (readable stream emits 'data' events)
// const fs = require('fs');
// const stream = fs.createReadStream('./file.txt');
// stream.on('data', (chunk) => console.log(chunk));
// stream.on('end', () => console.log('Done reading'));

// 3. Process events
// process.on('exit', (code) => console.log('Exiting with code:', code));
// process.on('uncaughtException', (err) => console.error('Uncaught:', err));
