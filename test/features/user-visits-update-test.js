const { assert } = require("chai");
const { buildItemObject } = require("../test-utils");

describe("User visits update item", () => {
  describe("after creating a new item", () => {
    it("shows existing title in the input box", () => {
      const itemToCreate = buildItemObject();

      browser.url("/items/create");
      browser.setValue("#title-input", itemToCreate.title);
      browser.setValue("#description-input", itemToCreate.description);
      browser.setValue("#imageUrl-input", itemToCreate.imageUrl);
      browser.click("#submit-button");

      browser.click(".item-card a");
      browser.click('a[href$="update"]');

      assert.include(browser.getValue("input#title-input"), itemToCreate.title);
    });

    it("shows single view after updating item", () => {
      const itemToCreate = buildItemObject();

      browser.url("/items/create");
      browser.setValue("#title-input", itemToCreate.title);
      browser.setValue("#description-input", itemToCreate.description);
      browser.setValue("#imageUrl-input", itemToCreate.imageUrl);
      browser.click("#submit-button");

      browser.click(".item-card a");
      browser.click('a[href$="update"]');

      const updatedTitle = "new title";
      browser.setValue("input#title-input", updatedTitle);
      browser.click("#submit-button");

      assert.include(browser.getText("body"), updatedTitle);
    });
  });
});
