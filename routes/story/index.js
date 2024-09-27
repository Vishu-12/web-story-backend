const express = require("express");
const router = express.Router();
const Story = require("../../schemas/story");
const Slide = require("../../schemas/slide");

router.post("/create", async (req, res) => {
  try {
    console.log("Full req.body:", req.body);

    const story = new Story({
      author: req.user._id,
      slides: [],
      likes: req.body.likes || 0,
      bookmarks: req.body.bookmarks || 0,
    });
    const slides = Object.keys(req.body.headings).map((key) => {
      const heading = req.body.headings[key];
      const description = req.body.descriptions[key];
      const image = req.body.files.find(
        (file) => file.fieldname === key
      )?.filename;

      console.log(
        `Image: ${image}, Heading: ${heading}, Description: ${description}`
      );

      if (!heading || !description || !image) {
        throw new Error(
          `Missing heading, description, or image for slide: ${key}`
        );
      }

      return new Slide({
        image,
        heading,
        description,
        category: req.body.category,
      });
    });

    if (slides.length > 0) {
      story.slides.push(...slides.map((slide) => slide._id));

      await story.save();
      return res
        .status(201)
        .json({ message: "Story created successfully", story });
    } else {
      return res.status(400).json({ message: "Error creating slides" });
    }
  } catch (error) {
    console.error("Error while creating story:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
