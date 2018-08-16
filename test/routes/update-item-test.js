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

describe("Server path: /items/:id/update", () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(diconnectDatabase);

  describe("GET", () => {
    it("renders the item attributes into the form", async () => {
      const item = await seedItemToDatabase();

      const response = await request(app).get(`/items/${item._id}/update`);

      assert.strictEqual(
        parseAttributeFromHTML(response.text, "input#title-input", "value"),
        item.title
      );
      assert.strictEqual(
        parseTextFromHTML(response.text, "textarea#description-input"),
        item.description
      );
      assert.strictEqual(
        parseAttributeFromHTML(response.text, "input#imageUrl-input", "value"),
        item.imageUrl
      );
    });

    it("renders the items image", async () => {
      const item = await seedItemToDatabase();

      const response = await request(app).get(`/items/${item._id}/update`);

      assert.strictEqual(
        parseAttributeFromHTML(response.text, "img#created-image", "src"),
        item.imageUrl
      );
    });
  });

  describe("POST", () => {
    it("updates the item in the database", async () => {
      const item = await seedItemToDatabase({ title: "my title" });
      const updateFields = {
        title: "new title",
        imageUrl: item.imageUrl,
        description: item.description
      };

      const response = await request(app)
        .post(`/items/${item._id}/update`)
        .type("form")
        .send(updateFields);

      const updatedItem = await Item.findById(item._id);
      assert.strictEqual(updatedItem.title, "new title");

      assert.strictEqual(response.status, 302);
      assert.strictEqual(response.headers.location, `/items/${item._id}`);
    });
  });
});
