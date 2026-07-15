// Assignment 1: File Organizer
// ==============================
//
// Build a Node.js script that organizes files in a directory by their extension into subfolders.
//
// For example, if a directory has:
//   report.pdf, photo.jpg, notes.txt, image.png, data.csv, script.js
//
// After running your script, the directory should look like:
//   pdf/report.pdf
//   jpg/photo.jpg
//   txt/notes.txt
//   png/image.png
//   csv/data.csv
//   js/script.js
//
// Requirements:
// 1. Use the fs and path modules
// 2. Read all files in a target directory (you can create a test folder with sample files)
// 3. For each file, get its extension (e.g., .txt, .pdf, .jpg)
// 4. Create a subfolder named after the extension (without the dot) if it doesn't exist
// 5. Move the file into the corresponding subfolder
// 6. Skip directories (don't try to move folders)
// 7. Log each file move: "Moved report.pdf → pdf/report.pdf"
// 8. Handle errors gracefully (what if a file with the same name already exists?)
//
// Hints:
// - path.extname() gives you the file extension
// - fs.mkdirSync() with { recursive: true } creates folders safely
// - fs.renameSync() moves a file
// - fs.statSync().isFile() checks if something is a file
//
// Bonus:
// - Accept the target directory as a command line argument (process.argv[2])
// - Add a --dry-run flag that only shows what would be moved without actually moving
// - Handle files with no extension (put them in a "misc" folder)
