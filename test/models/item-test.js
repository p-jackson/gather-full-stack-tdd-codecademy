const Item = require("../../models/item");
const { assert } = require("chai");
const { mongoose, databaseUrl, options } = require("../../database");

describe("Model: Item", () => {
  beforeEach(async () => {
    await mongoose.connect(
      databaseUrl,
      options
    );
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  describe("#title", () => {
    it("should be a string", () => {
      const title = 3;
      const item = new Item({ title });
      assert.strictEqual(item.title, title.toString(10));
    });

    it("is required", () => {
      const item = new Item({});
      item.validateSync();
      assert.strictEqual(
        item.errors.title.message,
        "Path `title` is required."
      );
    });
  });

  describe("#description", () => {
    it("should be a string", () => {
      const description = 3;
      const item = new Item({ description });
      assert.strictEqual(item.description, description.toString(10));
    });

    it("is required", () => {
      const item = new Item({});
      item.validateSync();
      assert.strictEqual(
        item.errors.description.message,
        "Path `description` is required."
      );
    });
  });

  describe("#imageUrl", () => {
    it("should be a string", () => {
      const imageUrl = 3;
      const item = new Item({ imageUrl });
      assert.strictEqual(item.imageUrl, imageUrl.toString(10));
    });

    it("is required", () => {
      const item = new Item({});
      item.validateSync();
      assert.strictEqual(
        item.errors.imageUrl.message,
        "Path `imageUrl` is required."
      );
    });
  });
});
