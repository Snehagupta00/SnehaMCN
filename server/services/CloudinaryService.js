const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

class CloudinaryService {
  initialize() {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      console.log('✅ Cloudinary initialized');
    } catch (error) {
      console.error('❌ Cloudinary initialization error:', error);
    }
  }

  async uploadImage(buffer, folder = 'mission-proofs', userId, missionId) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `${folder}/${userId}`,
            public_id: `mission-${missionId}-${Date.now()}`,
            resource_type: 'image',
            format: 'jpg',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto' },
            ],
            tags: ['mission-proof', userId, missionId],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
              });
            }
          }
        );

        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  }

  async uploadImageFromBase64(base64String, folder = 'mission-proofs', userId, missionId) {
    try {
      const result = await cloudinary.uploader.upload(base64String, {
        folder: `${folder}/${userId}`,
        public_id: `mission-${missionId}-${Date.now()}`,
        resource_type: 'image',
        format: 'jpg',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
        ],
        tags: ['mission-proof', userId, missionId],
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (error) {
      console.error('Error uploading base64 image to Cloudinary:', error);
      throw error;
    }
  }

  async uploadImageFromUrl(imageUrl, folder = 'mission-proofs', userId, missionId) {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: `${folder}/${userId}`,
        public_id: `mission-${missionId}-${Date.now()}`,
        resource_type: 'image',
        format: 'jpg',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
        ],
        tags: ['mission-proof', userId, missionId],
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (error) {
      console.error('Error uploading image URL to Cloudinary:', error);
      throw error;
    }
  }

  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw error;
    }
  }

  getOptimizedUrl(publicId, options = {}) {
    const defaultOptions = {
      width: 800,
      height: 800,
      crop: 'limit',
      quality: 'auto',
      format: 'auto',
    };

    const transformations = { ...defaultOptions, ...options };
    return cloudinary.url(publicId, transformations);
  }

  getThumbnailUrl(publicId, size = 200) {
    return cloudinary.url(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
  }
}

const cloudinaryService = new CloudinaryService();
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinaryService.initialize();
}

module.exports = cloudinaryService;
