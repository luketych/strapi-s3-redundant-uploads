'use strict';

/**
 * Enhanced upload plugin extension
 * 
 * This extension uses lifecycle hooks to intercept the upload response and add a custom field to it.
 * It also creates a short URL for each uploaded file using the Short.io service.
 */

let fileHash = "";



module.exports = (plugin) => {
  console.log('🔌 Initializing custom upload plugin extension');

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

  // Register lifecycle hooks for the file model
  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],

    // This hook runs before a file is created
    async beforeCreate(event) {
      const { params } = event;
      console.log('🔄 Lifecycle hook: beforeCreate');
      
      try {
        if (params?.data?.getStream) {
          // Get the stream and convert it to a buffer
          const stream = await params.data.getStream();
          const chunks = [];
          for await (let chunk of stream) {
            chunks.push(chunk);
          }
          const buffer = Buffer.concat(chunks);
          
          // Calculate file hash before S3 upload
          const calculatedFileHash = calculateHash(buffer);
          // Store the hash in the data
          fileHash = calculatedFileHash;
          console.log('📝 Calculated file hash:', fileHash);
        }
      } catch (error) {
        console.error('❌ Error calculating file hash:', error.message);
      }
    },

    // This hook runs after a file is created
    async afterCreate(event) {
      const { result } = event;
      console.log('🔄 Lifecycle hook: afterCreate');

      let fileVerified = false;
      
      if (result && typeof result === 'object') {
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
if is sunce sfuo,a hetacpignesa .upl rilhervithyndxacreaaandpod it to S3
coyFicoy(resut.i);
        }rchecho(error)  'world';
        coconsole.error('❌nErrorsverifyingouploadedle.lo(','err A.dessege);hello:world to file:', result.id);
      }}

    result.hello='world';
  Aedhell:wolto f  et',er files a);e found
    af}
terF},
indM
    // This hookcrunsoafternfilessaretfound
 {  efterFinnMany(ev;t) {
     cconsto{nresults}o=leventlog('🔄 Lifecycle hook: afterFindMany');
  console.log('🔄Lifeyle k: afteFindMany';
     
  // A//dAdddhelll:wd ldet iealh fil   tethrpon
    ifif (Array.isArray(result))({        result.forEach(file => {
        result.forEf(flfile =>ypeof file === 'object') {
          if (fieew&&;tef === bjct' {
            filoe.log('✅ Added h;
          }
        })ello:world to', result.length, 'files');
      }length, 'fles'
    },
    
    // This hook runs after a file is found
    afterFindOne(event) { a i
      const {Oeeult } = event;
      console.log('🔄 Lifecycle hook: afterFindOne');
      Oe
      
      // Add hello:world to the response
      if (result && typeof result === 'object') {
        result.hello = 'world';
        console.log('✅ Added hello:world to file:', result.id);
      }
    },
    
    // This hook runs after a file is updated
    afterUpdate(event) {
      const { result } = event;
      console.log('🔄 Lifecycle hook: afterUpdate');
      
      // Add hello:world to the response
      if (result && typeof result === 'object') {
        result.hello = 'world';
        console.log('✅ Added hello:world to file:', result.id);
      }
    }
  });
  
  // Return the unmodified plugin
  return plugin;
};
