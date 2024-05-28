import { Router } from "express";
import { body, param } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { handleInputsErrors } from "./middleware";

const router = Router();
/**
 * @swagger
 * components:
 *    schemas:
 *        Product:
 *            type: object
 *            properties:
 *                id:
 *                  type: integer
 *                  description: The product ID
 *                  example: 1
 *                name:
 *                  type: string
 *                  description: The product name
 *                  example: Monitor curvo de 49 pulgadas
 *                price:
 *                  type: integer
 *                  description: The product price
 *                  example: 300
 *                availability:
 *                  type: boolean
 *                  description: The product availability
 *                  example: true
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                $ref: '#/components/schemas/Product'
 */

router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *        summary: Get a single products by ID
 *        tags:
 *            - Products
 *        description: Return a product bases on its unique ID
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The id of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *        responses:
 *            200:
 *                description: Succesful response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            404:
 *                description: Not Found
 *            400:
 *                description: Bad Request - Invalid ID
 */

router.get(
  "/:id",
  param("id").isInt().withMessage("ID no válido"),
  handleInputsErrors,
  getProductById
);

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags:
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor curvo 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *          201:
 *              description: Succesful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid input data
 */

router.post(
  "/",
  //Validation no asincrona
  //param("id").isInt().withMessage("ID no válido"),
  body("name")
    .notEmpty()
    .withMessage("El nombre del Producto no puede ir vacío"),

  body("price")
    .isNumeric()
    .withMessage("Valor no válido")
    .custom((value) => value > 0)
    .withMessage("Precio no válido")
    .notEmpty()
    .withMessage("El Precio no puede ir vacío"),
  handleInputsErrors,
  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags:
 *          - Products
 *      description: Return the updated product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor curvo 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Succesful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID or invalid input data
 *          404:
 *              description: Product not found
 */

router.put(
  "/:id",
  //Validation no asincrona
  param("id").isInt().withMessage("ID no válido"),
  body("name")
    .notEmpty()
    .withMessage("El nombre del Producto no puede ir vacío"),

  body("price")
    .isNumeric()
    .withMessage("Valor no válido")
    .custom((value) => value > 0)
    .withMessage("Precio no válido")
    .notEmpty()
    .withMessage("El Precio no puede ir vacío"),
  body("availability")
    .isBoolean()
    .withMessage("Valor para disponibilidad no válido"),
  handleInputsErrors,
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update Product availability
 *      tags:
 *          - Products
 *      description: Returns the updated avalability
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product not found
 */
router.patch(
  "/:id",
  param("id").isInt().withMessage("ID no válido"),
  handleInputsErrors,
  updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *       summary: Deletes a product by a given ID
 *       tags:
 *           - Products
 *       description: Return a confirmation message
 *       parameters:
 *         - in: path
 *           name: id
 *           description: The ID of the product to delete
 *           required: true
 *           schema:
 *               type: integer
 *       responses:
 *          200:
 *              description: Succesful response
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: string
 *                          value: 'Producto eliminado'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product not found
 */
router.delete(
  "/:id",
  param("id").isInt().withMessage("ID no válido"),
  handleInputsErrors,
  deleteProduct
);

export default router;
