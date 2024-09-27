const express = require("express");
const router = express.Router();
const { Story, Slide } = require("../../schemas/story");
// const Slide = require("../../schemas/slide");

router.post("/create", async (req, res) => {
  try {
    const {
      headings,
      descriptions,
      images,
      category,
      likes = 0,
      bookmarks = 0,
    } = req.body;

    if (!headings || !descriptions || !category) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const slides = [];

    for (let key of Object.keys(headings)) {
      const heading = headings[key];
      const description = descriptions[key];
      const image = images[key];

      if (!heading || !description || !image) {
        return res
          .status(400)
          .json({ message: `Missing data for slide: ${key}` });
      }

      const slide = new Slide({
        image,
        heading,
        description,
        category,
      });

      await slide.save();
      slides.push(slide._id);
    }

    const story = new Story({
      author: req.user._id, // Assuming user data comes from a middleware
      slides,
      likes,
      bookmarks,
    });

    await story.save();

    return res
      .status(201)
      .json({ message: "Story created successfully", story });
  } catch (error) {
    console.error("Error creating story:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;

router.get("/all", async (req, res, next) => {
  try {
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(403).send("Wrong request");
    }
    const story = await Story.findById(id);
    res.status(200).json(story);
  } catch (err) {
    next(err);
  }
});

// filtering based on category
router.get("/filter/:category", async (req, res, next) => {
  try {
    const categories = req.params.category;
    if (!categories) {
      return res.status(403).send("Wrong request");
    }
    const stories = await Story.find().populate({
      path: "slides",
      match: { category: categories },
    });
    res.status(200).json(stories);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
