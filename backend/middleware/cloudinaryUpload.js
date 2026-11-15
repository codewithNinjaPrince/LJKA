import cloudinary from "../config/cloudinary.js";

/**
 * Adds a signed Cloudinary upload payload to the request. Feature routes only
 * need to supply the upload-specific parameters (folder, resource type, etc.),
 * keeping credentials and signing behaviour in one place.
 */
export const createCloudinarySignedUpload = (getUploadOptions) => async (req, res, next) => {
  try {
    const options = await getUploadOptions(req);
    const cloudConfig = cloudinary.config();

    if (!cloudConfig.cloud_name || !cloudConfig.api_key || !cloudConfig.api_secret) {
      throw new Error("Cloudinary configuration is incomplete.");
    }

    const signature = cloudinary.utils.api_sign_request(
      options.paramsToSign,
      cloudConfig.api_secret
    );

    req.cloudinaryUpload = {
      cloudName: cloudConfig.cloud_name,
      apiKey: cloudConfig.api_key,
      resourceType: options.resourceType,
      signature,
      params: options.paramsToSign,
      format: options.format,
      maxFileSize: options.maxFileSize,
    };

    next();
  } catch (error) {
    console.error("CLOUDINARY UPLOAD SIGNATURE ERROR:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to authorize file upload.",
    });
  }
};
