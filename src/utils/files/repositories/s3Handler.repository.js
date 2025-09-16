import AWS from 'aws-sdk';
import { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME } from '../../../config/fileStorage.config.js';

class S3Handler {
  constructor(createIfNotExist = false) {
     this.s3 = new AWS.S3({
          AWS_ACCESS_KEY,
          AWS_SECRET_KEY,
     });
     this.bucketName = AWS_BUCKET_NAME;
     this.createIfNotExist = createIfNotExist;
  }

  // Upload a file to S3
  async uploadFile(file) {
    try {
      if (!file || !file.originalname || !file.buffer) {
        throw new Error('Invalid file object provided.');
      }

      const params = {
        Bucket: this.bucketName,
        Key: file.originalname,
        Body: file.buffer,
      };

      const data = await this.s3.upload(params).promise();
      return data.Location; // URL of the uploaded file
    } catch (error) {
      console.error('Error uploading file:', error.message);
      throw error;
    }
  }

  // Delete a file from S3
  async deleteFile(fileKey) {
    try {
      if (!fileKey) {
        throw new Error('Invalid file key provided.');
      }

      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
      };

      await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Error deleting file:', error.message);
      throw error;
    }
  }

  // Get a public URL for a file
  async getFileUrl(fileKey) {
    try {
      if (!fileKey) {
        throw new Error('Invalid file key provided.');
      }

      return `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`;
    } catch (error) {
      console.error('Error getting file URL:', error.message);
      throw error;
    }
  }

  // Update an existing file on S3
  async updateFile(fileKey, file) {
    try {
      if (!fileKey || !file || !file.buffer) {
        throw new Error('Invalid file key or file object provided.');
      }

      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
      };

      const data = await this.s3.upload(params).promise();
      return data.Location; // URL of the updated file
    } catch (error) {
      console.error('Error updating file:', error.message);
      throw error;
    }
  }

  // List all files in the bucket
  async listFiles() {
    try {
      const params = {
        Bucket: this.bucketName,
      };

      const data = await this.s3.listObjectsV2(params).promise();
      return data.Contents.map((file) => ({
        key: file.Key,
        lastModified: file.LastModified,
        size: file.Size,
      }));
    } catch (error) {
      console.error('Error listing files:', error.message);
      throw error;
    }
  }

  // Check if a bucket exists and optionally create it
  async ensureBucketExists() {
    try {
      const buckets = await this.s3.listBuckets().promise();
      const bucketExists = buckets.Buckets.some(
        (bucket) => bucket.Name === this.bucketName
      );

      if (!bucketExists && this.createIfNotExist) {
        const params = { Bucket: this.bucketName };
        await this.s3.createBucket(params).promise();
        console.log(`Bucket "${this.bucketName}" created.`);
      } else if (!bucketExists) {
        throw new Error(`Bucket "${this.bucketName}" does not exist.`);
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error.message);
      throw error;
    }
  }

  // Generate a signed URL for temporary access
  async getSignedUrl(fileKey, expiresIn = 3600) {
    try {
      if (!fileKey) {
        throw new Error('Invalid file key provided.');
      }

      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
        Expires: expiresIn, // Default expiration time: 1 hour
      };

      return this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.error('Error generating signed URL:', error.message);
      throw error;
    }
  }
}

export default S3Handler;
