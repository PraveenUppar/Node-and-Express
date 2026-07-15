// Streams
// Streams let you read or write data piece by piece (in chunks), instead of loading everything into memory at once.
// This is crucial for handling large files (videos, logs, datasets).

const fs = require("fs");

// ============================================
// Why Streams?
// ============================================

// Without streams (loads entire file into memory):
// fs.readFile('./huge-file.txt', (err, data) => {
//   console.log(data); // If file is 2GB, 2GB goes into memory!
// });

// With streams (processes chunk by chunk):
// const stream = fs.createReadStream('./huge-file.txt');
// stream.on('data', (chunk) => {
//   console.log(chunk); // Each chunk is ~64KB by default
// });

// ============================================
// Types of Streams
// ============================================
// 1. Readable  — streams you read from (e.g., reading a file)
// 2. Writable  — streams you write to (e.g., writing to a file)
// 3. Duplex    — both readable and writable (e.g., network socket)
// 4. Transform — modify data as it passes through (e.g., compression)

// ============================================
// Readable Stream
// ============================================

const readStream = fs.createReadStream("./03-file-system.js", "utf8");

// Event: 'data' — fired when a chunk of data is available
readStream.on("data", (chunk) => {
  console.log("--- New Chunk ---");
  console.log(chunk);
});

// Event: 'end' — fired when there's no more data to read
readStream.on("end", () => {
  console.log("Finished reading file.");
});

// Event: 'error' — fired if something goes wrong
readStream.on("error", (err) => {
  console.error("Error:", err.message);
});

// ============================================
// Writable Stream
// ============================================

const writeStream = fs.createWriteStream("./stream-output.txt");

// Write data in chunks
writeStream.write("First line\n");
writeStream.write("Second line\n");
writeStream.write("Third line\n");

// End the stream (signals no more data will be written)
writeStream.end("Final line\n");

// Event: 'finish' — fired when all data has been written
writeStream.on("finish", () => {
  console.log("Finished writing file.");
});

writeStream.on("error", (err) => {
  console.error("Write error:", err.message);
});

// ============================================
// Piping Streams (connecting readable to writable)
// ============================================

// pipe() = read from source, write to destination — automatically
// Like connecting a water pipe from a tank to a tap

const source = fs.createReadStream("./03-file-system.js");
const destination = fs.createWriteStream("./copy-of-file.txt");

source.pipe(destination);

source.on("end", () => {
  console.log("File copied using pipe!");
});

// ============================================
// Piping through a Transform Stream (e.g., compression)
// ============================================

const zlib = require("zlib");

// Compress a file using gzip
// const gzip = zlib.createGzip();
// const readStream2 = fs.createReadStream("./03-file-system.js");
// const writeStream2 = fs.createWriteStream("./file.gz");

// readStream2.pipe(gzip).pipe(writeStream2);
// console.log("File compressed!");

// ============================================
// Transform Stream (custom)
// ============================================

const { Transform } = require("stream");

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // Convert each chunk to uppercase
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

// Usage: read file → transform to uppercase → write to new file
// const input = fs.createReadStream("./example.txt");
// const output = fs.createWriteStream("./uppercase-output.txt");
// input.pipe(upperCaseTransform).pipe(output);

// ============================================
// Stream with async iteration (modern approach)
// ============================================

async function readWithAsyncIterator() {
  const stream = fs.createReadStream("./03-file-system.js", "utf8");

  for await (const chunk of stream) {
    console.log("Async chunk:", chunk);
  }

  console.log("Done reading with async iterator");
}

// readWithAsyncIterator();
