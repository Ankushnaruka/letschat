const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file (image, video, pdf, etc.) to Cloudinary.
 * Expects multipart/form-data with a `file` field.
 * Returns { url, publicId, resourceType }.
 */
async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const { mimetype, buffer, originalname } = req.file;

        // Determine resource type based on MIME
        let resourceType = 'auto';
        if (mimetype.startsWith('image/')) resourceType = 'image';
        else if (mimetype.startsWith('video/')) resourceType = 'video';
        else resourceType = 'raw'; // pdf, zip, docx, etc.

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType,
                    folder: 'letschat',
                    // Allow access via URL without signed token
                    access_mode: 'public',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(buffer);
        });

        return res.status(200).json({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            resourceType: uploadResult.resource_type,
            format: uploadResult.format,
            bytes: uploadResult.bytes,
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ error: error.message || 'Upload failed' });
    }
}

module.exports = uploadFile;
