(() => {
  "use strict";
  var e = {
    n: (t) => {
      var a = t && t.__esModule ? () => t.default : () => t;
      return e.d(a, { a }), a;
    },
    d: (t, a) => {
      for (var s in a) e.o(a, s) && !e.o(t, s) && Object.defineProperty(t, s, { enumerable: !0, get: a[s] });
    },
    o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
  };
  const t = require("compression");
  var a = e.n(t);
  const s = require("cookie-parser");
  var r = e.n(s);
  const o = require("cors");
  var n = e.n(o);
  const i = require("express");
  var d = e.n(i);
  const c = require("bcryptjs");
  var u = e.n(c);
  const l = async (e) => {
      try {
        const t = await u().genSalt(10);
        return u().hash(e, t);
      } catch (e) {
        throw new Error(`Failed to hash password: ${e}`);
      }
    },
    p = (e) => {
      const t = e.getRow(1),
        a = e.columnCount;
      for (let e = 1; e <= a; e++) {
        const a = t.getCell(e);
        (a.font = { bold: !0, size: 12, color: { argb: "FFFFFFFF" } }),
          (a.alignment = { horizontal: "center", vertical: "middle" }),
          (a.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F81BD" } }),
          (a.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          });
      }
      e.columns.forEach((e) => {
        if (!e.values || !e.header) return;
        const t = e.values.map((e) => (null == e ? 0 : e.toString().length)),
          a = Math.max(Math.max(...t.filter((e) => "number" == typeof e)) + 2, e.header.length + 12);
        e.width = a;
      }),
        (e.autoFilter = { from: { row: 1, column: 1 }, to: { row: e.rowCount, column: e.columnCount } });
    },
    m =
      (require("dotenv/config"),
      (e, t) => {
        const a = process.env[e] || t;
        if (!a) throw new Error(`Missing required environment variable: ${e}`);
        return a;
      }),
    y = require("jsonwebtoken");
  var w = e.n(y);
  const h = (e, t) => {
      const a = { id: e.id, email: e.email },
        s = m("JWT_SECRET");
      return w().sign(a, s, t);
    },
    g = (e, t) => {
      try {
        const a = m("JWT_SECRET");
        return w().verify(e, a, t);
      } catch (e) {
        const t = e instanceof Error ? e.message : "Unknown error";
        throw new Error(`Failed to verify token: ${t}`);
      }
    },
    D = (e) => {
      const t = (Array.isArray(e) ? e : [e]).map((e) => {
        const { products: t, ...a } = e.toJSON ? e.toJSON() : e;
        return {
          ...a,
          products: (t || []).map((e) => {
            const { orderDetails: t, ...a } = e;
            return { ...a, ...t };
          }),
        };
      });
      return Array.isArray(e) ? t : t[0];
    },
    E = [m("CLIENT_URL")],
    A = {
      origin: (e, t) => {
        -1 === E.indexOf(e) && e ? t(new Error("Not allowed by CORS")) : t(null, !0);
      },
      credentials: !0,
      optionsSuccessStatus: 200,
    },
    f = {
      development: {
        host: m("DB_HOST"),
        database: m("DB_NAME"),
        username: m("DB_USER"),
        password: m("DB_PASS"),
        port: Number(m("DB_PORT")),
        schema: m("DB_SCHEMA"),
        logging: !1,
        pool: { max: 10, min: 0, acquire: 6e4, idle: 1e4 },
      },
      production: {
        host: m("DB_HOST"),
        database: m("DB_NAME"),
        username: m("DB_USER"),
        password: m("DB_PASS"),
        port: Number(m("DB_PORT")),
        schema: m("DB_SCHEMA"),
        dialectOptions: { ssl: { require: !0, rejectUnauthorized: !1 } },
        logging: !1,
      },
    },
    b = { CASH: "CASH", CONSIGNMENT: "CONSIGNMENT", TRANSFER: "TRANSFER", TRIAL: "TRIAL", DISCOUNT: "DISCOUNT" },
    N = Object.values(b),
    T = ["TR1", "TR2", "TR3", "TR4", "TR5", "TRD", "TRC"],
    k = { ALL: "ALL", ORDER: "ORDER", CLEANZONE: "CLEANZONE", DISTRIBUTION: "DISTRIBUTION", DELIVERED: "DELIVERED" },
    R = Object.values(k),
    I = { INDIVIDUAL: "INDIVIDUAL", SOLE_SMALL: "SOLE_SMALL", SOLE_STANDARD: "SOLE_STANDARD", LLC: "LLC" },
    C = Object.values(I),
    z = {
      ACCEPTED: "ACCEPTED",
      PREPARING: "PREPARING",
      PREPARED: "PREPARED",
      DELIVERED: "DELIVERED",
      CANCELLED: "CANCELLED",
      RETURNED: "RETURNED",
    },
    S = { ACCEPTED: "ACCEPTED", PREPARING: "PREPARING", PREPARED: "PREPARED", CANCELLED: "CANCELLED" },
    x = { DELIVERED: "DELIVERED", CANCELLED: "CANCELLED", RETURNED: "RETURNED" },
    v = Object.values(z),
    P = (Object.values(S), Object.values(x), require("passport-jwt")),
    O = { jwtFromRequest: P.ExtractJwt.fromExtractors([(e) => e.cookies.accessToken]), secretOrKey: m("JWT_SECRET") },
    L = "/api",
    j = "/api/protected",
    V = { login: "/auth/login", register: "/auth/register", resetPassword: "/auth/reset-password", me: "/auth/me" },
    q = {
      product: "/products",
      customer: "/customers",
      order: "/orders",
      cleanzone: "/cleanzone",
      distribution: "/distribution",
      surplus: "/surplus",
      user: "/users",
    },
    U = {
      order: "/excel/orders",
      product: "/excel/products",
      distribution: "/excel/distribution",
      cleanzone: "/excel/cleanzone",
      customer: "/excel/customers",
    },
    M = 200,
    G = 201,
    _ = 204,
    F = 400,
    B = 401,
    W = 404,
    H = 409,
    $ = 422,
    K = 500,
    J = require("sequelize"),
    Q = m("NODE_ENV"),
    Z = f[Q],
    X = new J.Sequelize({ ...Z, dialect: "postgres" }),
    Y = async () => {
      try {
        await (async (e) => {
          let t = 0;
          for (; t < 5; )
            try {
              return await e.authenticate(), void console.log("Connection has been established successfully.");
            } catch (e) {
              if (4 === t) throw (console.error("Failed to connect after multiple attempts:", e), e);
              t++, console.log(`Retrying connection... Attempt ${t}`), await new Promise((e) => setTimeout(e, 2e3));
            }
        })(X),
          console.log("Successfully connected to the database!"),
          await X.query("CREATE SCHEMA IF NOT EXISTS operations"),
          await X.sync({ alter: !0, force: !1, match: "development" === Q ? /_dev$/ : void 0 }),
          await X.sync(),
          console.log("Database synchronized!");
      } catch (e) {
        console.error("Unable to connect to the database:", e), process.exit(1);
      }
    },
    ee = require("express-rate-limit");
  const te = e.n(ee)()({
      windowMs: 3e4,
      max: 100,
      message: "Too many requests from this IP, please try again after 30 seconds",
    }),
    ae = require("zod"),
    se = (e, t) => async (a, s, r) => {
      try {
        await e.parseAsync(a[t]), r();
      } catch (e) {
        if (e instanceof ae.z.ZodError) {
          const t = e.errors.map((e) => ({ message: `${e.path.join(".")} is ${e.message}` }));
          s.status(400).json({ error: "invalid data", details: t });
        } else r(e);
      }
    },
    re = (e) => se(e, "body"),
    oe = (e) => se(e, "params"),
    ne = X.define(
      "Customer",
      {
        id: { type: J.DataTypes.INTEGER, allowNull: !1, primaryKey: !0, autoIncrement: !0 },
        name: { type: J.DataTypes.STRING, allowNull: !1 },
        needsInvoice: { type: J.DataTypes.STRING, allowNull: !1, defaultValue: "0" },
        priceIndex: { type: J.DataTypes.ENUM(...T), allowNull: !1, defaultValue: T[0] },
        paymentMethod: { type: J.DataTypes.ENUM(...N), allowNull: !1, defaultValue: b.CASH },
        phone: { type: J.DataTypes.STRING, allowNull: !0 },
        email: { type: J.DataTypes.STRING, allowNull: !0 },
        type: { type: J.DataTypes.ENUM(...C), defaultValue: I.INDIVIDUAL },
        contactPerson: { type: J.DataTypes.JSON, allowNull: !0 },
        paysVAT: { type: J.DataTypes.STRING, allowNull: !1, defaultValue: "0" },
        identificationNumber: { type: J.DataTypes.STRING, allowNull: !1 },
        address: { type: J.DataTypes.STRING, allowNull: !0 },
      },
      {
        timestamps: !0,
        paranoid: !0,
        indexes: [
          { unique: !0, fields: ["id"] },
          { fields: ["email"] },
          { unique: !0, fields: ["identificationNumber"] },
          { unique: !0, fields: ["id", "identificationNumber"] },
          { fields: ["email", "identificationNumber"] },
        ],
      }
    ),
    ie = X.define(
      "CustomerProduct",
      {
        productId: { type: J.DataTypes.INTEGER, allowNull: !1, references: { model: "Products", key: "id" } },
        customerId: { type: J.DataTypes.INTEGER, allowNull: !1, references: { model: "Customers", key: "id" } },
      },
      { timestamps: !1, indexes: [{ unique: !0, fields: ["customerId", "productId"] }] }
    ),
    de = ae.z.object({ email: ae.z.string().email(), password: ae.z.string().min(6) }),
    ce = ae.z
      .object({
        firstName: ae.z.string().min(2),
        lastName: ae.z.string().min(2),
        email: ae.z.string().email(),
        password: ae.z.string().min(6),
        confirmPassword: ae.z.string().min(6),
      })
      .refine((e) => e.password === e.confirmPassword, { message: "პაროლები არ ემთხვევა" }),
    ue = "არასწორი ფორმატი",
    le = new RegExp("^[ა-ჰ\\s.,?!:;\"'()\\-+@#$%^&*<>[\\]{}|\\\\/]+$"),
    pe =
      (ae.z.object({ productId: ae.z.coerce.number().nonnegative(), customerId: ae.z.coerce.number().nonnegative() }),
      ae.z.object({
        name: ae.z.string().regex(le, { message: "მხოლოდ ქართული ასოები" }),
        position: ae.z.string(),
        phone: ae.z.string(),
        email: ae.z.string().email({ message: ue }),
      })),
    me = ae.z.object({
      id: ae.z.coerce.number().int().nonnegative(),
      priceIndex: ae.z.enum(T),
      paymentMethod: ae.z.enum(N),
      paysVAT: ae.z.enum(["0", "1"]),
      needsInvoice: ae.z.enum(["0", "1"], { message: "სავალდებულოა" }),
      type: ae.z.enum(C),
      name: ae.z.string().regex(le, { message: "მხოლოდ ქართული ასოები" }),
      identificationNumber: ae.z.coerce.number(),
      address: ae.z.string(),
      phone: ae.z.string(),
      email: ae.z.string().email({ message: ue }),
      products: ae.z.array(ae.z.object({ id: ae.z.number() })).optional(),
      contactPerson: pe,
    }),
    ye = ae.z.object({
      orderId: ae.z.number(),
      productId: ae.z.number(),
      price: ae.z.number().nonnegative(),
      quantity: ae.z.number().nonnegative(),
      preparedQuantity: ae.z.number().nonnegative().optional(),
      weight: ae.z.number().nonnegative(),
      preparedWeight: ae.z.number().nonnegative().optional(),
      distributedWeight: ae.z.number().nonnegative().optional(),
    }),
    we = ae.z.object({
      id: ae.z.coerce.number().nonnegative(),
      customerId: ae.z.number().nonnegative(),
      customer: me.optional(),
      status: ae.z.enum(v),
      stage: ae.z.enum(R),
      note: ae.z.string().optional().nullable(),
      updateCount: ae.z.number().int().nonnegative(),
      products: ae.z.array(ye.omit({ orderId: !0, productId: !0 }).extend({ id: ae.z.coerce.number().nonnegative() })),
      total: ae.z.coerce.number().nonnegative(),
      createdAt: ae.z.coerce.date().optional(),
      updatedAt: ae.z.coerce.date().optional(),
      deletedAt: ae.z.coerce.date().optional(),
      prepareDueAt: ae.z.coerce.date(),
      preparedAt: ae.z.coerce.date(),
      deliverDueAt: ae.z.coerce.date(),
      deliveredAt: ae.z.coerce.date(),
    }),
    he = "სავალდებულოა",
    ge = new RegExp("^[ა-ჰ\\-,\\s]+$"),
    De = ae.z.object(
      {
        TR1: ae.z.number({ required_error: he }).nonnegative({ message: "დადებითი რიცხვი" }),
        TR2: ae.z.number({ required_error: he }).nonnegative({ message: "დადებითი რიცხვი" }),
        TR3: ae.z.number({ required_error: he }).nonnegative({ message: "დადებითი რიცხვი" }),
        TR4: ae.z.number({ required_error: he }).nonnegative({ message: "დადებითი რიცხვი" }),
        TR5: ae.z.number({ required_error: he }).nonnegative({ message: "დადებითი რიცხვი" }),
        TRC: ae.z.number({ required_error: he }).nonnegative({ message: "დადებითი რიცხვი" }),
        TRD: ae.z.number({ required_error: he }).nonnegative({ message: "დადებითი რიცხვი" }),
      },
      { required_error: he }
    ),
    Ee = ae.z.object({
      id: ae.z.coerce.number().nonnegative(),
      title: ae.z.string({ required_error: he }).regex(ge, { message: "მხოლოდ ქართული, მძიმე ან/და ტირე" }),
      productCode: ae.z.string({ required_error: he }),
      hasVAT: ae.z.enum(["0", "1"], { required_error: he }),
      prices: De,
    }),
    Ae = ae.z.object({
      id: ae.z.coerce.number(),
      weight: ae.z.coerce.number(),
      quantity: ae.z.coerce.number(),
      identificator: ae.z.string(),
    }),
    fe = ae.z.object({
      orderId: ae.z.coerce.number(),
      products: ae.z.array(Ae),
      createdAt: ae.z.coerce.date(),
      expiresAt: ae.z.coerce.date().optional(),
    }),
    be = ae.z.object({
      id: ae.z.string(),
      firstName: ae.z.string(),
      lastName: ae.z.string(),
      email: ae.z.string().email(),
      password: ae.z.string().min(6),
    }),
    Ne =
      (we.omit({ products: !0 }),
      X.define(
        "Order",
        {
          id: { type: J.DataTypes.INTEGER, allowNull: !1, primaryKey: !0, autoIncrement: !0 },
          customerId: { type: J.DataTypes.INTEGER, allowNull: !1, references: { model: "Customers", key: "id" } },
          status: { type: J.DataTypes.ENUM(...v), allowNull: !1, defaultValue: z.ACCEPTED },
          stage: { type: J.DataTypes.ENUM(...R), defaultValue: k.ORDER, allowNull: !1 },
          note: { type: J.DataTypes.TEXT, allowNull: !0, defaultValue: null },
          updateCount: { type: J.DataTypes.INTEGER, allowNull: !1, defaultValue: 0 },
          total: { type: J.DataTypes.DECIMAL(10, 2), allowNull: !1, defaultValue: 0 },
          prepareDueAt: { type: J.DataTypes.DATE, allowNull: !1 },
          preparedAt: { type: J.DataTypes.DATE, allowNull: !0, defaultValue: null },
          deliverDueAt: { type: J.DataTypes.DATE, allowNull: !1 },
          deliveredAt: { type: J.DataTypes.DATE, allowNull: !0, defaultValue: null },
        },
        { timestamps: !0, paranoid: !0, indexes: [{ unique: !0, fields: ["id"] }] }
      )),
    Te = X.define(
      "OrderProduct",
      {
        orderId: { type: J.DataTypes.INTEGER, allowNull: !1, references: { model: "Orders", key: "id" } },
        productId: { type: J.DataTypes.INTEGER, allowNull: !1, references: { model: "Products", key: "id" }, unique: !0 },
        price: { type: J.DataTypes.FLOAT, allowNull: !1 },
        quantity: { type: J.DataTypes.INTEGER, allowNull: !1, defaultValue: 1 },
        preparedQuantity: { type: J.DataTypes.INTEGER, allowNull: !1, defaultValue: 1 },
        weight: { type: J.DataTypes.FLOAT, allowNull: !1, defaultValue: 0 },
        preparedWeight: { type: J.DataTypes.FLOAT, allowNull: !1, defaultValue: 0 },
        distributedWeight: { type: J.DataTypes.FLOAT, allowNull: !1, defaultValue: 0 },
      },
      { timestamps: !1, indexes: [{ fields: ["productId"] }, { fields: ["orderId", "productId"] }] }
    ),
    ke = X.define(
      "Product",
      {
        id: { type: J.DataTypes.INTEGER, allowNull: !1, primaryKey: !0, autoIncrement: !0 },
        title: { type: J.DataTypes.STRING, allowNull: !1 },
        productCode: { type: J.DataTypes.STRING, allowNull: !1 },
        hasVAT: { type: J.DataTypes.ENUM("0", "1"), allowNull: !1 },
        prices: { type: J.DataTypes.JSON, allowNull: !1 },
      },
      { timestamps: !1, indexes: [{ fields: ["id"] }, { fields: ["productCode"] }] }
    ),
    Re = require("date-fns"),
    Ie = X.define(
      "Surplus",
      {
        id: { type: J.DataTypes.INTEGER, allowNull: !1, primaryKey: !0, autoIncrement: !0 },
        orderId: { type: J.DataTypes.INTEGER, allowNull: !1, references: { model: "Orders", key: "id" } },
        createdAt: { type: J.DataTypes.DATE, allowNull: !1, defaultValue: new Date() },
        expiresAt: { type: J.DataTypes.DATE, allowNull: !0 },
        condition: {
          type: J.DataTypes.VIRTUAL,
          allowNull: !0,
          get() {
            const e = Math.abs(
              (0, Re.differenceInHours)(
                new Date(this.expiresAt || (0, Re.addDays)(new Date(this.createdAt), 3)),
                new Date()
              )
            );
            return e <= 72 && e >= 48 ? "FRESH" : e < 48 && e >= 24 ? "MEDIUM" : e < 24 && e >= 0 ? "OLD" : "EXPIRED";
          },
        },
      },
      { timestamps: !0, indexes: [{ fields: ["orderId"] }, { fields: ["expiresAt"] }] }
    );
  Ie.addHook("beforeSave", (e) => {
    const t = Math.abs(
      (0, Re.differenceInHours)(
        new Date(e.dataValues.expiresAt || (0, Re.addDays)(new Date(e.dataValues.createdAt), 3)),
        new Date()
      )
    );
    e.dataValues.condition =
      t <= 72 && t >= 48 ? "FRESH" : t < 48 && t >= 24 ? "MEDIUM" : t < 24 && t >= 0 ? "OLD" : "EXPIRED";
  });
  const Ce = X.define(
      "SurplusProduct",
      {
        surplusId: { type: J.DataTypes.INTEGER, allowNull: !1, references: { model: "Surpluses", key: "id" } },
        productId: { type: J.DataTypes.INTEGER, allowNull: !1, references: { model: "Products", key: "id" }, unique: !0 },
        quantity: { type: J.DataTypes.INTEGER, allowNull: !1 },
        weight: { type: J.DataTypes.FLOAT, allowNull: !1 },
        identificator: { type: J.DataTypes.STRING, allowNull: !1 },
      },
      { timestamps: !1, indexes: [{ fields: ["productId"] }, { fields: ["surplusId", "productId"] }] }
    ),
    ze = X.define(
      "User",
      {
        id: { type: J.DataTypes.UUID, defaultValue: J.DataTypes.UUIDV4, primaryKey: !0 },
        firstName: { type: J.DataTypes.STRING, allowNull: !1 },
        lastName: { type: J.DataTypes.STRING, allowNull: !1 },
        email: { type: J.DataTypes.STRING, allowNull: !1, unique: !0 },
        password: { type: J.DataTypes.STRING, allowNull: !1 },
        fullName: {
          type: J.DataTypes.VIRTUAL,
          allowNull: !0,
          get() {
            return `${this.getDataValue("firstName")} ${this.getDataValue("lastName")}`;
          },
        },
      },
      { timestamps: !1, indexes: [] }
    );
  Ne.beforeUpdate(async (e, { transaction: t }) => {
    const { status: a, stage: s, preparedAt: r, deliveredAt: o } = e;
    try {
      if (a === z.CANCELLED || a === z.RETURNED) return void (e.stage = s);
      a === S.PREPARING && s !== k.CLEANZONE && ((e.stage = k.CLEANZONE), (e.updateCount += 1)),
        a === S.PREPARED && s !== k.DISTRIBUTION && ((e.stage = k.DISTRIBUTION), (e.updateCount += 1)),
        a === x.DELIVERED && s !== k.DELIVERED && (e.stage = k.DELIVERED),
        a !== S.PREPARED || r || (e.preparedAt = new Date()),
        a !== x.DELIVERED || o || (e.deliveredAt = new Date());
    } catch (e) {
      throw (t && (await t.rollback()), console.error("Error updating order stage", e), e);
    }
  }),
    Ie.beforeCreate((e) => {
      const { expiresAt: t, createdAt: a } = e;
      t || (e.expiresAt = new Date(a.getTime() + 2592e5));
    });
  const Se = [
    ((xe = []), { model: ne, as: "customer", attributes: { include: xe } }),
    ((e) => ({
      model: ke,
      as: "products",
      attributes: { exclude: ["prices"] },
      through: { as: "orderDetails", attributes: { exclude: ["orderId", "productId", ...e] } },
    }))([]),
    ((e) => ({ model: Ie, as: "surplus", attributes: { include: e } }))([]),
  ];
  var xe;
  Ne.addScope("defaultScope", { include: Se }), Ne.addScope("byStage", (e) => ({ where: { stage: e }, include: Se }));
  ne.belongsToMany(ke, { through: ie, foreignKey: "customerId", as: "products", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    ke.belongsToMany(ne, {
      through: ie,
      foreignKey: "productId",
      as: "customers",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }),
    ke.belongsToMany(Ie, {
      through: Ce,
      foreignKey: "productId",
      as: "surpluses",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }),
    Ie.belongsToMany(ke, {
      through: Ce,
      foreignKey: "surplusId",
      as: "products",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }),
    ne.hasMany(Ne, { foreignKey: "customerId", as: "orders", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    Ne.belongsTo(ne, { foreignKey: "customerId", as: "customer", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    Ne.belongsToMany(ke, { through: Te, foreignKey: "orderId", as: "products", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    ke.belongsToMany(Ne, { through: Te, foreignKey: "productId", as: "orders", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    Ne.hasOne(Ie, { foreignKey: "orderId", as: "surplus", onDelete: "CASCADE", onUpdate: "CASCADE" }),
    Ie.belongsTo(Ne, { foreignKey: "orderId", as: "order", onDelete: "CASCADE", onUpdate: "CASCADE" });
  const ve = require("passport");
  const Pe = e
      .n(ve)()
      .use(
        new P.Strategy(O, async (e, t) => {
          try {
            const a = await ze.findByPk(e.id);
            return a ? t(null, a) : t(null, !1, { message: "მომხმარებელი ვერ მოიძებნა" });
          } catch (e) {
            return t(e);
          }
        })
      ),
    Oe = require("express-async-handler");
  var Le = e.n(Oe);
  const je = async (e, t) => {
      const a = await X.transaction();
      try {
        const s = await ze.findOne({ where: { email: t.email }, transaction: a });
        if (!s) return await a.rollback(), { status: W, message: "მომხმარებელი ვერ მოიძებნა", data: {} };
        const { password: r, ...o } = s.toJSON(),
          n = await (async (e, t) => {
            try {
              return await u().compare(e, t);
            } catch (e) {
              throw new Error(`Failed to compare password: ${e}`);
            }
          })(t.password, r);
        if (!n) return await a.rollback(), { status: B, message: "არასწორი პაროლი", data: {} };
        const i = h({ id: s.id, email: s.email }, { expiresIn: "7d" }),
          d = h({ id: s.id, email: s.email }, { expiresIn: "7d" });
        return (
          e.cookie("accessToken", i, { httpOnly: !0, secure: !0, sameSite: "none", maxAge: 6048e5 }),
          e.cookie("refreshToken", d, { httpOnly: !0, secure: !0, sameSite: "none", maxAge: 6048e5 }),
          await a.commit(),
          { status: M, message: "წარმატებული ავტორიზაცია", data: o }
        );
      } catch (e) {
        throw (await a.rollback(), e);
      }
    },
    Ve = async (e) => {
      const t = await X.transaction();
      try {
        const a = await ze.findOne({ where: { email: e.email }, transaction: t });
        if (a) return await t.rollback(), { status: H, message: "მომხმარებელი მსგავსი ელფოსტით უკვე არსებობს", data: a };
        const s = await l(e.password);
        if (!s) return await t.rollback(), { status: K, message: "შეცდომა პაროლის დაშიფრვისას", data: {} };
        const r = await ze.create({ ...e, password: s }, { transaction: t }),
          { password: o, ...n } = r.toJSON();
        return await t.commit(), { status: G, message: "მომხმარებელი წარმატებით შეიქმნა", data: n };
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    qe = async (e) => {
      const t = await X.transaction();
      try {
        const a = await ze.findByPk(e, { transaction: t });
        return a
          ? (await t.commit(), { status: M, message: "მომხმარებელი მოიძებნა", data: a })
          : (await t.rollback(), { status: W, message: "მომხმარებელი ვერ მოიძებნა", data: {} });
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    Ue = async (e) => {
      const t = await X.transaction();
      try {
        const a = await ne.findOne({
          where: { email: e.email, identificationNumber: e.identificationNumber },
          transaction: t,
        });
        if (a)
          return {
            status: H,
            message: "სარეალიზაციო პუნქტი მსგავსი საიდენტიფიკაციო კოდით ან ელ.ფოსტით უკვე არსებოს",
            data: a,
          };
        const s = await ne.create(e, { transaction: t });
        if (!Array.isArray(e.products) || !e.products.length)
          return await t.commit(), { status: M, message: "სარეალიზაცო პუნქტი წარმატებით დაემატა", data: s };
        const r = e.products.map((e) => e.id),
          o = await ke.findAll({ where: { id: r }, transaction: t });
        return o.length !== r.length
          ? (await t.rollback(), { status: M, message: "პროდუქტები ვერ მოიძებნა", data: [] })
          : (await s.addProducts(o, { transaction: t }),
            await t.commit(),
            { status: M, message: "სარეალიზაცო პუნქტი წარმატებით დაემატა", data: s });
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    Me = async (e) => {
      const t = await X.transaction();
      try {
        const a = await ne.findByPk(e, {
          include: [{ model: ke, as: "products", through: { attributes: [] } }],
          transaction: t,
        });
        return a
          ? (await t.commit(), { status: M, message: "სარეალიზაციო პუნქტი მოიძებნა", data: a })
          : (await t.rollback(), { status: M, message: "სარეალიზაციო პუნქტი ვერ მოიძებნა", data: {} });
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    Ge = async () => {
      const e = await X.transaction();
      try {
        const t = await ne.findAll({
          include: [{ model: ke, as: "products", through: { attributes: [] } }],
          transaction: e,
        });
        return t.length
          ? (await e.commit(), { status: M, message: "სარეალიზაციო პუნქტები მოიძებნა", data: t })
          : (await e.rollback(), { status: M, message: "სარეალიზაციო პუნქტები ვერ მოიძებნა", data: [] });
      } catch (t) {
        throw (await e.rollback(), t);
      }
    },
    _e = async (e) => {
      const t = await X.transaction();
      try {
        const a = await ne.findByPk(e, { transaction: t });
        return a
          ? (await a.destroy({ transaction: t }),
            await t.commit(),
            { status: M, message: "სარეალიზაციო პუნქტი წარმატებით წაიშალა", data: a })
          : (await t.rollback(),
            { status: M, message: "სარეალიზაციო პუნქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა", data: {} });
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    Fe = async (e, t) => {
      const a = await X.transaction();
      try {
        const s = await ne.findByPk(e, { transaction: a });
        if (!s) return await a.rollback(), { status: M, message: "სარეალიზაციო პუნქტი ვერ მოიძებნა", data: {} };
        const r = await s.update(t, { transaction: a });
        if (!Array.isArray(t.products) || !t.products.length)
          return (
            await r.setProducts([], { transaction: a }),
            await a.commit(),
            { status: M, message: "სარეალიზაცო პუნქტი წარმატებით განახლდა", data: r }
          );
        const o = t.products.map((e) => e.id),
          n = await ke.findAll({ where: { id: o }, transaction: a });
        return n.length !== o.length
          ? (await a.rollback(), { status: M, message: "პროდუქტები ვერ მოიძებნა", data: [] })
          : (await r.setProducts(n, { transaction: a }),
            await a.commit(),
            { status: M, message: "სარეალიზაცო პუნქტი წარმატებით განახლდა", data: r });
      } catch (e) {
        throw (await a.rollback(), e);
      }
    },
    Be = require("exceljs");
  var We = e.n(Be);
  const He = async (e) => {
      const t = await X.transaction();
      try {
        const a = await ke.findAll({ transaction: t });
        if (!a.length) return await t.rollback(), e.status(_).send();
        const s = new (We().Workbook)(),
          r = s.addWorksheet("პროდუქტები");
        (r.columns = [
          { header: "id", key: "id" },
          { header: "SKU", key: "productCode" },
          { header: "პროდუქციის ტიპი", key: "title" },
          { header: "hasVAT", key: "vat" },
          { header: "TR1", key: "tr1" },
          { header: "TR2", key: "tr2" },
          { header: "TR3", key: "tr3" },
          { header: "TR4", key: "tr4" },
          { header: "TR5", key: "tr5" },
          { header: "TRC", key: "trc" },
          { header: "TRD", key: "trd" },
        ]),
          p(r),
          a.forEach((e) => {
            r.addRow({
              id: e.id,
              productCode: e.productCode,
              title: e.title,
              vat: "1" === e.hasVAT ? "კი" : "არა",
              tr1: e.prices.TR1,
              tr2: e.prices.TR2,
              tr3: e.prices.TR3,
              tr4: e.prices.TR4,
              tr5: e.prices.TR5,
              trc: e.prices.TRC,
              trd: e.prices.TRD,
            });
          });
        const o = "products.xlsx";
        return (
          e.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
          e.setHeader("Content-Disposition", `attachment; filename=${o}`),
          await s.xlsx.write(e),
          await t.commit(),
          e.status(M).end()
        );
      } catch (e) {
        await t.rollback(), console.error("Error exporting orders to excel:", e);
      }
    },
    $e = async (e) => {
      const t = await X.transaction();
      try {
        const a = await ne.findAll();
        if (!a.length) return await t.rollback(), e.status(_).send();
        const s = new (We().Workbook)(),
          r = s.addWorksheet("სარეალიზაციო პუნქტები");
        (r.columns = [
          { header: "id", key: "id" },
          { header: "ტიპი", key: "type" },
          { header: "დღგ-ს გადამხდელი", key: "paysVAT" },
          { header: "სახელი", key: "name" },
          { header: "პირადი ნომერი / საინდ. კოდი", key: "indetificationNumber" },
          { header: "მისამართი", key: "address" },
          { header: "ტელეფონი", key: "phone" },
          { header: "ელ.ფოსტა", key: "email" },
          { header: "საფასო ინდექსი", key: "priceIndex" },
          { header: "ზედნადები", key: "needInvoice" },
          { header: "გადახდის მეთოდი", key: "paymentOption" },
          { header: "საკონტაქტო პირი", key: "contactPersonName" },
          { header: "საკონტაქტო პირის პოზიცია", key: "contactPersonPosition" },
          { header: "საკონტაქტო პირის ნომერი", key: "contactPersonPhone" },
          { header: "საკონტაქტო პირის ელ.ფოსტა", key: "contactPersonEmail" },
        ]),
          p(r),
          a.forEach((e) => {
            r.addRow({
              id: e.id,
              type: e.type,
              paysVAT: "1" === e.paysVAT ? "კი" : "არა",
              name: e.name,
              indetificationNumber: e.identificationNumber,
              address: e.address,
              phone: e.phone,
              email: e.email,
              priceIndex: e.priceIndex,
              needInvoice: "1" === e.needsInvoice ? "კი" : "არა",
              paymentMethod: e.paymentMethod,
              contactPersonName: e.contactPerson?.name,
              contactPersonPosition: e.contactPerson?.position,
              contactPersonPhone: e.contactPerson?.phone,
              contactPersonEmail: e.contactPerson?.email,
            });
          });
        const o = "customers.xlsx";
        return (
          e.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
          e.setHeader("Content-Disposition", `attachment; filename=${o}`),
          await s.xlsx.write(e),
          await t.commit(),
          e.status(M).end()
        );
      } catch (e) {
        await t.rollback(), console.error("Error exporting customers to excel:", e);
      }
    },
    Ke = async (e) => {
      const t = await X.transaction();
      try {
        const a = await Ne.findAll({ transaction: t });
        if (!a.length) return await t.rollback(), e.status(_).send();
        const s = new (We().Workbook)(),
          r = s.addWorksheet("შეკვეთები");
        (r.columns = [
          { header: "id", key: "id", width: 10 },
          { header: "შექმნის თარიღი", key: "createdAt", width: 15 },
          { header: "მომზადების თარიღი", key: "prepareDueAt", width: 15 },
          { header: "მიტანის თარიღი", key: "deliverDueAt", width: 15 },
          { header: "სარეალიზაციო პუნქტი", key: "customer" },
          { header: "პროდუქციის ტიპი", key: "product", width: 30 },
          { header: "რაოდენობა", key: "quantity", width: 10 },
          { header: "წონა", key: "weight", width: 10 },
          { header: "ფასი", key: "price", width: 10 },
          { header: "ანგარიშსწორების ტიპი", key: "paymentMethod", width: 15 },
          { header: "სტატუსი", key: "status", width: 15 },
        ]),
          p(r);
        const o = D(a);
        if (!Array.isArray(o)) return;
        o.forEach((e) => {
          e.products?.forEach((t) => {
            r.addRow({
              id: e.id,
              createdAt: e.createdAt,
              prepareDueAt: e.prepareDueAt,
              deliverDueAt: e.deliverDueAt,
              customer: e.customer?.name || "N/A",
              product: t.title || "N/A",
              quantity: t.quantity || "N/A",
              weight: t.weight || "N/A",
              price: t.price || "N/A",
              paymentMethod: e.customer?.paymentMethod || "N/A",
              status: e.status || "N/A",
            });
          });
        });
        const n = "orders.xlsx";
        return (
          e.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
          e.setHeader("Content-Disposition", `attachment; filename=${n}`),
          await s.xlsx.write(e),
          await t.commit(),
          e.status(M).end()
        );
      } catch (e) {
        await t.rollback(), console.error("Error exporting orders to excel:", e);
      }
    },
    Je = async (e) => {
      const t = await X.transaction();
      try {
        const a = await Ne.findAll({ transaction: t });
        if (!a.length) return await t.rollback(), e.status(_).send();
        const s = new (We().Workbook)(),
          r = s.addWorksheet("შეკვეთები");
        (r.columns = [
          { header: "id", key: "id", width: 10 },
          { header: "შექმნის თარიღი", key: "createdAt", width: 15 },
          { header: "მომზადების თარიღი", key: "prepareDueAt", width: 15 },
          { header: "მიტანის თარიღი", key: "deliverDueAt", width: 15 },
          { header: "სარეალიზაციო პუნქტი", key: "customer" },
          { header: "პროდუქციის ტიპი", key: "product", width: 30 },
          { header: "ფასი", key: "price", width: 10 },
          { header: "გამზადებული რაოდენობა", key: "preparedQuantity", width: 10 },
          { header: "გამზადებული წონა", key: "preparedWeight", width: 10 },
          { header: "ანგარიშსწორების ტიპი", key: "paymentMethod", width: 15 },
          { header: "სტატუსი", key: "status", width: 15 },
        ]),
          p(r);
        const o = D(a);
        if (!Array.isArray(o)) return;
        o.forEach((e) => {
          e.products?.forEach((t) => {
            r.addRow({
              id: e.id,
              createdAt: e.createdAt,
              prepareDueAt: e.prepareDueAt,
              deliverDueAt: e.deliverDueAt,
              customer: e.customer?.name || "N/A",
              product: t.title || "N/A",
              preparedQuantity: t.preparedQuantity || "N/A",
              preparedWeight: t.preparedWeight || "N/A",
              price: t.price || "N/A",
              paymentMethod: e.customer?.paymentMethod || "N/A",
              status: e.status || "N/A",
            });
          });
        });
        const n = "cleanzone.xlsx";
        return (
          e.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
          e.setHeader("Content-Disposition", `attachment; filename=${n}`),
          await s.xlsx.write(e),
          await t.commit(),
          e.status(M).end()
        );
      } catch (e) {
        await t.rollback(), console.error("Error exporting orders to excel:", e);
      }
    },
    Qe = async (e) => {
      const t = await X.transaction();
      try {
        const a = await Ne.findAll({
          where: { [J.Op.or]: [{ stage: k.DISTRIBUTION }, { stage: k.DELIVERED }] },
          transaction: t,
        });
        if (!a.length) return await t.rollback(), e.status(_).send();
        const s = new (We().Workbook)(),
          r = s.addWorksheet("შეკვეთები");
        (r.columns = [
          { header: "id", key: "id", width: 10 },
          { header: "შექმნის თარიღი", key: "createdAt", width: 15 },
          { header: "მომზადების თარიღი", key: "prepareDueAt", width: 15 },
          { header: "მიტანის თარიღი", key: "deliverDueAt", width: 15 },
          { header: "სარეალიზაციო პუნქტი", key: "customer" },
          { header: "პროდუქციის ტიპი", key: "product", width: 30 },
          { header: "ფასი", key: "price", width: 10 },
          { header: "გამზადებული წონა", key: "preparedWeight", width: 10 },
          { header: "მიტანილი წონა", key: "distributedWright", width: 10 },
          { header: "ჯამი", key: "total", width: 10 },
          { header: "ანგარიშსწორების ტიპი", key: "paymentMethod", width: 15 },
          { header: "სტატუსი", key: "status", width: 15 },
        ]),
          p(r);
        const o = D(a);
        if (!Array.isArray(o)) return;
        o.forEach((e) => {
          e.products?.forEach((t) => {
            r.addRow({
              id: e.id,
              createdAt: e.createdAt,
              prepareDueAt: e.prepareDueAt,
              deliverDueAt: e.deliverDueAt,
              customer: e.customer?.name || "N/A",
              product: t.title || "N/A",
              preparedWeight: t.preparedWeight || "N/A",
              distributedWeight: t.distributedWeight || "N/A",
              total: e.total || "N/A",
              price: t.price || "N/A",
              paymentMethod: e.customer?.paymentMethod || "N/A",
              status: e.status || "N/A",
            });
          });
        });
        const n = "distribution.xlsx";
        return (
          e.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
          e.setHeader("Content-Disposition", `attachment; filename=${n}`),
          await s.xlsx.write(e),
          await t.commit(),
          e.status(M).end()
        );
      } catch (e) {
        await t.rollback(), console.error("Error exporting orders to excel:", e);
      }
    },
    Ze = async (e) => {
      const t = await X.transaction();
      try {
        if (!Array.isArray(e.products) || !e.products.length)
          return { status: $, message: "პროდუქტები სავალდებულოა", data: null };
        const a = await Ne.create(e, { transaction: t }),
          s = e.products.map((e) => e.id);
        if ((await ke.findAll({ where: { id: s }, transaction: t })).length !== s.length)
          return await t.rollback(), { status: $, message: "პროდუქტები ვერ მოიძებნა", data: null };
        const r = e.products.map((e) => {
          const { id: t, ...s } = e;
          return { orderId: a.id, productId: t, ...s };
        });
        return (await Te.bulkCreate(r, { transaction: t })).length
          ? (await t.commit(), { status: G, message: "შეკვეთა შექმნილია", data: a })
          : (await t.rollback(), { status: $, message: "პროდუქტები ვერ დაემატა", data: null });
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    Xe = async (e) => {
      const t = await X.transaction();
      try {
        const a = await Ne.findByPk(e, { transaction: t });
        if (!a) return await t.rollback(), { status: M, message: "შეკვეთა ვერ მოიძებნა", data: {} };
        const s = D(a);
        return await t.commit(), { status: M, message: "შეკვეთა მოიძებნა", data: s };
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    Ye = async () => {
      const e = await X.transaction();
      try {
        const t = await Ne.findAll({ transaction: e });
        if (!t.length) return await e.rollback(), { status: M, message: "შეკვეთები ვერ მოიძებნა", data: [] };
        const a = D(t);
        return await e.commit(), { status: M, message: "შეკვეთები მოიძებნა", data: a };
      } catch (t) {
        throw (await e.rollback(), t);
      }
    },
    et = async (e) => {
      const t = await X.transaction();
      try {
        const a = await Ne.findByPk(e, { transaction: t });
        return a
          ? (await a.destroy({ transaction: t }), await t.commit(), { status: M, message: "შეკვეთა წაიშალა", data: null })
          : (await t.rollback(), { status: M, message: "შეკვეთა ვერ მოიძებნა", data: {} });
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    tt = async (e, t) => {
      const a = await X.transaction();
      try {
        const s = await Ne.findByPk(e, { transaction: a });
        if (!s) return await a.rollback(), { status: M, message: "შეკვეთა ვერ მოიძებნა", data: {} };
        const r = t.products.reduce(
            (e, a) =>
              e +
              a.price *
                ((t.stage === k.ORDER ? a.weight : t.stage === k.CLEANZONE ? a.preparedWeight : a.distributedWeight) ?? 0),
            0
          ),
          o = await s.update({ ...t, total: r }, { transaction: a });
        if (!Array.isArray(t.products) || !t.products.length)
          return await a.commit(), { status: M, message: "შეკვეთა განახლდა", data: o };
        const n = t.products.map((e) => e.id),
          i = t.products.map((e) => {
            const { id: t, ...a } = e;
            return { orderId: o.id, productId: t, ...a };
          });
        await Te.destroy({ where: { orderId: o.id, productId: { [J.Op.notIn]: n } }, transaction: a });
        const d = await Te.bulkCreate(i, {
          updateOnDuplicate: ["price", "quantity", "weight", "preparedQuantity", "preparedWeight", "distributedWeight"],
          transaction: a,
        });
        return d.length
          ? (await a.commit(), { status: M, message: "შეკვეთა განახლდა", data: { ...o.toJSON(), products: d } })
          : (await a.rollback(), { status: $, message: "პროდუქტები ვერ განახლდა", data: null });
      } catch (e) {
        throw (await a.rollback(), e);
      }
    },
    at = async (e) => {
      const t = await X.transaction();
      try {
        const a = await ke.findOne({ where: { productCode: e.productCode }, transaction: t });
        if (a) return await t.rollback(), { status: H, message: "პროდუქტი მსგავსი პროდუქტის კოდით უკვე არსებობს", data: a };
        const s = await ke.create(e, { transaction: t });
        return await t.commit(), { status: G, message: "პროდუქტი წარმატებით დაემატა", data: s };
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    st = async (e) => {
      const t = await X.transaction();
      try {
        const a = await ke.findByPk(e, { transaction: t });
        return a
          ? (await t.commit(), { status: M, message: "პროდუქტი წარმატებით მოიძებნა", data: a })
          : (await t.rollback(), { status: M, message: "პროდუქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა", data: null });
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    rt = async () => {
      const e = await X.transaction();
      try {
        const t = await ke.findAll({ transaction: e });
        return t.length
          ? (await e.commit(), { status: M, message: "პროდუქტები წარმატებით მოიძებნა", data: t })
          : { status: M, message: "პროდუქტები ვერ მოიძებნა", data: [] };
      } catch (t) {
        throw (await e.rollback(), t);
      }
    },
    ot = async (e) => {
      const t = await X.transaction();
      try {
        const a = await ke.findByPk(e, { transaction: t });
        return a
          ? (await a.destroy({ transaction: t }), await t.commit(), { status: M, message: "პროდუქტი წაიშალა", data: a })
          : (await t.rollback(), { status: M, message: "პროდუქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა", data: null });
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    nt = async (e, t) => {
      const a = await X.transaction();
      try {
        const s = await ke.findByPk(e, { transaction: a });
        if (!s)
          return (
            await a.rollback(), { status: M, message: "პროდუქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა", data: null }
          );
        const r = await s.update(t, { transaction: a });
        return await a.commit(), { status: M, message: "პროდუქტი წარმატებით განახლდა", data: r };
      } catch (e) {
        throw (await a.rollback(), e);
      }
    },
    it = async (e) => {
      const t = await X.transaction(),
        { products: a, ...s } = e;
      try {
        const r = await Ie.findByPk(s.orderId, { transaction: t });
        if (r) return await t.rollback(), { status: F, message: "ნაშთი ამ შეკვეთისთვის უკვე არსებობს", data: r };
        const o = await Ie.create(e, { transaction: t }),
          n = a.map((e) => ({
            surplusId: o.id,
            productId: e.id,
            weight: e.weight,
            quantity: e.quantity,
            identificator: e.identificator,
          }));
        return (
          await Ce.bulkCreate(n, { transaction: t }),
          await t.commit(),
          { status: G, message: "ნაშთი წარმატებით დაემატა", data: { surplus: o, products: n } }
        );
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    dt = async () => {
      const e = await X.transaction();
      try {
        const t = await Ie.findAll({
          include: [
            {
              model: ke,
              as: "products",
              attributes: { exclude: ["prices", "hasVAT"] },
              through: { as: "details", attributes: { exclude: ["surplusId", "productId"] } },
            },
          ],
          transaction: e,
        }).catch((e) => console.log(e));
        if (!t) return { status: M, message: "ნაშთები ვერ მოიძებნა", data: null };
        const a = t.reduce(
          (e, t) => {
            const { condition: a, ...s } = t.toJSON();
            if (a) {
              const t = a.toLowerCase();
              e[t] && (e[t] = [...e[t], { ...s }]);
            }
            return e;
          },
          { fresh: [], medium: [], old: [], expired: [] }
        );
        return await e.commit(), { status: M, message: "ნაშთები წარმატებით მოიძებნა", data: a };
      } catch (t) {
        throw (await e.rollback(), t);
      }
    },
    ct = async (e) => {
      const t = await X.transaction();
      console.log(e);
      try {
        const a = await ze.findOne({ where: { email: e.email }, transaction: t });
        if (a) return await t.rollback(), { status: H, message: "მომხმარებელი მსგავსი ელფოსტით უკვე არსებოს", data: a };
        const s = await l(e.password),
          r = await ze.create({ ...e, password: s }, { transaction: t }),
          { password: o, ...n } = r.get();
        return await t.commit(), { status: G, message: "მომხმარებელი წარმატებით დაემატა", data: n };
      } catch (e) {
        throw (await t.rollback(), e);
      }
    },
    ut = async (e, t) => {
      const a = e.body,
        s = await je(t, a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    lt = async (e, t) => {
      const a = e.body,
        s = await Ve(a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    pt = async (e, t) => {
      const a = e.cookies.accessToken;
      if (!a) return;
      const s = g(a);
      if (s) {
        const { id: e } = s,
          a = await qe(e);
        t.status(a.status).json({ message: a.message, data: a.data });
      } else t.status(401).json({ message: "Unauthorized", data: null });
    },
    mt = async (e, t) => {
      const a = e.body,
        s = await Ue(a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    yt = async (e, t) => {
      const a = Number(e.params.id),
        s = await Me(a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    wt = async (e, t) => {
      const a = await Ge();
      t.status(a.status).json({ message: a.message, data: a.data });
    },
    ht = async (e, t) => {
      const a = Number(e.params.id),
        s = await _e(a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    gt = async (e, t) => {
      const a = Number(e.params.id),
        s = e.body,
        r = await Fe(a, s);
      t.status(r.status).json({ message: r.message, data: r.data });
    },
    Dt = async (e, t) => {
      await He(t);
    },
    Et = async (e, t) => {
      await $e(t);
    },
    At = async (e, t) => {
      await Ke(t);
    },
    ft = async (e, t) => {
      await Je(t);
    },
    bt = async (e, t) => {
      await Qe(t);
    },
    Nt = async (e, t) => {
      const a = e.body,
        s = await Ze(a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    Tt = async (e, t) => {
      const a = Number(e.params.id),
        s = await Xe(a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    kt = async (e, t) => {
      const a = await Ye();
      t.status(a.status).json({ message: a.message, data: a.data });
    },
    Rt = async (e, t) => {
      const a = Number(e.params.id),
        s = await et(a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    It = async (e, t) => {
      const a = Number(e.params.id),
        s = e.body,
        r = await tt(a, s);
      t.status(r.status).json({ message: r.message, data: r.data });
    },
    Ct = async (e, t) => {
      const a = e.body,
        s = await at(a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    zt = async (e, t) => {
      const a = Number(e.params.id),
        s = await st(a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    St = async (e, t) => {
      const a = await rt();
      t.status(a.status).json({ message: a.message, data: a.data });
    },
    xt = async (e, t) => {
      const a = Number(e.params.id),
        s = await ot(a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    vt = async (e, t) => {
      const a = Number(e.params.id),
        s = e.body,
        r = await nt(a, s);
      t.status(r.status).json({ message: r.message, data: r.data });
    },
    Pt = async (e, t) => {
      const a = e.body,
        s = await it(a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    Ot = async (e, t) => {
      const a = await dt();
      t.status(a.status).json({ message: a.message, data: a.data });
    },
    Lt = async (e, t) => {
      const { data: a } = e.body,
        s = await ct(a);
      t.status(s.status).json({ message: s.message, data: s.data });
    },
    jt = d().Router();
  jt.route(V.register).post(re(ce), Le()(lt)), jt.route(V.login).post(re(de), Le()(ut)), jt.route(V.me).get(Le()(pt));
  const Vt = jt,
    qt = d().Router();
  qt.route(q.customer).post(re(me.omit({ id: !0 })), Le()(mt)),
    qt.route(q.customer + "/:id").get(Le()(yt)),
    qt.route(q.customer).get(Le()(wt)),
    qt.route(q.customer + "/:id").delete(oe(me.pick({ id: !0 })), Le()(ht)),
    qt.route(q.customer + "/:id").put(oe(me.pick({ id: !0 })), re(me), Le()(gt));
  const Ut = qt,
    Mt = d().Router();
  Mt.route(U.product).get(Le()(Dt)),
    Mt.route(U.customer).get(Le()(Et)),
    Mt.route(U.order).get(Le()(At)),
    Mt.route(U.cleanzone).get(Le()(ft)),
    Mt.route(U.distribution).get(Le()(bt));
  const Gt = Mt,
    _t = d().Router();
  _t.route(q.order).post(re(we.omit({ id: !0 })), Le()(Nt)),
    _t.route(q.order + "/:id").get(oe(we.pick({ id: !0 })), Le()(Tt)),
    _t.route(q.order).get(Le()(kt)),
    _t.route(q.order + "/:id").delete(oe(we.pick({ id: !0 })), Le()(Rt)),
    _t.route(q.order + "/:id").put(oe(we.pick({ id: !0 })), re(we), Le()(It));
  const Ft = _t,
    Bt = d().Router();
  Bt.route(q.product).post(re(Ee.omit({ id: !0 })), Le()(Ct)),
    Bt.route(q.product + "/:id").get(oe(Ee.pick({ id: !0 })), Le()(zt)),
    Bt.route(q.product).get(Le()(St)),
    Bt.route(q.product + "/:id").delete(oe(Ee.pick({ id: !0 })), Le()(xt)),
    Bt.route(q.product + "/:id").put(oe(Ee.pick({ id: !0 })), re(Ee), Le()(vt));
  const Wt = Bt,
    Ht = d().Router();
  Ht.route(q.surplus).post(re(fe), Le()(Pt)), Ht.route(q.surplus).get(Le()(Ot));
  const $t = Ht,
    Kt = d().Router();
  Kt.route(q.user).post(re(be.omit({ id: !0 })), Le()(Lt));
  const Jt = Kt,
    Qt = m("PORT"),
    Zt = m("NODE_ENV") || "development",
    Xt = d()();
  Xt.use(d().json()),
    Xt.use(n()(A)),
    Xt.use(r()()),
    Xt.use(Pe.initialize()),
    Xt.use(a()()),
    Xt.use(te),
    Xt.use(L, Vt),
    Xt.use(L, Jt),
    Xt.use(j, Pe.authenticate("jwt", { session: !1 })),
    Xt.use(j, Wt),
    Xt.use(j, Ut),
    Xt.use(j, Ft),
    Xt.use(j, Gt),
    Xt.use(j, $t),
    Xt.listen(Qt, async () => {
      console.log(`Server is running on PORT ${Qt} in ${Zt.toUpperCase()} mode`), await Y();
    }),
    (module.exports = {});
})();
