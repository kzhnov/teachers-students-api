const assert = require("assert");
const {
  standardizeInput,
  retrieveMentionedEmails,
} = require("../src/utils/helpers");

describe("Helper functions", function () {
  describe("#standardizeInput()", function () {
    it("should return an array with email when provided param an email", function () {
      const arr = standardizeInput(["test@gmail.com"]);
      assert.deepEqual(arr, ["test@gmail.com"]);
    });
    it("should return an array with email when provided params are an email and array of emails", function () {
      const arr = standardizeInput([
        "test@gmail.com",
        ["test2@gmail.com", "test3@gmail.com"],
        ["test4@gmail.com"],
      ]);
      assert.deepEqual(arr, [
        "test@gmail.com",
        "test2@gmail.com",
        "test3@gmail.com",
        "test4@gmail.com",
      ]);
    });
    it("should return an array with unique emails when provided params have redundant emails", function () {
      const arr = standardizeInput(["test@gmail.com", ["test@gmail.com"]]);
      assert.deepEqual(arr, ["test@gmail.com"]);
    });
    it("should return an empty array when provided params is empty string", function () {
      const arr = standardizeInput([""]);
      assert.deepEqual(arr, []);
    });
  });
  describe("#retrieveMentionedEmails()", function () {
    it("should return an array with mentioned emails when provided text has mentioned emails", function () {
      const arr = retrieveMentionedEmails(
        "@test@gmail.com and @test2@gmail.com and @test3@gmail.com"
      );
      assert.deepEqual(arr, [
        "test@gmail.com",
        "test2@gmail.com",
        "test3@gmail.com",
      ]);
    });
    it("should return an array with mentioned emails when provided text has started with mentioned emails", function () {
      const arr = retrieveMentionedEmails(
        "@test@gmail.com and @test2@gmail.com and @test3@gmail.com"
      );
      assert.deepEqual(arr, [
        "test@gmail.com",
        "test2@gmail.com",
        "test3@gmail.com",
      ]);
    });
    it("should return an array with mentioned emails when provided text has mentioned emails but doesn't start with those", function () {
      const arr = retrieveMentionedEmails(
        "Hello @test@gmail.com @test2@gmail.com @test3@gmail.com"
      );
      assert.deepEqual(arr, [
        "test@gmail.com",
        "test2@gmail.com",
        "test3@gmail.com",
      ]);
    });
    it("should return an array with unique mentioned emails when provided text has duplicate mentioned emails", function () {
      const arr = retrieveMentionedEmails(
        "Hello @test@gmail.com @test@gmail.com @test3@gmail.com"
      );
      assert.deepEqual(arr, ["test@gmail.com", "test3@gmail.com"]);
    });
    it("should return an empty array when provided text has no mentioned emails", function () {
      const arr = retrieveMentionedEmails("Hello everyone");
      assert.deepEqual(arr, []);
    });
    it("should return an empty array when provided text has mentioned with invalid emails", function () {
      const arr = retrieveMentionedEmails(
        "Hello @test@gmail @test2@gmail. @test3"
      );
      assert.deepEqual(arr, []);
    });
  });
});
