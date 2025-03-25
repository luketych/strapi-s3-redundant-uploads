'use strict';

const axios = require('axios');
const crypto = require('crypto');

// Helper function to calculate file hash
const calculateHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

// Helper function to download file
const downloadFile = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error.message);
    throw error;
  }
};

async function verifyAndCreateRedundantCopy(result, fileHash, event) {
  const uploadService = strapi.services['plugin::upload.upload'];
  let fileVerified = false;

  try {
    // Log initial file details
    console.log('📦 Uploaded file details:', JSON.stringify({
      id: result.id,
      name: result.name,
      size: result.size,
      mime: result.mime,
      url: result.url,
      s3Hash: result.hash,
      fileHash: fileHash
    }, null, 2));

    // Download and verify the file
    console.log('⬇️ Downloading file to verify integrity...');
    const fileBuffer = await downloadFile(result.url);
    
    // Calculate hash of downloaded file
    const calculatedHash = calculateHash(fileBuffer);
    
    // Calculate size difference percentage
    const resultSizeInBytes = result.size * 1000; // result.size is in KB
    const sizeDiff = Math.abs(fileBuffer.length - resultSizeInBytes); // result.size is in KB, buffer length is in bytes
    const sizeDiffPercentage = (sizeDiff / resultSizeInBytes) * 100;

    const doHashesMatch = calculatedHash === fileHash;

    console.log('🔒 File verification:', {
      downloadedSize: fileBuffer.length,
      expectedSize: result.size,
      sizeDifferenceBytes: sizeDiff,
      sizeDifferencePercentage: `${sizeDiffPercentage.toFixed(2)}%`,
      hashes: {
        calculatedAfterCreate: calculatedHash,
        calculatedBeforeCreate: fileHash,
        s3: result.hash
      },
      hashesMatch: doHashesMatch
    });

    // Verify file size with 1% tolerance
    if (sizeDiffPercentage > 1) {
      console.warn('⚠️ Warning: Downloaded file size differs by more than 1%');
    }

    // Compare downloaded hash with original file hash
    if (!doHashesMatch) {
      console.warn('⚠️ Warning: Downloaded file hash does not match original file hash');
    }

    // Update the file with verification status
    if (sizeDiffPercentage <= 1 && doHashesMatch) {
      fileVerified = true;
    }

    if (fileVerified === false) {
      throw new Error('File verification failed');
    }

    console.log('✅ File verification complete');

    // Create a redundant copy
    if (fileVerified) {
      console.log('📝 Creating redundant copy...');
      
      const copyFile = await uploadService._uploadImage({
        data: {
          fileInfo: { ...result }
        },
        files: [event.params.data]
      }, {});
      
      console.log('✅ Redundant copy created:', {
        originalId: result.id,
        copyId: copyFile[0].id,
        copyUrl: copyFile[0].url
      });
    }
  } catch (error) {
    console.error('❌ Error verifying uploaded file:', error.message);
  }
}

module.exports = {
  calculateHash,
  downloadFile,
  verifyAndCreateRedundantCopy
};
