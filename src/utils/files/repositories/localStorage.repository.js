import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import archiver from 'archiver';
import { exec } from 'child_process';
import crypto from 'crypto';

class FileHandler {
  constructor(filePath, createIfNotExist = false) {
    this.filePath = filePath;
    this.folderPath = path.dirname(filePath);
    this.createIfNotExist = createIfNotExist;

    if (this.createIfNotExist) {
      this.ensureFileOrFolderExists(filePath).catch((error) => {
        console.error(`Error creating file or folder: ${error.message}`);
      });
    }
  }

  // Ensure a file or folder exists
  async ensureFileOrFolderExists(filePath) {
    if (!fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      if (ext) {
        await fs.promises.writeFile(filePath, '', { flag: 'wx' }).catch((error) => {
          if (error.code !== 'EEXIST') throw error;
        });
      } else {
        await fs.promises.mkdir(filePath, { recursive: true });
      }
    }
  }

  // Upload a file to a destination folder
  async uploadFile(file, destination = './uploads') {
    if (!file || !file.buffer) {
      throw new Error('Invalid file object');
    }

    await this.ensureFolderExists(destination);
    const filePath = path.join(destination, file.originalname);
    await fs.promises.writeFile(filePath, file.buffer);
    return filePath;
  }

  // Delete the file
  async deleteFile() {
    if (fs.existsSync(this.filePath)) {
      await fs.promises.unlink(this.filePath);
    }
  }

  // Check if file exists
  fileExists() {
    return fs.existsSync(this.filePath);
  }

  // Move a file to a new destination
  async moveFile(destinationPath) {
    await this.ensureFolderExists(path.dirname(destinationPath));
    await fs.promises.rename(this.filePath, destinationPath);
  }

  // Rename the file
  async renameFile(newName) {
    const newPath = path.join(path.dirname(this.filePath), newName);
    await fs.promises.rename(this.filePath, newPath);
    this.filePath = newPath; // Update the file path
    return newPath;
  }

  // Get file information
  getFileInfo() {
    const stats = fs.statSync(this.filePath);
    return {
      name: path.basename(this.filePath),
      size: stats.size,
      type: path.extname(this.filePath),
      createdAt: stats.birthtime,
      updatedAt: stats.mtime,
    };
  }

  // Create a folder if it doesn't exist
  async ensureFolderExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
      await fs.promises.mkdir(folderPath, { recursive: true });
    }
  }

  // Check if a folder exists
  folderExists(folderPath) {
    return fs.existsSync(folderPath);
  }

  // Read contents of a folder
  async readFolder(folderPath) {
    return await fs.promises.readdir(folderPath);
  }

  // Delete a folder and its contents
  async deleteFolder(folderPath) {
    if (fs.existsSync(folderPath)) {
      await fs.promises.rm(folderPath, { recursive: true });
    }
  }

  // Resize an image
  async resizeImage(width, height) {
    if (typeof width !== 'number' || typeof height !== 'number') {
      throw new Error('Width and height must be numbers');
    }

    const buffer = await fs.promises.readFile(this.filePath);
    const resizedBuffer = await sharp(buffer).resize(width, height).toBuffer();
    await fs.promises.writeFile(this.filePath, resizedBuffer);
  }

  // Convert image format
  async convertImageFormat(format) {
    const supportedFormats = ['jpeg', 'png', 'webp', 'avif'];
    if (!supportedFormats.includes(format)) {
      throw new Error(`Unsupported format: ${format}`);
    }

    const buffer = await fs.promises.readFile(this.filePath);
    const convertedBuffer = await sharp(buffer).toFormat(format).toBuffer();
    await fs.promises.writeFile(this.filePath, convertedBuffer);
  }

  // Compress an image
  async compressImage(quality = 80) {
    if (typeof quality !== 'number' || quality < 1 || quality > 100) {
      throw new Error('Quality must be a number between 1 and 100');
    }

    const buffer = await fs.promises.readFile(this.filePath);
    const compressedBuffer = await sharp(buffer).jpeg({ quality }).toBuffer();
    await fs.promises.writeFile(this.filePath, compressedBuffer);
  }

  // Compress multiple files into a ZIP archive
  async compressFiles(files, outputPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve(outputPath));
      archive.on('error', (err) => reject(err));

      archive.pipe(output);
      files.forEach((file) => {
        archive.file(file.path, { name: file.originalname });
      });
      archive.finalize();
    });
  }

  // Scan a file for malware
  async scanFile() {
    return new Promise((resolve, reject) => {
      exec('which clamscan', (error) => {
        if (error) {
          reject(new Error('clamscan is not installed.'));
          return;
        }

        exec(`clamscan ${this.filePath}`, (error, stdout) => {
          if (error) {
            reject(new Error('File is infected or corrupted.'));
          } else {
            resolve(stdout.includes('Infected files: 0') ? 'File is safe.' : 'File is infected.');
          }
        });
      });
    });
  }

  // Encrypt a file
  async encryptFile(secretKey) {
    if (!secretKey || secretKey.length < 32) {
      throw new Error('Secret key must be at least 32 characters long');
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    const input = fs.createReadStream(this.filePath);
    const output = fs.createWriteStream(`${this.filePath}.enc`);

    input.pipe(cipher).pipe(output);

    await new Promise((resolve, reject) => {
      output.on('finish', () => {
        fs.writeFileSync(`${this.filePath}.iv`, iv); // Save IV for decryption
        resolve();
      });
      output.on('error', reject);
    });
  }

  // Decrypt a file
  async decryptFile(secretKey) {
    if (!secretKey || secretKey.length < 32) {
      throw new Error('Secret key must be at least 32 characters long');
    }

    const iv = fs.readFileSync(`${this.filePath}.iv`);
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    const input = fs.createReadStream(this.filePath);
    const output = fs.createWriteStream(this.filePath.replace('.enc', ''));

    input.pipe(decipher).pipe(output);

    await new Promise((resolve, reject) => {
      output.on('finish', resolve);
      output.on('error', reject);
    });
  }
}

export default FileHandler;