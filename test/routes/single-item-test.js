const { assert } = require("chai");
const request = require("supertest");

const app = require("../../app");
const Item = require("../../models/item");

const {
  parseTextFromHTML,
  seedItemToDatabase,
  parseAttributeFromHTML
} = require("../test-utils");
const {
  connectDatabaseAndDropData,
  diconnectDatabase
} = require("../setup-teardown-utils");

describe("Server path: /items/:id", () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe("GET", () => {
    it("renders the items title and description", async () => {
      const item = await seedItemToDatabase();

      const response = await request(app).get(`/items/${item._id}`);

      assert.include(
        parseTextFromHTML(response.text, "#item-title"),
        item.title
      );
      assert.include(
        parseTextFromHTML(response.text, "#item-description"),
        item.description
      );
    });

    it("renders the items image", async () => {
      const item = await seedItemToDatabase();

      const response = await request(app).get(`/items/${item._id}`);

      assert.include(
        parseAttributeFromHTML(response.text, ".single-item-img img", "src"),
        item.imageUrl
      );
    });
  });

  describe("POST /items/:id/delete", () => {
    it("removes the item from the database", async () => {
      const item = await seedItemToDatabase();

      const response = await request(app)
        .post(`/items/${item._id}/delete`)
        .send();

      const deletedItem = await Item.findById(item._id);
      assert.notOk(deletedItem, "The item should have been deleted");

      assert.strictEqual(response.status, 302);
      assert.strictEqual(response.headers.location, "/");
    });
  });
});
