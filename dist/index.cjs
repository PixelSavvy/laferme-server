(() => {
  "use strict";
  var e = {
    n: (t) => {
      var r = t && t.__esModule ? () => t.default : () => t;
      return e.d(r, { a: r }), r;
    },
    d: (t, r) => {
      for (var a in r) e.o(r, a) && !e.o(t, a) && Object.defineProperty(t, a, { enumerable: !0, get: r[a] });
    },
    o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
  };
  const t = require("cors");
  var r = e.n(t);
  const a = require("express");
  var o = e.n(a);
  const n = require("cookie-parser");
  var s = e.n(n);
  require("dotenv/config");
  const i = (e, t) => {
      const r = process.env[e] || t;
      if (!r) throw new Error(`Missing required environment variable: ${e}`);
      return r;
    },
    d = (e, t, r, a) => (void 0 !== a ? e.status(t).json({ message: r, data: a }) : e.status(t).json({ message: r })),
    c = [i("CLIENT_URL")],
    u = {
      origin: (e, t) => {
        -1 === c.indexOf(e) && e ? t(new Error("Not allowed by CORS")) : t(null, !0);
      },
      credentials: !0,
      optionsSuccessStatus: 200,
    },
    l = {
      development: {
        host: i("DB_HOST"),
        database: i("DB_NAME"),
        username: i("DB_USER"),
        password: i("DB_PASS"),
        port: Number(i("DB_PORT")),
        schema: i("DB_SCHEMA"),
        dialect: "postgres",
        logging: !1,
      },
      production: {
        host: i("DB_HOST"),
        database: i("DB_NAME"),
        username: i("DB_USER"),
        password: i("DB_PASS"),
        port: Number(i("DB_PORT")),
        schema: i("DB_SCHEMA"),
        dialect: "postgres",
        dialectOptions: { ssl: { require: !0, rejectUnauthorized: !1 } },
        logging: !1,
      },
    },
    p = ["CASH", "CONSIGNMENT", "TRANSFER", "TRIAL", "DISCOUNT"],
    y = ["PREPARING", "PREPARED", "CANCELLED", "RETURNED"],
    m = ["TODELIVER", "DELIVERING", "DELIVERED"],
    w = ["TR1", "TR2", "TR3", "TR4", "TR5", "TRD", "TRC"],
    f = "/api",
    h = "/products",
    g = "/customers",
    I = "/orders",
    b = "/freezone-items",
    A = "/distribution-items",
    E = require("sequelize"),
    D = l[i("NODE_ENV")],
    T = new E.Sequelize(D),
    z = T.define(
      "Product",
      {
        id: { type: E.DataTypes.INTEGER, allowNull: !1, primaryKey: !0, autoIncrement: !0 },
        title: { type: E.DataTypes.STRING, allowNull: !1 },
        productCode: { type: E.DataTypes.STRING, allowNull: !1 },
        hasVAT: { type: E.DataTypes.ENUM("0", "1"), allowNull: !1 },
        prices: { type: E.DataTypes.JSON, allowNull: !1 },
      },
      { timestamps: !1, indexes: [{ fields: ["id"] }, { fields: ["productCode"] }] }
    ),
    N = require("zod"),
    C = "სავალდებულოა",
    k = new RegExp("^[ა-ჰ\\-,\\s]+$"),
    R = N.z.object(
      {
        TR1: N.z.number({ required_error: C }).nonnegative({ message: "დადებითი რიცხვი" }),
        TR2: N.z.number({ required_error: C }).nonnegative({ message: "დადებითი რიცხვი" }),
        TR3: N.z.number({ required_error: C }).nonnegative({ message: "დადებითი რიცხვი" }),
        TR4: N.z.number({ required_error: C }).nonnegative({ message: "დადებითი რიცხვი" }),
        TR5: N.z.number({ required_error: C }).nonnegative({ message: "დადებითი რიცხვი" }),
        TRC: N.z.number({ required_error: C }).nonnegative({ message: "დადებითი რიცხვი" }),
        TRD: N.z.number({ required_error: C }).nonnegative({ message: "დადებითი რიცხვი" }),
      },
      { required_error: C }
    ),
    x = N.z.object({
      title: N.z.string({ required_error: C }).regex(k, { message: "მხოლოდ ქართული, მძიმე ან/და ტირე" }),
      productCode: N.z.string({ required_error: C }),
      hasVAT: N.z.enum(["0", "1"], { required_error: C }),
      prices: R,
    }),
    S = x.extend({ id: N.z.number({ required_error: C }).nonnegative() }),
    O = "სავალდებულოა",
    P = new RegExp("^[ა-ჰ\\s.,?!:;\"'()\\-+@#$%^&*<>[\\]{}|\\\\/]+$"),
    q = S.pick({ id: !0 }),
    v = N.z.object({
      name: N.z.string({ required_error: O }).regex(P, { message: "მხოლოდ ქართული ასოები" }),
      priceIndex: N.z.enum(w, { required_error: O }),
      paymentOption: N.z.enum(p, { required_error: O }),
      phone: N.z.string({ required_error: O }),
      email: N.z.string({ required_error: O }).email({ message: "არასწორი ფორმატი" }),
      needInvoice: N.z.enum(["0", "1"], { message: O }),
      products: N.z.array(q).optional(),
    }),
    _ = v.extend({
      id: N.z.number().nonnegative(),
      createdAt: N.z.coerce.date(),
      updatedAt: N.z.coerce.date(),
      deletedAt: N.z.coerce.date().nullable(),
    }),
    j = "სავალდებულოა",
    B = N.z.object({
      productId: N.z.number({ required_error: j }).nonnegative(),
      quantity: N.z.number({ required_error: j }).int().nonnegative(),
      weight: N.z.number({ required_error: j }).nonnegative(),
      price: N.z.number({ required_error: j }).nonnegative(),
    }),
    U = N.z.object({
      customerId: N.z.number().nonnegative(),
      status: N.z.enum(y, { required_error: j }),
      products: N.z.array(B),
    }),
    G = U.extend({
      id: N.z.number().nonnegative(),
      createdAt: N.z.coerce.date().optional(),
      updatedAt: N.z.coerce.date().optional(),
      deletedAt: N.z.coerce.date().nullable().optional(),
    }),
    V = N.z.object({ id: N.z.number().nonnegative(), products: N.z.array(B) }),
    M = "სავალდებულოა",
    $ = B.extend({
      freezoneItemId: N.z.number().nonnegative(),
      adjustedWeight: N.z.number().nonnegative(),
      adjustedQuantity: N.z.number().int().nonnegative(),
    }),
    K = N.z
      .object({
        orderId: N.z.number({ required_error: M }).nonnegative(),
        customerId: N.z.number().nonnegative(),
        status: N.z.enum(y, { required_error: M }),
        products: N.z.array($),
      })
      .extend({
        id: N.z.number().nonnegative(),
        createdAt: N.z.coerce.date().optional(),
        updatedAt: N.z.coerce.date().optional(),
        deletedAt: N.z.coerce.date().nullable().optional(),
      }),
    W = N.z.object({ id: N.z.number().nonnegative(), products: N.z.array($) }),
    F = "სავალდებულოა",
    L = $.extend({ distributedWeight: N.z.number().nonnegative() }).omit({
      quantity: !0,
      weight: !0,
      adjustedQuantity: !0,
    }),
    Q = N.z
      .object({
        freezoneItemId: N.z.number({ required_error: F }).nonnegative(),
        status: N.z.enum(m, { required_error: F }),
        products: N.z.array(L),
      })
      .extend({
        id: N.z.number().nonnegative(),
        createdAt: N.z.coerce.date().optional(),
        updatedAt: N.z.coerce.date().optional(),
        deletedAt: N.z.coerce.date().nullable().optional(),
      }),
    H =
      (_.omit({ createdAt: !0, updatedAt: !0, deletedAt: !0 }),
      T.define(
        "Customer",
        {
          id: { type: E.DataTypes.INTEGER, allowNull: !1, primaryKey: !0, autoIncrement: !0 },
          name: { type: E.DataTypes.STRING, allowNull: !1 },
          needInvoice: { type: E.DataTypes.STRING, allowNull: !1 },
          priceIndex: { type: E.DataTypes.ENUM(...w), allowNull: !1 },
          paymentOption: { type: E.DataTypes.ENUM(...p), allowNull: !1 },
          phone: { type: E.DataTypes.STRING, allowNull: !0 },
          email: { type: E.DataTypes.STRING, allowNull: !0 },
        },
        { timestamps: !0, paranoid: !0, indexes: [{ fields: ["id"] }, { fields: ["email"] }] }
      )),
    J =
      (G.omit({ products: !0, createdAt: !0, updatedAt: !0, deletedAt: !0 }),
      T.define(
        "Order",
        {
          id: { type: E.DataTypes.INTEGER, allowNull: !1, primaryKey: !0, autoIncrement: !0 },
          customerId: { type: E.DataTypes.INTEGER, allowNull: !1, references: { model: "Customers", key: "id" } },
          status: { type: E.DataTypes.ENUM(...y), allowNull: !1, defaultValue: y[0] },
        },
        { timestamps: !0, paranoid: !0, indexes: [{ fields: ["id"] }, { fields: ["customerId"] }] }
      )),
    X = T.define(
      "OrderProduct",
      {
        orderId: { type: E.DataTypes.INTEGER, allowNull: !1, references: { model: "Orders", key: "id" } },
        productId: { type: E.DataTypes.INTEGER, allowNull: !1, references: { model: "Products", key: "id" } },
        quantity: { type: E.DataTypes.INTEGER, allowNull: !1 },
        weight: { type: E.DataTypes.FLOAT, allowNull: !1 },
        price: { type: E.DataTypes.FLOAT, allowNull: !1 },
      },
      {
        timestamps: !1,
        indexes: [{ fields: ["orderId", "productId"] }, { fields: ["orderId"] }, { fields: ["productId"] }],
      }
    ),
    Y =
      (K.omit({ products: !0, createdAt: !0, updatedAt: !0, deletedAt: !0 }),
      T.define(
        "FreezoneItem",
        {
          id: { type: E.DataTypes.INTEGER, allowNull: !1, primaryKey: !0, autoIncrement: !0 },
          orderId: { type: E.DataTypes.INTEGER, allowNull: !1, references: { model: "Orders", key: "id" } },
          customerId: { type: E.DataTypes.INTEGER, allowNull: !1, references: { model: "Customers", key: "id" } },
          status: { type: E.DataTypes.ENUM(...y), allowNull: !1, defaultValue: y[0] },
        },
        { timestamps: !0, paranoid: !0, indexes: [{ fields: ["id"] }, { fields: ["orderId"] }] }
      )),
    Z = T.define(
      "FreezoneItemProduct",
      {
        freezoneItemId: { type: E.DataTypes.INTEGER, allowNull: !1, references: { model: "FreezoneItems", key: "id" } },
        productId: { type: E.DataTypes.INTEGER, allowNull: !1, references: { model: "Products", key: "id" } },
        quantity: { type: E.DataTypes.INTEGER, allowNull: !1 },
        weight: { type: E.DataTypes.FLOAT, allowNull: !1 },
        price: { type: E.DataTypes.FLOAT, allowNull: !1 },
        adjustedQuantity: { type: E.DataTypes.INTEGER, allowNull: !1, defaultValue: 0 },
        adjustedWeight: { type: E.DataTypes.FLOAT, allowNull: !1, defaultValue: 0 },
      },
      {
        timestamps: !1,
        indexes: [{ fields: ["productId", "freezoneItemId"] }, { fields: ["freezoneItemId"] }, { fields: ["productId"] }],
      }
    ),
    ee =
      (Q.omit({ products: !0, createdAt: !0, updatedAt: !0, deletedAt: !0 }),
      T.define(
        "DistributionItem",
        {
          id: { type: E.DataTypes.INTEGER, allowNull: !1, primaryKey: !0, autoIncrement: !0 },
          freezoneItemId: { type: E.DataTypes.INTEGER, allowNull: !1, references: { model: "Orders", key: "id" } },
          status: { type: E.DataTypes.ENUM(...m), allowNull: !1, defaultValue: m[0] },
        },
        { timestamps: !0, paranoid: !0, indexes: [{ fields: ["id"] }, { fields: ["freezoneItemId"] }] }
      )),
    te = T.define(
      "DistributionItemProduct",
      {
        distributionItemId: {
          type: E.DataTypes.INTEGER,
          allowNull: !1,
          references: { model: "DistributionItems", key: "id" },
        },
        productId: { type: E.DataTypes.INTEGER, allowNull: !1, references: { model: "Products", key: "id" } },
        price: { type: E.DataTypes.FLOAT, allowNull: !1 },
        adjustedWeight: { type: E.DataTypes.FLOAT, allowNull: !1, defaultValue: 0 },
        distributedWeight: { type: E.DataTypes.FLOAT, allowNull: !1, defaultValue: 0 },
      },
      {
        timestamps: !1,
        indexes: [
          { fields: ["productId", "distributionItemId"] },
          { fields: ["distributionItemId"] },
          { fields: ["productId"] },
        ],
      }
    );
  H.belongsToMany(z, {
    through: "CustomerProducts",
    foreignKey: "customerId",
    as: "products",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }),
    z.belongsToMany(H, {
      through: "CustomerProducts",
      foreignKey: "productId",
      as: "customers",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }),
    H.hasMany(J, { foreignKey: "customerId", as: "orders", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    J.belongsTo(H, { foreignKey: "customerId", as: "customer", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    J.belongsToMany(z, { through: X, foreignKey: "orderId", as: "products", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    z.belongsToMany(J, { through: X, foreignKey: "productId", as: "orders", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    Y.belongsTo(J, { foreignKey: "orderId", as: "order", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    J.hasOne(Y, { foreignKey: "orderId", as: "freezoneItem", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    Y.belongsToMany(z, {
      through: Z,
      as: "products",
      foreignKey: "freezoneItemId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }),
    z.belongsToMany(Y, {
      through: Z,
      as: "freezoneItemProducts",
      foreignKey: "productId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }),
    ee.belongsTo(Y, { foreignKey: "freezoneItemId", as: "freezone", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    Y.hasOne(ee, { foreignKey: "freezoneItemId", as: "distribution", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    ee.belongsToMany(z, {
      through: te,
      as: "products",
      foreignKey: "distributionItemId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }),
    z.belongsToMany(ee, {
      through: te,
      as: "distributionItemProducts",
      foreignKey: "productId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  const re = async (e, t) => {
      const r = e.body,
        a = v.safeParse(r);
      if (!a.success) return d(t, 400, "Validation error", a.error.format());
      try {
        const e = await (async (e, t, r) => {
          const a = await T.transaction();
          try {
            const e = await H.findOne({ where: { email: r.email }, transaction: a });
            if (e) return await a.rollback(), { success: !0, customer: e };
            let t = [];
            if (r.products && r.products.length > 0) {
              const e = r.products.map((e) => e.id);
              t = await z.findAll({ where: { id: { [E.Op.in]: e } }, transaction: a });
            }
            const o = await H.create(r);
            return await o.setProducts(t), await a.commit(), { exists: !1, customer: o };
          } catch (e) {
            throw (await a.rollback(), console.log("Failed to add a customer", e), new Error("Failed to create customer"));
          }
        })(0, 0, a.data);
        return e.exists
          ? d(t, 400, "სარეალიზაციო პუნქტი მსგავსი ელ.ფოსტით უკვე არსებობს", e.customer)
          : d(t, 201, "სარეალიზაციო პუნქტი წარმატებით დაემატა", e);
      } catch (e) {
        return console.error("Error adding a customer:", e), d(t, 500, "შეცდომა სარეალიზაციო პუნქტის შექმნისას", e);
      }
    },
    ae = async (e, t) => {
      try {
        const e = await (async () => {
          try {
            return await H.findAll({ include: [{ model: z, as: "products", through: { attributes: [] } }], nest: !0 });
          } catch (e) {
            throw e;
          }
        })();
        return e.length
          ? d(t, 200, "სარეალიზაციო პუნქტი წარმატებით მოიძებნა", e)
          : d(t, 200, "სარეალიზაციო პუნქტები ვერ მოიძებნა", []);
      } catch (e) {
        return console.error(e), d(t, 505, "შეცდომა სარეალიზაციო პუნქტების ძებნისას", e);
      }
    },
    oe = async (e, t) => {
      const r = e.body,
        a = _.safeParse(r);
      if (!a.success) return d(t, 400, "Validation error", a.error.format());
      try {
        const e = await (async (e) => {
          const t = await T.transaction();
          try {
            const r = await H.findByPk(e.id, { transaction: t });
            if (!r) return await t.rollback(), { exists: !1, customer: null };
            const a = await r.update(e, { transaction: t });
            let o = [];
            if (e.products && e.products.length > 0) {
              const r = e.products.map((e) => e.id);
              if (
                ((o = await z.findAll({ where: { id: { [E.Op.in]: r } }, transaction: t })), o.length !== e.products.length)
              )
                return await t.rollback(), { exists: !1, customer: null };
            }
            return await a.setProducts(o), await t.commit(), { exists: !0, customer: a };
          } catch (e) {
            throw (await t.rollback(), e);
          }
        })(a.data);
        return e.exists
          ? d(t, 200, "სარეალიზაციო პუნქტი წარმატებით განახლდა", e)
          : d(t, 404, "სარეალიზაციო პუნქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა", e.customer);
      } catch (e) {
        return console.error(e), d(t, 505, "შეცდომა სარეალიზაციო პუნქტის რედაქტირებისას", e);
      }
    },
    ne = async (e, t) => {
      const { id: r } = e.params;
      try {
        await (async (e, t, r) => {
          const a = await T.transaction();
          try {
            const e = await H.findByPk(r, { transaction: a });
            return e
              ? (await e.destroy({ transaction: a }),
                (await H.findByPk(r, { transaction: a }))
                  ? (await a.rollback(), d(t, 500, "სარეალიზაციო პუნქტის წაშლა ვერ მოხერხდა!"))
                  : (await a.commit(), d(t, 200, "სარეალიზაციო პუნქტი წარმატებით წაიშალა!")))
              : (await a.rollback(), d(t, 404, "სარეალიზაციო პუნქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა!"));
          } catch (e) {
            throw (await a.rollback(), e);
          }
        })(0, t, r);
      } catch (e) {
        return console.error(e), d(t, 505, "შეცდომა სარეალიზაციო პუნქტის წაშლისას", e);
      }
    },
    se = async (e, t) => {
      try {
        const e = await (async () => {
          try {
            return await H.findAll({ include: [{ model: z, as: "products", through: { attributes: [] } }], nest: !0 });
          } catch (e) {
            throw e;
          }
        })();
        return e.length
          ? d(t, 200, "სარეალიზაციო პუნქტი წარმატებით მოიძებნა", e)
          : d(t, 200, "სარეალიზაციო პუნქტი ვერ მოიძებნა", []);
      } catch (e) {
        return console.error(e), d(t, 505, "შეცდომა სარეალიზაციო პუნქტის ძებნისას", e);
      }
    },
    ie = async (e, t) => {
      const { id: r } = e.params;
      try {
        const e = await (async (e, t, r) => {
          try {
            return (
              (await ee.findByPk(r, {
                attributes: { exclude: ["freezoneItemId"] },
                include: [
                  { model: Y, as: "freezone" },
                  {
                    model: z,
                    as: "products",
                    attributes: ["id", "title", "productCode"],
                    through: { as: "details", attributes: ["adjustedWeight", "adjustedQuantity", "distributedWeight"] },
                  },
                ],
              })) || d(t, 404, "მსგავსი დისტრიბუცია ვერ მოიძებნა")
            );
          } catch (e) {
            throw e;
          }
        })(0, t, Number(r));
        return d(t, 200, "დისტრიბუცია წარმატებით მოიძებნა!", e);
      } catch (e) {
        return console.error("Error fetching an order", e), d(t, 500, "შეცდომა დისტრიბუციის ძებნისას", e);
      }
    },
    de = async (e, t) => {
      try {
        const e = await (async () => {
          try {
            const e = await ee.findAll({
              include: [
                { model: Y, as: "freezone", attributes: ["orderId"] },
                {
                  model: z,
                  as: "products",
                  attributes: ["id", "title", "productCode"],
                  through: { as: "distributionDetails", attributes: ["adjustedWeight", "distributedWeight", "price"] },
                },
              ],
            });
            if (0 === e.length) return { exists: !1, data: e };
            const t = e.map((e) => e.freezone.orderId),
              r = await J.findAll({
                where: { [E.Op.or]: { id: t } },
                include: [{ model: H, as: "customer", attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] } }],
              });
            return {
              exists: !0,
              data: e.map((e) => {
                const t = r.find((t) => t.id === e.freezone?.orderId);
                return { ...e.toJSON(), customer: t?.customer };
              }),
            };
          } catch (e) {
            throw e;
          }
        })();
        return e.exists
          ? d(t, 200, "დისტრიბუციები წარმატებით მოიძებნა!", e.data)
          : d(t, 202, "შეკვეთები დისტრიბუციაში ვერ მოიძებნა", e.data);
      } catch (e) {
        return console.error("Error fetching an order", e), d(t, 500, "შეცდომა დისტრიბუციის ძებნისას", e);
      }
    },
    ce = async (e, t) => {
      const r = e.body,
        a = Q.safeParse(r);
      if (!a.success) return d(t, 400, "Validation error", a.error.format());
      try {
        const e = await (async (e, t, r) => {
          const a = await T.transaction();
          try {
            const e = await ee.findByPk(r.id, { transaction: a });
            if (!e) return await a.rollback(), { exists: !1, data: e };
            const { products: t, ...o } = r,
              n = await e.update(o, { transaction: a }),
              s = r.products.map((e) => ({
                distributionItemId: n.id,
                productId: e.productId,
                price: e.price,
                adjustedWeight: e.adjustedWeight,
                distributedWeight: e.distributedWeight,
              }));
            return (
              await te.destroy({ where: { distributionItemId: n.id }, transaction: a }),
              await te.bulkCreate(s, { transaction: a }),
              await a.commit(),
              { exists: !0, order: n }
            );
          } catch (e) {
            throw (await a.rollback(), console.error("Error updating distribution item:", e), e);
          }
        })(0, 0, a.data);
        return e.exists ? d(t, 200, "შეკვეთა წარმატებით განახლდა", e.data) : d(t, 202, "შეკვეთა ვერ მოიძებნა", e.data);
      } catch (e) {
        return console.error("Error updating an order:", e), d(t, 500, "შეცდომა შეკვეთის განახლებისას", e);
      }
    },
    ue = async (e, t) => {
      const { id: r } = e.params;
      try {
        const e = await (async (e, t, r) => {
          try {
            return (
              (await Y.findByPk(r, {
                include: [
                  {
                    model: z,
                    as: "products",
                    attributes: ["id", "title", "productCode"],
                    through: {
                      as: "freezoneDetails",
                      attributes: ["weight", "quantity", "adjustedWeight", "adjustedQuantity"],
                    },
                  },
                ],
              })) || d(t, 404, "მსგავსი შეკვეთა თავისუფალ ზონაში ვერ მოიძებნა")
            );
          } catch (e) {
            throw e;
          }
        })(0, t, Number(r));
        return d(t, 200, "შეკვეთა თავისუფალ ზონაში წარმატებით მოიძებნა!", e);
      } catch (e) {
        return console.error("Error fetching an order", e), d(t, 500, "შეცდომა შეკვეთის ძებნისას", e);
      }
    },
    le = async (e, t) => {
      const { id: r } = e.params;
      try {
        const e = await (async () => {
          try {
            const e = await Y.findAll({
              include: [
                {
                  model: z,
                  as: "products",
                  attributes: ["id", "title", "productCode"],
                  through: {
                    as: "freezoneDetails",
                    attributes: ["weight", "quantity", "adjustedWeight", "adjustedQuantity", "price"],
                  },
                },
              ],
            });
            if (0 === e.length) return { exists: !1, freezoneItems: e };
            const t = e.map((e) => e.orderId),
              r = await J.findAll({
                where: { [E.Op.or]: { id: t } },
                include: [{ model: H, as: "customer", attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] } }],
              });
            return {
              exists: !0,
              freezoneItems: e.map((e) => {
                const t = r.find((t) => t.id === e.orderId);
                return { ...e.toJSON(), customer: t?.customer };
              }),
            };
          } catch (e) {
            throw e;
          }
        })(0, 0, Number(r));
        return e.exists
          ? d(t, 200, "შეკვეთები თავისუფალ ზონაში წარმატებით მოიძებნა!", e.freezoneItems)
          : d(t, 202, "შეკვეთები თავისუფალ ზონაში ვერ მოიძებნა", e.freezoneItems);
      } catch (e) {
        return console.error("Error fetching an order", e), d(t, 500, "შეცდომა შეკვეთების ძებნისას", e);
      }
    },
    pe = async (e, t) => {
      const r = e.body,
        a = W.safeParse(r);
      if (!a.success) return d(t, 400, "Validation error", a.error.format());
      try {
        const e = await (async (e, t, r) => {
          const a = await T.transaction();
          try {
            const e = await Y.findOne({ where: { id: r.id, orderId: r.id }, attributes: ["id"], transaction: a });
            if (!e) return await a.rollback(), { exists: !1, freezoneItem: e };
            const t = r.products.map((e) => ({ ...e }));
            return (
              await Z.bulkCreate(t, { transaction: a, updateOnDuplicate: ["adjustedWeight", "adjustedQuantity"] }),
              await a.commit(),
              { exists: !0, freezoneItem: e }
            );
          } catch (e) {
            throw (await a.rollback(), console.error("Error updating freezone item:", e), e);
          }
        })(0, 0, a.data);
        return e.exists
          ? d(t, 200, "შეკვეთა წარმატებით განახლდა", e.freezoneItem)
          : d(t, 202, "შეკვეთა ვერ მოიძებნა", e.freezoneItem);
      } catch (e) {
        return console.error("Error updating an order:", e), d(t, 500, "შეცდომა შეკვეთის განახლებისას", e);
      }
    },
    ye = async (e, t) => {
      const r = await T.transaction(),
        a = e.body,
        o = U.safeParse(a);
      if (!o.success) return d(t, 400, "Validation error", o.error.format());
      try {
        const e = await (async (e, t, r) => {
          const a = await T.transaction();
          try {
            if (!(await H.findByPk(r.customerId, { transaction: a }))) return void (await a.rollback());
            const { products: e, ...t } = r,
              o = await J.create(t, { transaction: a }),
              n = r.products.map((e) => ({ orderId: o.id, ...e }));
            return await X.bulkCreate(n, { transaction: a }), await a.commit(), o.id;
          } catch (e) {
            throw (await a.rollback(), e);
          }
        })(0, 0, o.data);
        if (!e) return await r.rollback(), d(t, 500, "შეცდომა შეკვეთის შექმნისას");
        const a = await (async (e, t, r) => {
          const a = await T.transaction();
          try {
            const e = await J.findByPk(r, { transaction: a, raw: !0 });
            if (!e) return;
            const t = await Y.create({ id: r, orderId: r, status: e.status, customerId: e.customerId }, { transaction: a }),
              o = (await X.findAll({ where: { orderId: e.id }, raw: !0 })).map((e) => ({
                ...e,
                freezoneItemId: t.id,
                adjustedWeight: 0,
                adjustedQuantity: 0,
              }));
            if (0 === (await Z.bulkCreate(o, { transaction: a })).length) return;
            return await a.commit(), t.id;
          } catch (e) {
            throw (await a.rollback(), e);
          }
        })(0, 0, e);
        return a
          ? (await r.commit(), d(t, 201, "შეკვეთა წარმატებით დაემატა", a))
          : (await r.rollback(), d(t, 500, "შეცდომა შეკვეთის თავისუფალ ზონაში დამატებისას"));
      } catch (e) {
        return await r.rollback(), console.error("Error adding an order:", e), d(t, 500, "შეცდომა შეკვეთის შექმნისას", e);
      }
    },
    me = async (e, t) => {
      const { id: r } = e.params;
      try {
        const e = await (async (e, t, r) => {
          try {
            const e = await J.findByPk(r, {
              attributes: { exclude: ["customerId"] },
              include: [
                { model: H, as: "customer", attributes: { include: ["createdAt", "updatedAt", "deletedAt"] } },
                {
                  model: z,
                  as: "products",
                  attributes: ["id", "title", "productCode", "hasVAT"],
                  through: { as: "orderDetails", attributes: ["quantity", "weight", "price"] },
                },
              ],
            });
            return e ? { exists: !0, order: e } : { exists: !1, order: null };
          } catch (e) {
            throw e;
          }
        })(0, 0, Number(r));
        return e.exists ? d(t, 201, "შეკვეთა წარმატებით მოიძებნა!", e.order) : d(t, 202, "შეკვეთა ვერ მოიძებნა", e.order);
      } catch (e) {
        return console.error("Error fetching an order", e), d(t, 500, "შეცდომა შეკვეთის ძებნისას", e);
      }
    },
    we = async (e, t) => {
      try {
        const e = await (async () => {
          try {
            const e = await J.findAll({
              attributes: { exclude: ["customerId"] },
              include: [
                { model: H, as: "customer", attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] } },
                {
                  model: z,
                  as: "products",
                  attributes: ["id", "title", "productCode", "hasVAT"],
                  through: { as: "orderDetails", attributes: ["quantity", "weight", "price"] },
                },
              ],
            });
            return 0 === e.length ? { exists: !1, orders: e } : { exists: !0, orders: e };
          } catch (e) {
            throw e;
          }
        })();
        return e.exists
          ? d(t, 200, "შეკვეთები წარმატებით მოიძებნა", e.orders)
          : d(t, 202, "შეკვეთები ვერ მოიძებნა", e.orders);
      } catch (e) {
        return console.error(e), d(t, 500, "შეცდომა შეკვეთების ძებნისას", e);
      }
    },
    fe = async (e, t) => {
      const { id: r } = e.params;
      try {
        await (async (e, t, r) => {
          const a = await T.transaction();
          try {
            const e = await J.findByPk(r, { transaction: a });
            return e
              ? (await e.destroy({ transaction: a }),
                (await J.findByPk(r, { transaction: a }))
                  ? (await a.rollback(), d(t, 500, "შეკვეთის წაშლა ვერ მოხერხდა!"))
                  : (await a.commit(), d(t, 200, "შეკვეთა წარმატებით წაიშალა!")))
              : (await a.rollback(), d(t, 404, "შეკვეთა მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა!"));
          } catch (e) {
            throw (await a.rollback(), e);
          }
        })(0, t, Number(r)),
          await (async (e, t, r) => {
            const a = await T.transaction();
            try {
              const e = await Y.findOne({ where: { id: r }, transaction: a });
              return e
                ? (await e.destroy({ transaction: a }),
                  await Z.destroy({ where: { freezoneItemId: r }, transaction: a }),
                  await a.commit(),
                  { exists: !0, freezoneItem: e })
                : (await a.rollback(), { exists: !1, freezoneItem: e });
            } catch (e) {
              throw (await a.rollback(), e);
            }
          })(0, 0, Number(r));
      } catch (e) {
        return console.error("Error deleting an order:", e), d(t, 500, "შეცდომა შეკვეთის წაშლისას", e);
      }
    },
    he = async (e, t) => {
      const r = e.body,
        a = await T.transaction(),
        o = V.safeParse(r);
      if (!o.success) return d(t, 400, "Validation error", o.error.format());
      try {
        const e = await (async (e, t, r) => {
          const a = await T.transaction();
          try {
            const e = await J.findByPk(r.id, { transaction: a });
            if (!e) return await a.rollback(), { exists: !1, message: "Order not found" };
            const { products: t, ...o } = r,
              n = await e.update(o, { transaction: a });
            if (t && Array.isArray(t)) {
              const e = await X.findAll({ where: { orderId: n.id }, transaction: a }),
                r = e.map((e) => e.productId),
                o = t.map((e) => e.productId),
                s = t.filter((e) => !r.includes(e.productId)),
                i = t.filter((e) => r.includes(e.productId)),
                d = e.filter((e) => !o.includes(e.productId));
              await X.destroy({ where: { productId: d.map((e) => e.productId) }, transaction: a });
              const c = s.map((e) => ({ orderId: n.id, ...e }));
              await X.bulkCreate(c, { transaction: a });
              for (const t of i) {
                const r = e.find((e) => e.productId === t.productId);
                r && (await r.update(t, { transaction: a }));
              }
            }
            return await a.commit(), { exists: !0, order: n };
          } catch (e) {
            throw (await a.rollback(), console.error("Error updating order:", e), e);
          }
        })(0, 0, o.data);
        return e.exists
          ? (
              await (async (e, t, r) => {
                const a = await T.transaction();
                try {
                  const { products: e, id: t } = r,
                    o = await Z.findAll({ where: { freezoneItemId: t }, transaction: a }),
                    n = [],
                    s = [],
                    i = [];
                  for (const t of o) {
                    const r = e.find((e) => e.productId === t.productId);
                    r
                      ? (t.quantity !== r.quantity || t.weight !== r.weight || t.price !== r.price) &&
                        n.push({ ...t.get(), ...r })
                      : s.push(t);
                  }
                  for (const r of e)
                    o.find((e) => e.productId === r.productId) ||
                      i.push({ freezoneItemId: t, adjustedQuantity: 0, adjustedWeight: 0, ...r });
                  return (
                    await Promise.all(s.map((e) => e.destroy({ transaction: a }))),
                    await Z.bulkCreate(n, { updateOnDuplicate: ["price", "quantity", "weight"], transaction: a }),
                    i.length > 0 && (await Z.bulkCreate(i, { transaction: a })),
                    await a.commit(),
                    { success: !0 }
                  );
                } catch (e) {
                  throw (await a.rollback(), e);
                }
              })(0, 0, o.data)
            ).success
            ? (await a.commit(), d(t, 200, "შეკვეთა წარმატებით განახლდა"))
            : (await a.rollback(), d(t, 500, "შეცდომა შეკვეთის თავისუფალ ზონის განახლებისას"))
          : (await a.rollback(), d(t, 404, "შეკვეთა ვერ მოიძებნა", e.order));
      } catch (e) {
        return (
          await a.rollback(), console.error("Error updating an order:", e), d(t, 500, "შეცდომა შეკვეთის განახლებისას", e)
        );
      }
    },
    ge = async (e, t) => {
      const r = e.body,
        a = x.safeParse(r);
      if (!a.success) return d(t, 400, "Validation error", a.error.format());
      try {
        const e = await (async (e, t, r) => {
          const a = await T.transaction();
          try {
            const e = await z.findOne({ where: { productCode: r.productCode }, transaction: a });
            return e ? (await a.rollback(), { exists: !0, product: e }) : { exists: !1, product: await z.create(r) };
          } catch (e) {
            throw (console.error("Error creating product:", e), new Error("Failed to create product"));
          }
        })(0, 0, a.data);
        return e.exists
          ? d(t, 409, "პროდუქტი მსგავსი პროდუქტის კოდით არსებობს")
          : d(t, 201, "პროდუქტი წარმატებით დაემატა", e.product);
      } catch (e) {
        return console.error("Error adding a product:", e), d(t, 500, "შეცდომა პროდუქტის შექმნისას", e);
      }
    },
    Ie = async (e, t) => {
      try {
        const e = await (async () => {
          try {
            return await z.findAll();
          } catch (e) {
            throw e;
          }
        })();
        return e.length ? d(t, 200, "პროდუქტები წარმატებით მოიძებნა", e) : d(t, 200, "პროდუქტები ვერ მოიძებნა", []);
      } catch (e) {
        return console.error(e), d(t, 505, "შეცდომა პროდუქტების ძებნისას", e);
      }
    },
    be = async (e, t) => {
      const { id: r } = e.params;
      try {
        await (async (e, t, r) => {
          const a = await T.transaction();
          try {
            const e = await z.findByPk(r, { transaction: a });
            return e
              ? (await e.destroy({ transaction: a }),
                (await z.findByPk(r, { transaction: a }))
                  ? (await a.rollback(), d(t, 500, "პროდუქტის წაშლა ვერ მოხერხდა!"))
                  : (await a.commit(), d(t, 200, "პროდუქტი წარმატებით წაიშალა!")))
              : (await a.rollback(), d(t, 404, "პროდუქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა!"));
          } catch (e) {
            throw (await a.rollback(), e);
          }
        })(0, t, r);
      } catch (e) {
        return console.error(e), d(t, 505, "შეცდომა პროდუქტის წაშლისას", e);
      }
    },
    Ae = async (e, t) => {
      const r = e.body,
        a = S.safeParse(r);
      if (!a.success) return d(t, 400, "Validation error", a.error.format());
      try {
        const e = await (async (e, t, r) => {
          const a = await T.transaction();
          try {
            const e = await z.findByPk(r.id, { transaction: a });
            if (!e) return { exists: !1, product: e };
            const t = await e.update(r, { transaction: a });
            return await a.commit(), { exists: !0, product: t };
          } catch (e) {
            throw (await a.rollback(), e);
          }
        })(0, 0, a.data);
        return e.exists
          ? d(t, 200, "პროდუქტი წარმატებით განახლდა", e)
          : d(t, 404, "პროდუქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა", e.product);
      } catch (e) {
        return console.error(e), d(t, 505, "შეცდომა პროდუქტის რედაქტირებისას", e);
      }
    },
    Ee = async (e, t) => {
      const { id: r } = e.params;
      console.log(r);
      try {
        const e = await (async (e, t, r) => {
          try {
            return await z.findByPk(r);
          } catch (e) {
            throw e;
          }
        })(0, 0, r);
        return e ? d(t, 200, "პროდუქტი წარმატებით მოიძებნა", e) : d(t, 404, "პროდუქტი ვერ მოიძებნა", {});
      } catch (e) {
        return console.error(e), d(t, 505, "შეცდომა პროდუქტის ძებნისას", e);
      }
    },
    De = o().Router();
  De.route(g).post(async (e, t) => {
    await re(e, t);
  }),
    De.route(`${g}/:id`).get(async (e, t) => {
      await ae(0, t);
    }),
    De.route(g).get(async (e, t) => {
      await se(0, t);
    }),
    De.route(`${g}/:id`).patch(async (e, t) => {
      await oe(e, t);
    }),
    De.route(`${g}/:id`).delete(async (e, t) => {
      await ne(e, t);
    });
  const Te = De,
    ze = o().Router();
  ze.route(`${A}/:id`).get(async (e, t) => {
    await ie(e, t);
  }),
    ze.route(`${A}/:id`).patch(async (e, t) => {
      await ce(e, t);
    }),
    ze.route(A).get(async (e, t) => {
      await de(0, t);
    });
  const Ne = ze,
    Ce = o().Router();
  Ce.route(`${b}/:id`).get(async (e, t) => {
    await ue(e, t);
  }),
    Ce.route(b).get(async (e, t) => {
      await le(e, t);
    }),
    Ce.route(`${b}/:id`).patch(async (e, t) => {
      await pe(e, t);
    });
  const ke = Ce,
    Re = o().Router();
  Re.route(I).post(async (e, t) => {
    await ye(e, t);
  }),
    Re.route(`${I}/:id`).get(async (e, t) => {
      await me(e, t);
    }),
    Re.route(`${I}/:id`).delete(async (e, t) => {
      await fe(e, t);
    }),
    Re.route(I).get(async (e, t) => {
      await we(0, t);
    }),
    Re.route(`${I}/:id`).patch(async (e, t) => {
      await he(e, t);
    });
  const xe = Re,
    Se = o().Router();
  Se.route(h).post(async (e, t) => {
    await ge(e, t);
  }),
    Se.route(h).get(async (e, t) => {
      await Ie(0, t);
    }),
    Se.route(`${h}/:id`).delete(async (e, t) => {
      await be(e, t);
    }),
    Se.route(`${h}/:id`).patch(async (e, t) => {
      await Ae(e, t);
    }),
    Se.route(`${h}/:id`).get(async (e, t) => {
      await Ee(e, t);
    });
  const Oe = Se,
    Pe = i("PORT"),
    qe = i("NODE_ENV") || "development",
    ve = o()();
  ve.use(o().json()),
    ve.use(r()(u)),
    ve.use(s()()),
    ve.use(f, Oe),
    ve.use(f, Te),
    ve.use(f, xe),
    ve.use(f, ke),
    ve.use(f, Ne),
    ve.listen(Pe, async () => {
      console.log(`Server is running on PORT ${Pe} on a ${qe.toUpperCase()} environment`),
        await (async () => {
          try {
            await T.authenticate(),
              console.log("Database connected!"),
              await T.query("CREATE SCHEMA IF NOT EXISTS operations"),
              "development" === i("NODE_ENV") &&
                (await T.sync({ alter: "development" === i("NODE_ENV"), force: !1, match: /_dev$/ })),
              await T.sync(),
              console.log("Database synchronized!");
          } catch (e) {
            console.error("Unable to connect to the database:", e), process.exit(1);
          }
        })();
    });
})();
