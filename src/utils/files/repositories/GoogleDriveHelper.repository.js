import { google } from 'googleapis';
import fs from 'fs';

class GoogleDriveHandler {
  constructor(credentialsPath, createIfNotExist = false) {
    // eslint-disable-next-line global-require
    this.credentials = require(credentialsPath);
    this.auth = new google.auth.GoogleAuth({
      credentials: this.credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    this.drive = google.drive({ version: 'v3', auth: this.auth });
    this.createIfNotExist = createIfNotExist;
  }

  async uploadFile(file, folderId = null) {
    try {
      if (!file || !file.originalname || !file.path) {
        throw new Error('Invalid file object provided.');
      }

      const fileMetadata = {
        name: file.originalname,
        parents: folderId ? [folderId] : [],
      };

      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id',
      });

      // Optionally delete the local file after upload
      fs.unlinkSync(file.path);

      return response.data.id; // File ID
    } catch (error) {
      console.error('Error uploading file:', error.message);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.drive.files.delete({ fileId });
    } catch (error) {
      console.error('Error deleting file:', error.message);
      throw error;
    }
  }

  async getFileUrl(fileId) {
    try {
      await this.drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      const response = await this.drive.files.get({
        fileId,
        fields: 'webViewLink',
      });

      return response.data.webViewLink;
    } catch (error) {
      console.error('Error getting file URL:', error.message);
      throw error;
    }
  }

  async updateFile(fileId, file) {
    try {
      if (!file || !file.path || !file.mimetype) {
        throw new Error('Invalid file object provided.');
      }

      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      };

      const response = await this.drive.files.update({
        fileId,
        media,
        fields: 'id',
      });

      return response.data.id; // Updated File ID
    } catch (error) {
      console.error('Error updating file:', error.message);
      throw error;
    }
  }

  async createFolder(folderName, parentFolderId = null) {
    try {
      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : [],
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        fields: 'id',
      });

      return response.data.id; // Folder ID
    } catch (error) {
      console.error('Error creating folder:', error.message);
      throw error;
    }
  }

  async readFolder(folderId) {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents`,
        fields: 'files(id, name, mimeType)',
      });

      return response.data.files;
    } catch (error) {
      console.error('Error reading folder:', error.message);
      throw error;
    }
  }

  async deleteFolder(folderId) {
    try {
      await this.drive.files.delete({ fileId: folderId });
    } catch (error) {
      console.error('Error deleting folder:', error.message);
      throw error;
    }
  }

  async getFileMetadata(fileId) {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size',
      });
      return response.data;
    } catch (error) {
      console.error('Error getting file metadata:', error.message);
      throw error;
    }
  }

  async findOrCreateFolder(folderName, parentFolderId = null) {
    try {
      const response = await this.drive.files.list({
        q: `'${parentFolderId || 'root'}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder'`,
        fields: 'files(id, name)',
      });

      if (response.data.files.length > 0) {
        return response.data.files[0].id; // Return existing folder ID
      }

      // If folder doesn't exist, create it
      if (this.createIfNotExist) {
        return await this.createFolder(folderName, parentFolderId);
      }

      throw new Error(`Folder "${folderName}" not found.`);
    } catch (error) {
      console.error('Error finding or creating folder:', error.message);
      throw error;
    }
  }
}

export default GoogleDriveHandler;
