const express = require("express");
const router = express.Router();

const { Story, Slide, Like, Bookmark } = require("../../schemas/story");

router.post("/create", async (req, res) => {

  try {

    let {category, slides} = req.body;

    console.log(`{category, slides}=>`,{category, slides});
    if (slides.length < 3) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    slides = JSON.parse(slides);
    console.log(`parsed slides =>`,slides);
    const _slides = []

    for (let idx = 0; idx < slides.length; idx++) {
      const slide = new Slide({
        image: slides[idx].image,
        heading: slides[idx].heading,
        description: slides[idx].description,
      });
      
      _slides.push((await slide.save())._id);
    }

    const story = new Story({
      author: req.user._id, // Assuming user data comes from a middleware
      category: category,
      slides: _slides,
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

router.put("/edit/:id", async (req, res) => {

  try {

    const {id} = req.params;
    let {category, slides} = req.body;

    console.log(`{category, slides} =>`,{category, slides});
    if (slides.length < 3) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    slides = JSON.parse(slides);
    console.log(`parsed slides =>`,slides);
    const _slides = []

    for (let idx = 0; idx < slides.length; idx++) {
      let slide = slides[idx];
      console.log(`slide => `, slide);
      slide = await Slide.findByIdAndUpdate(slide._id, {
        image: slides[idx].image,
        heading: slides[idx].heading,
        description: slides[idx].description,
      }, {upsert: true})
      
      _slides.push(slide._id);
    }

    const story = await Story.findByIdAndUpdate(id, {category, slides: _slides}, {upsert: true}).populate(['author', 'slides']);

    return res
      .status(202)
      .json({ message: "Story Edited successfully", story });
  } catch (error) {
    console.error("Error Edited story:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post("/like/:id", async (req, res) => {

  try {

    const {id} = req.params;
    const {_id} = req.user;

    const like = new Like({
      story: id,
      user: _id
    })

    await like.save()

    return res
      .status(201)
      .json({ message: "Story Liked successfully", like });
  } catch (error) {
    console.error("Error Liked story:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.get("/liked", async (req, res) => {

  try {

    const {_id} = req.user;

    const likes = await Like.find({user: _id}).populate(['user','story'])

    return res
      .status(201)
      .json(likes);
  } catch (error) {
    console.error("Error Liked:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.get("/saved", async (req, res) => {

  try {

    const {_id} = req.user;

    const bookmarks = await Bookmark.find({user: _id}).populate(['user','story']) 

    return res
      .status(201)
      .json(bookmarks);
  } catch (error) {
    console.error("Error saved:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post("/save/:id", async (req, res) => {

  try {

    const {id} = req.params;
    const {_id} = req.user;

    const bookmark = new Bookmark({
      story: id,
      user: _id
    })

    await bookmark.save()

    return res
      .status(201)
      .json({ message: "Story Liked successfully", bookmark });
  } catch (error) {
    console.error("Error Liked story:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.get("/all", async (req, res, next) => {
  try {
    let stories = []
    const {category} = req.query;
    if (category?.trim()) {
      stories = await Story.find({category}).populate(['author', 'slides']);
      console.log(stories)
    } else {
      stories = await Story.find().populate(['author', 'slides']);
      console.log(stories)
    }
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
    const story = await Story.findById(id).populate(['author','slides']);
    res.status(200).json(story);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
