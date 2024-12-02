const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const validator = require('validator');

const ConfessionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Confession content is required'],
    trim: true,
    maxlength: [1000, 'Confession must be less than 1000 characters']
  },
  audioContent: {
    type: String,
    validate: {
      validator: function(v) {
        // Optional base64 validation if audio is present
        return !v || validator.isBase64(v);
      },
      message: 'Invalid base64 audio content'
    }
  },
  contentType: {
    type: String,
    enum: ['text', 'audio'],
    default: 'text'
  },
  emotions: [{
    type: String,
    enum: [
      'joy', 'sadness', 'anger', 'fear', 'surprise', 
      'disgust', 'neutral', 'love', 'regret', 
      'hope', 'anxiety', 'excitement', 'relief'
    ]
  }],
  anonymityLevel: {
    type: String,
    enum: ['full', 'location', 'username'],
    default: 'full'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Optional for anonymous posts
  },
  reactions: [{
    type: {
      type: String,
      enum: ['empathy', 'support', 'relate']
    },
    count: {
      type: Number,
      default: 0
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Geospatial indexing
ConfessionSchema.index({ 'location.coordinates': '2dsphere' });

// Add pagination plugin
ConfessionSchema.plugin(mongoosePaginate);

// Virtual for emotion intensity (optional)
ConfessionSchema.virtual('emotionIntensity').get(function() {
  // Could implement more complex emotion tracking
  return this.emotions.length;
});

// Sanitization middleware
ConfessionSchema.pre('save', function(next) {
  // Sanitize content
  if (this.content) {
    this.content = validator.escape(this.content);
  }

  // Validate location if provided
  if (this.location && this.location.coordinates) {
    const [longitude, latitude] = this.location.coordinates;
    if (
      longitude < -180 || longitude > 180 || 
      latitude < -90 || latitude > 90
    ) {
      this.location = undefined;
    }
  }

  next();
});

const Confession = mongoose.model('Confession', ConfessionSchema);

module.exports = Confession;
