import request from "supertest";
import server from "../../server";

describe("POST/api/products", () => {
  it("should display validation errors", async () => {
    const response = await request(server).post("/api/products").send({});
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4);

    expect(response.status).not.toEqual(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  it("should validate that the price is greather than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor curvo",
      price: 0,
    });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);

    expect(response.status).not.toEqual(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  it("should validate that the price is a number and greather than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor curvos",
      price: "hola",
    });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);

    expect(response.status).not.toEqual(404);
    expect(response.body.errors).not.toHaveLength(4);
  });

  it("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Mouse - Testingss",
      price: 50,
    });
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("data");
    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET/api/products", () => {
  it("should check if api/products url exists", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).not.toBe(404);
  });
  it("GET a JSON response with products", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveLength(1);

    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/products/:id", () => {
  it("Should return 404 response for a non-existent product", async () => {
    const productId = 200;
    const response = await request(server).get(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");
  });

  it("should check a valid ID in the URL", async () => {
    const response = await request(server).get("/api/products/not-valid-url");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("ID no válido");
  });

  it("get a JSON response for a singlew product", async () => {
    const response = await request(server).get("/api/products/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

describe("PUT /api/products/:id", () => {
  it("should check a valid ID in the URL", async () => {
    const response = await request(server)
      .put("/api/products/not-valid-url")
      .send({
        name: "Monitores",
        price: 400,
        availability: true,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("ID no válido");
  });
  it("Should display validation error messages when updating product", async () => {
    const response = await request(server).put("/api/products/1").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(5);

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("Should validate that the price is greather than 0", async () => {
    const response = await request(server).put("/api/products/1").send({
      name: "Monitores",
      price: 0,
      availability: true,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(1);

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
    expect(response.body.errors[0].msg).toBe("Precio no válido");
  });

  it("Should return a 404 for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: "Monitores",
        price: 300,
        availability: true,
      });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Producto no encontrado");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("Should update an existing product with valid data", async () => {
    const response = await request(server).put(`/api/products/1`).send({
      name: "Monitores",
      price: 300,
      availability: true,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("PATCH /api/producst/:id", () => {
  it("Should return a 404 response for non-existing product", async () => {
    const productID = 2000;
    const response = await request(server).patch(`/api/products/${productID}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should update the product availability", async () => {
    const response = await request(server).patch("/api/products/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.availability).toBe(false);

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty("error");
  });
});

describe("DELETE /api/products/:id", () => {
  it("Sould check a valid ID", async () => {
    const response = await request(server).delete("/api/products/not-valid");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("ID no válido");

    expect(response.status).not.toBe(200);
  });

  it("Should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server).delete(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");

    expect(response.status).not.toBe(200);
  });

  it("Should delete a product", async () => {
    const response = await request(server).delete("/api/products/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBe("Producto Eliminado");

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
  });
});
