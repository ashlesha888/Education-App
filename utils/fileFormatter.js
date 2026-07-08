
export const formatUploadedFile = (
  uploadResult
) => {

  return {
    publicId: uploadResult.public_id,
    url: uploadResult.secure_url,
    resourceType: uploadResult.resource_type,
    format: uploadResult.format,
    width: uploadResult.width,
    height: uploadResult.height,    
    duration: uploadResult.duration || null,
    originalFilename: uploadResult.original_filename,
    size: uploadResult.bytes,
    createdAt: uploadResult.created_at,  
    };
};