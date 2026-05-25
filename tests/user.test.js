const request = require("supertest");
const { app } = require("../server");

describe("Server Test", () => {

  test("API should respond", async () => {

    const response = await request(app).get("/api");

    expect(response.statusCode).not.toBe(500);

  });

});