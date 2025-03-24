module.exports = {
  async afterCreate(event) {
    const { result } = event;
    
    // Log the creation event
    console.log('New atom created:', {
      id: result.id,
      atomId: result.atomId,
      timestamp: new Date().toISOString()
    });

    // Here you can add any additional logic that should happen after an atom is created
    // For example:
    // - Send notifications
    // - Trigger external service calls
    // - Update related records
    // - etc.
  }
};
