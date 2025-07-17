const app = require("./app");
require("dotenv").config();

const port = process.env.PORT || 3000;

try {
  app.listen(port);
  console.log("Server running on http://localhost:" + port);
} catch (error) {
  console.error("Something went wrong with starting the server", { error });
}
