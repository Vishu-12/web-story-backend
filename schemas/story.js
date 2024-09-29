const mongoose = require("mongoose");

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
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["food", "health", "travel", "movie", "education"],
      trim: true,
    },
    slides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slide",
        required: true,
      },
    ],
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

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
    required: true,
  },
});
const Like = mongoose.model("Like", likeSchema);

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
    required: true,
  },
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = { Slide, Story, Like, Bookmark };
