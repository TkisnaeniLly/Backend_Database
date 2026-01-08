const response = require("response");
const { Product, Category, Brand, Media, Variant } = require("../../Models");

const getCatalog = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const products = await Product.findAll({
      where: { status: "ACTIVE" },
      include: [
        {
          model: Category,
          as: "CategoriesM2M",
          attributes: ["id", "category_name"],
          through: { attributes: [] },
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

    const formattedProducts = products.map((product) => {
      const data = product.toJSON();
      if (Array.isArray(data.Media)) {
        data.Media = data.Media.map((media) => ({
          ...media,
          media_url: `${baseUrl}${media.media_url}`,
        }));
      }

      if (!Array.isArray(data.CategoriesM2M) && data.Category) {
        data.CategoriesM2M = [data.Category];
        delete data.Category;
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
