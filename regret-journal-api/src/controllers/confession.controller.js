const Confession = require('../models/Confession.model');
const mongoose = require('mongoose');

// Helper function to get user's location
const getUserLocation = (req) => {
  // This could come from IP geolocation or frontend submission
  const { longitude, latitude } = req.body.location || {};
  
  return longitude && latitude 
    ? {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      } 
    : null;
};

exports.createConfession = async (req, res) => {
  try {
    const { 
      content, 
      emotions, 
      anonymityLevel = 'full', 
      tags = [],
      isPublic = true,
      contentType = 'text',
      audioContent
    } = req.body;

    // Basic validation
    if (!content && !audioContent) {
      return res.status(400).json({ 
        error: 'Confession content is required' 
      });
    }

    // Create confession object
    const confessionData = {
      content: contentType === 'text' ? content : '',
      audioContent: contentType === 'audio' ? audioContent : null,
      contentType,
      emotions: Array.isArray(emotions) ? emotions : [emotions],
      anonymityLevel,
      tags,
      isPublic,
      location: getUserLocation(req),
      
      // Optional: Add user if authenticated
      author: req.user ? req.user._id : null
    };

    // Create and save confession
    const confession = new Confession(confessionData);
    await confession.save();

    res.status(201).json({
      message: 'Confession submitted successfully',
      confession: {
        id: confession._id,
        contentType: confession.contentType,
        emotions: confession.emotions,
        createdAt: confession.createdAt
      }
    });
  } catch (error) {
    console.error('Confession submission error:', error);
    
    // Mongoose validation error handling
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation Failed', 
        details: errors 
      });
    }

    res.status(500).json({ 
      error: 'Failed to submit confession', 
      message: error.message 
    });
  }
};

exports.getNearbyConfessions = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ 
        error: 'Longitude and latitude are required' 
      });
    }

    const nearbyConfessions = await Confession.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistance // meters
        }
      },
      isPublic: true
    })
    .limit(50)
    .select('content emotions createdAt location anonymityLevel');

    res.json({
      count: nearbyConfessions.length,
      confessions: nearbyConfessions
    });
  } catch (error) {
    console.error('Nearby confessions error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch nearby confessions', 
      message: error.message 
    });
  }
};

exports.getConfessionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid confession ID' });
    }

    const confession = await Confession.findById(id)
      .select('-__v')
      .populate('author', 'username');

    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    res.json(confession);
  } catch (error) {
    console.error('Get confession error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve confession', 
      message: error.message 
    });
  }
};

exports.getConfessions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      emotions,
      isPublic = true
    } = req.query;

    const query = { isPublic };

    // Optional emotion filter
    if (emotions) {
      query.emotions = { $in: Array.isArray(emotions) ? emotions : [emotions] };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      select: 'content emotions createdAt location anonymityLevel reactions'
    };

    const result = await Confession.paginate(query, options);

    res.json({
      total: result.totalDocs,
      totalPages: result.totalPages,
      currentPage: result.page,
      confessions: result.docs
    });
  } catch (error) {
    console.error('Get confessions error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve confessions', 
      message: error.message 
    });
  }
};

exports.updateConfession = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, emotions, anonymityLevel, tags } = req.body;

    // Validate ownership or admin rights
    const confession = await Confession.findById(id);
    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    // Optional: Add authorization check
    if (confession.author && confession.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this confession' });
    }

    // Update fields
    if (content) confession.content = content;
    if (emotions) confession.emotions = emotions;
    if (anonymityLevel) confession.anonymityLevel = anonymityLevel;
    if (tags) confession.tags = tags;

    await confession.save();

    res.json({
      message: 'Confession updated successfully',
      confession: {
        id: confession._id,
        content: confession.content,
        emotions: confession.emotions
      }
    });
  } catch (error) {
    console.error('Update confession error:', error);
    res.status(500).json({ 
      error: 'Failed to update confession', 
      message: error.message 
    });
  }
};

exports.deleteConfession = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ownership or admin rights
    const confession = await Confession.findById(id);
    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    // Optional: Add authorization check
    if (confession.author && confession.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this confession' });
    }

    await Confession.findByIdAndDelete(id);

    res.json({
      message: 'Confession deleted successfully',
      confessionId: id
    });
  } catch (error) {
    console.error('Delete confession error:', error);
    res.status(500).json({ 
      error: 'Failed to delete confession', 
      message: error.message 
    });
  }
};

exports.reactToConfession = async (req, res) => {
  try {
    const { id } = req.params;
    const { reactionType } = req.body;

    if (!['empathy', 'support', 'relate'].includes(reactionType)) {
      return res.status(400).json({ error: 'Invalid reaction type' });
    }

    const confession = await Confession.findByIdAndUpdate(
      id, 
      { $inc: { [`reactions.${reactionType}`]: 1 } },
      { new: true }
    );

    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    res.json({
      message: 'Reaction added successfully',
      reactions: confession.reactions
    });
  } catch (error) {
    console.error('Reaction error:', error);
    res.status(500).json({ 
      error: 'Failed to add reaction', 
      message: error.message 
    });
  }
};
