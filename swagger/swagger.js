const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const swaggerUi = require("swagger-ui-express");

const file = fs.readFileSync(path.join(__dirname, "swagger.yaml"), "utf8");
const swaggerSpec = yaml.parse(file);

module.exports = { swaggerUi, swaggerSpec };
