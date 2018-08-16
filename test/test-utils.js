const { jsdom } = require("jsdom");

const Item = require("../models/item");

// Create and return a sample Item object
const buildItemObject = (options = {}) => {
  const title = options.title || "My favorite item";
  const imageUrl = options.imageUrl || "http://placebear.com/g/200/300";
  const description = options.description || "Just the best item";
  return { title, imageUrl, description };
};

// Add a sample Item object to mongodb
const seedItemToDatabase = async (options = {}) => {
  const item = await Item.create(buildItemObject(options));
  return item;
};

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(
      `No element with selector ${selector} found in HTML string`
    );
  }
};

// extract element attribute from an Element by selector.
const parseAttributeFromHTML = (htmlAsString, selector, attributeName) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    if (selectedElement.hasAttribute(attributeName)) {
      return selectedElement.getAttribute(attributeName);
    } else {
      throw new Error(
        `Element with selector "${selector}" does not have a "${attributeName}" attribute`
      );
    }
  } else {
    throw new Error(
      `No element with selector "${selector}" found in HTML string`
    );
  }
};

module.exports = {
  buildItemObject,
  seedItemToDatabase,
  parseTextFromHTML,
  parseAttributeFromHTML
};
