const { assert } = require("chai");
const request = require("supertest");
const { jsdom } = require("jsdom");

const app = require("../../app");
const Item = require("../../models/item");

const { parseTextFromHTML, buildItemObject } = require("../test-utils");
const {
  connectDatabaseAndDropData,
  diconnectDatabase
} = require("../setup-teardown-utils");

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe("Server path: /items/create", () => {
  const itemToCreate = buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe("GET", () => {
    it("renders empty input fields", async () => {
      const response = await request(app).get("/items/create");

      assert.isEmpty(parseTextFromHTML(response.text, "input#title-input"));
      assert.isEmpty(parseTextFromHTML(response.text, "input#imageUrl-input"));
      assert.isEmpty(
        parseTextFromHTML(response.text, "textarea#description-input")
      );
    });
  });

  describe("POST", () => {
    it("creates a new item in the database", async () => {
      const item = buildItemObject();

      const response = await request(app)
        .post("/items/create")
        .type("form")
        .send(item);

      const createdItem = await Item.findOne(item);
      assert.isOk(createdItem, "Item was not created in the database");
    });

    it("redirects to /", async () => {
      const item = buildItemObject();

      const response = await request(app)
        .post("/items/create")
        .type("form")
        .send(item);

      assert.strictEqual(response.status, 302);
      assert.strictEqual(response.headers.location, "/");
    });

    it("displays error message if item has no title", async () => {
      const item = { description: "desc", imageUrl: "url" };

      const response = await request(app)
        .post("/items/create")
        .type("form")
        .send(item);

      const items = await Item.find({});
      assert.isEmpty(items);

      assert.strictEqual(response.status, 400);
      assert.include(parseTextFromHTML(response.text, "form"), "required");
    });

    it("displays error message if item has no description", async () => {
      const item = { description: "desc", title: "title" };

      const response = await request(app)
        .post("/items/create")
        .type("form")
        .send(item);

      const items = await Item.find({});
      assert.isEmpty(items);

      assert.strictEqual(response.status, 400);
      assert.include(parseTextFromHTML(response.text, "form"), "required");
    });

    it("displays error message if item has no imageUrl", async () => {
      const item = { description: "desc", title: "title" };

      const response = await request(app)
        .post("/items/create")
        .type("form")
        .send(item);

      const items = await Item.find({});
      assert.isEmpty(items);

      assert.strictEqual(response.status, 400);
      assert.include(parseTextFromHTML(response.text, "form"), "required");
    });
  });
});
