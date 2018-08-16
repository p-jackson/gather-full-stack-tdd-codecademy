const router = require("express").Router();

const Item = require("../models/item");

router.get("/", async (req, res, next) => {
  const items = await Item.find({});
  res.render("index", { items });
});

router.get("/items/create", (req, res) => {
  res.render("create");
});

router.post("/items/create", async (req, res) => {
  const { title, description, imageUrl } = req.body;
  const item = new Item({ title, description, imageUrl });
  item.validateSync();

  if (item.errors) {
    res.status(400).render("create", { newItem: item });
  } else {
    await item.save();
    res.redirect("/");
  }
});

router.get("/items/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render("single", { item });
});

router.post("/items/:id/delete", async (req, res) => {
  await Item.deleteOne({ _id: req.params.id });
  res.redirect("/");
});

module.exports = router;
