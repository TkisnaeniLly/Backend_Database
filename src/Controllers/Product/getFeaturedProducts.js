const response = require("response");
const {
  sequelize,
  Product,
  Media,
  Brand,
  Category,
  Variant,
} = require("../../Models");

const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const featuredAdmin = await Product.findAll({
      where: { is_featured: true, status: "ACTIVE" },
      include: [
        { model: Media, attributes: ["media_url", "position"] },
        { model: Brand, attributes: ["id", "brand_name"] },
        {
          model: Category,
          as: "CategoriesM2M",
          attributes: ["id", "category_name"],
          through: { attributes: [] },
        },
        {
          model: Variant,
          attributes: ["id", "variant_type", "variant_value", "price"],
        },
      ],
    });

    const salesQuery = `
      SELECT p.id AS product_id, SUM(ci.qty) AS sold_qty
      FROM products p
      JOIN variants v ON v.product_id = p.id
      JOIN cart_items ci ON ci.variant_id = v.id
      JOIN checkouts co ON co.cart_id = ci.cart_id
      WHERE co.status = 'PAID'
      GROUP BY p.id
      ORDER BY sold_qty DESC
      LIMIT :limit
    `;

    const salesRows = await sequelize.query(salesQuery, {
      replacements: { limit },
      type: sequelize.QueryTypes.SELECT,
    });

    const salesArray = Array.isArray(salesRows)
      ? salesRows
      : salesRows
      ? [salesRows]
      : [];
    const topIds = salesArray.map((r) => r.product_id).filter(Boolean);

    const adminIds = new Set(featuredAdmin.map((p) => p.id));
    const idsToFetch = topIds.filter((id) => !adminIds.has(id));

    let topProducts = [];
    if (idsToFetch.length > 0) {
      topProducts = await Product.findAll({
        where: { id: idsToFetch, status: "ACTIVE" },
        include: [
          { model: Media, attributes: ["media_url", "position"] },
          { model: Brand, attributes: ["id", "brand_name"] },
          {
            model: Category,
            as: "CategoriesM2M",
            attributes: ["id", "category_name"],
            through: { attributes: [] },
          },
          {
            model: Variant,
            attributes: ["id", "variant_type", "variant_value", "price"],
          },
        ],
      });
    }

    const merged = [...featuredAdmin, ...topProducts].slice(0, limit);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const formatted = merged.map((p) => {
      const obj = p.toJSON();
      if (Array.isArray(obj.Media)) {
        obj.Media = obj.Media.map((m) => ({
          ...m,
          media_url: `${baseUrl}${m.media_url}`,
        }));
      }

      if (obj.CategoriesM2M) {
        obj.Categories = obj.CategoriesM2M;
        delete obj.CategoriesM2M;
      }
      return obj;
    });

    response(res, {
      statusCode: 200,
      message: "Produk unggulan",
      data: formatted,
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

module.exports = getFeaturedProducts;
