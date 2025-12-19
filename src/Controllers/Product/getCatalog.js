const response = require("response");
const Product = require("../../Models/scripts/Catalog/Product");
const Category = require("../../Models/scripts/Catalog/Category");
const Brand = require("../../Models/scripts/Catalog/Brand");
const Media = require("../../Models/scripts/Catalog/Media");
const Variant = require("../../Models/scripts/Catalog/Variant");

const getCatalog = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const products = await Product.findAll({
      where: { status: "ACTIVE" },
      include: [
        {
          model: Category,
          attributes: ["id", "category_name"],
        },
        {
          model: Brand,
          attributes: ["id", "brand_name"],
        },
        {
          model: Media,
          attributes: ["media_url", "position"],
        },
        {
          model: Variant,
          attributes: ["id", "variant_type", "variant_value", "price"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // 🔥 inject full image url
    const formattedProducts = products.map((product) => {
      const data = product.toJSON();

      if (Array.isArray(data.Media)) {
        data.Media = data.Media.map((media) => ({
          ...media,
          media_url: `${baseUrl}${media.media_url}`,
        }));
      }

      return data;
    });

    response(res, {
      statusCode: 200,
      message: "Data katalog produk",
      data: formattedProducts,
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

module.exports = getCatalog;
