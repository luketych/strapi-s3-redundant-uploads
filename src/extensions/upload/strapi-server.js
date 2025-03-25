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

  const { calculateHash, downloadFile, verifyAndCreateRedundantCopy } = require('./fileVerification');

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
      
      // 🔵🟣 [# learn] - ARCHIVE? 
      // if (result && typeof result === 'object') {
      //   await verifyAndCreateRedundantCopy(result, fileHash, event);
      //   result.hello = 'world';
      //   console.log('✅ Added hello:world to file:', result.id);
      // }
    },
    
    // This hook runs after files are found
    afterFindMany(event) {
      const { result } = event;
      console.log('🔄 Lifecycle hook: afterFindMany');
      
      // Add hello:world to each file in the response
      if (Array.isArray(result)) {
        result.forEach(file => {
          if (file && typeof file === 'object') {
            file.hello = 'world';
          }
        });
        console.log('✅ Added hello:world to', result.length, 'files');
      }
    },
    
    // This hook runs after a file is found
    afterFindOne(event) {
      const { result } = event;
      console.log('🔄 Lifecycle hook: afterFindOne');
      
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
