const response = require("response");
const {
  Product,
  Category,
  Brand,
  Media,
  Variant,
  Inventory,
} = require("../../Models");

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return response(res, {
        statusCode: 400,
        message: "Slug produk wajib diisi",
        data: null,
      });
    }

    const product = await Product.findOne({
      where: {
        slug,
        status: "ACTIVE",
      },
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
          order: [["position", "ASC"]],
        },
        {
          model: Variant,
          attributes: ["id", "variant_type", "variant_value", "price"],
          include: [
            {
              model: Inventory,
              attributes: ["stock_qty", "stock_status"],
            },
          ],
        },
      ],
    });

    if (!product) {
      return response(res, {
        statusCode: 404,
        message: "Produk tidak ditemukan",
        data: null,
      });
    }

    // normalize to JSON and media full URL
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const data = product.toJSON();
    if (Array.isArray(data.Media)) {
      data.Media = data.Media.map((m) => ({
        ...m,
        media_url: `${baseUrl}${m.media_url}`,
      }));
    }

    // prefer `CategoriesM2M` array (many-to-many). If only legacy `Category` exists, convert.
    if (!Array.isArray(data.CategoriesM2M) && data.Category) {
      data.CategoriesM2M = [data.Category];
      delete data.Category;
    }

    response(res, {
      statusCode: 200,
      message: "Detail produk",
      data,
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

module.exports = getProductBySlug;
