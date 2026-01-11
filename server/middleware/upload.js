const multer = require('multer');
const CloudinaryService = require('../services/CloudinaryService');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (req.file) {
      const userId = req.user?.user_id || 'anonymous';
      const missionId = req.params?.id || 'unknown';

      const uploadResult = await CloudinaryService.uploadImage(
        req.file.buffer,
        'mission-proofs',
        userId,
        missionId
      );

      req.cloudinaryResult = uploadResult;
      req.proof = {
        type: 'SCREENSHOT',
        url: uploadResult.url,
        public_id: uploadResult.public_id,
        timestamp: new Date().toISOString(),
        metadata: {
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
        },
      };
    }
    next();
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to upload image',
    });
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
};
