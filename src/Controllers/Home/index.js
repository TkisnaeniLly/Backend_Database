const response = require("response");
const homeAdmin = async (req, res) => {
  try {
    response(res, {
      statusCode: 200,
      message: "API Basis Data 2",
      data: null,
    });
  } catch (error) {
    console.error(error);
    response(res, {
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports = homeAdmin;
