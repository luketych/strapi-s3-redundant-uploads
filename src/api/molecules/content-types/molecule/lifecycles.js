module.exports = {
  async afterCreate(event) {
    const { result } = event;
    
    // Log the creation event
    console.log('New molecule created:', {
      id: result.id,
      moleculeId: result.moleculeId,
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
