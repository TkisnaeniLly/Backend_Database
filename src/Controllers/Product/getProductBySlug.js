const response = require("response");

const Product = require("../../Models/scripts/Catalog/Product");
const Category = require("../../Models/scripts/Catalog/Category");
const Brand = require("../../Models/scripts/Catalog/Brand");
const Media = require("../../Models/scripts/Catalog/Media");
const Variant = require("../../Models/scripts/Catalog/Variant");
const Inventory = require("../../Models/scripts/Catalog/Inventory");

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
          attributes: ["id", "category_name"],
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

    response(res, {
      statusCode: 200,
      message: "Detail produk",
      data: product,
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
