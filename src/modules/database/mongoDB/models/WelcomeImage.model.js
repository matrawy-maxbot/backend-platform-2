import mongoose from 'mongoose';

const welcomeImageSchema = new mongoose.Schema({
  server_id: {
    type: String,
    required: true,
    unique: true
  },
  canvas_width: {
    type: Number,
    default: 400
  },
  canvas_height: {
    type: Number,
    default: 256
  },
  layers: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['rectangle', 'text', 'image', 'circle'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: true
    },
    z_index: {
      type: Number,
      default: 0
    },
    specialist: {
      type: String,
      required: true
    },
    graphic_settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  strict: false // يسمح بإضافة حقول إضافية مثل باقي النماذج
});

const WelcomeImage = mongoose.model('WelcomeImage', welcomeImageSchema);

export default WelcomeImage;