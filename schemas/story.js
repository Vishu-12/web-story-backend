const mongoose = require("mongoose");

// // Story model
// const storySchema = new mongoose.Schema({
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "users",
//   },
//   slides: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Slide",
//     },
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   likes: {
//     type: Number,
//     default: 0,
//   },
//   bookmarks: {
//     type: Boolean,
//     default: false,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// storySchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model("Story", storySchema);

// const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["food", "health", "travel", "movie", "education"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Slide = mongoose.model("Slide", slideSchema);

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    slides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slide",
        required: true,
      },
    ],
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    bookmarks: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

storySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Story = mongoose.model("Story", storySchema);

module.exports = { Slide, Story };

// const stories = await Story.find().populate({
//   path: "slides",
//   match: { category: category }
// });
