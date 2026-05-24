const request = require("supertest");
const mongoose = require("mongoose");

const { app, server } = require("../server");

describe("User API Testing", () => {

  test("GET / should return 200", async () => {

    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);

  });

});

afterAll(async () => {

  await mongoose.connection.close();

  server.close();

});