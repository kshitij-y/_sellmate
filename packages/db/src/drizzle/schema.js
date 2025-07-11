"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.reviews = exports.order_items = exports.orders = exports.cart_items = exports.cart = exports.wishlist_item = exports.wishlist = exports.user_address = exports.address = exports.product_image = exports.product_config = exports.product_item = exports.product = exports.variation_option = exports.variation = exports.categoryVariation = exports.category = exports.user = exports.jwks = exports.verification = exports.account = exports.session = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.session = (0, pg_core_1.pgTable)("session", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    token: (0, pg_core_1.text)("token").notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull(),
    ipAddress: (0, pg_core_1.text)("ip_address"),
    userAgent: (0, pg_core_1.text)("user_agent"),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.user.id, { onDelete: "cascade" }),
});
exports.account = (0, pg_core_1.pgTable)("account", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    accountId: (0, pg_core_1.text)("account_id").notNull(),
    providerId: (0, pg_core_1.text)("provider_id").notNull(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.user.id, { onDelete: "cascade" }),
    accessToken: (0, pg_core_1.text)("access_token"),
    refreshToken: (0, pg_core_1.text)("refresh_token"),
    idToken: (0, pg_core_1.text)("id_token"),
    accessTokenExpiresAt: (0, pg_core_1.timestamp)("access_token_expires_at"),
    refreshTokenExpiresAt: (0, pg_core_1.timestamp)("refresh_token_expires_at"),
    scope: (0, pg_core_1.text)("scope"),
    password: (0, pg_core_1.text)("password"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull(),
});
exports.verification = (0, pg_core_1.pgTable)("verification", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    identifier: (0, pg_core_1.text)("identifier").notNull(),
    value: (0, pg_core_1.text)("value").notNull(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at"),
});
exports.jwks = (0, pg_core_1.pgTable)("jwks", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    publicKey: (0, pg_core_1.text)("public_key").notNull(),
    privateKey: (0, pg_core_1.text)("private_key").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull(),
});
exports.user = (0, pg_core_1.pgTable)("user", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    emailVerified: (0, pg_core_1.boolean)("email_verified").notNull(),
    image: (0, pg_core_1.text)("image"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull(),
});
exports.category = (0, pg_core_1.pgTable)("category", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    parent_cat_id: (0, pg_core_1.uuid)("parent_cat_id"),
    cat_name: (0, pg_core_1.text)("cat_name").notNull(),
}, (t) => [
    (0, pg_core_1.foreignKey)({ columns: [t.parent_cat_id], foreignColumns: [t.id] }).onDelete("set null"),
]);
exports.categoryVariation = (0, pg_core_1.pgTable)("category_variation", {
    category_id: (0, pg_core_1.uuid)("category_id")
        .references(() => exports.category.id)
        .notNull(),
    variation_id: (0, pg_core_1.uuid)("variation_id")
        .references(() => exports.variation.id)
        .notNull(),
}, (t) => [(0, pg_core_1.primaryKey)(t.category_id, t.variation_id)]);
exports.variation = (0, pg_core_1.pgTable)("variation", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
});
exports.variation_option = (0, pg_core_1.pgTable)("variation_option", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    variation_id: (0, pg_core_1.uuid)("variation_id")
        .references(() => exports.variation.id)
        .notNull(),
    value: (0, pg_core_1.text)("value").notNull(),
});
exports.product = (0, pg_core_1.pgTable)("product", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    category_id: (0, pg_core_1.uuid)("category_id").references(() => exports.category.id),
});
exports.product_item = (0, pg_core_1.pgTable)("product_item", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    product_id: (0, pg_core_1.uuid)("product_id")
        .references(() => exports.product.id)
        .notNull(),
    sku: (0, pg_core_1.text)("sku").notNull().unique(),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    price: (0, pg_core_1.numeric)("price", { precision: 10, scale: 2 }).notNull(),
});
exports.product_config = (0, pg_core_1.pgTable)("product_config", {
    product_item_id: (0, pg_core_1.uuid)("product_item_id")
        .references(() => exports.product_item.id)
        .notNull(),
    variation_option_id: (0, pg_core_1.uuid)("variation_option_id")
        .references(() => exports.variation_option.id)
        .notNull(),
}, (t) => [(0, pg_core_1.primaryKey)({ columns: [t.product_item_id, t.variation_option_id] })]);
exports.product_image = (0, pg_core_1.pgTable)("product_image", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    product_item_id: (0, pg_core_1.uuid)("product_item_id")
        .references(() => exports.product_item.id)
        .notNull(),
    image_url: (0, pg_core_1.text)("image_url").notNull(),
    position: (0, pg_core_1.integer)("position").notNull(),
});
exports.address = (0, pg_core_1.pgTable)("address", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    address_line1: (0, pg_core_1.text)("address_line1").notNull(),
    address_line2: (0, pg_core_1.text)("address_line2"),
    city: (0, pg_core_1.text)("city").notNull(),
    phone: (0, pg_core_1.text)("phone").notNull(),
    pin_code: (0, pg_core_1.text)("pin_code").notNull(),
    country: (0, pg_core_1.text)("country").notNull(),
});
exports.user_address = (0, pg_core_1.pgTable)("user_address", {
    user_id: (0, pg_core_1.text)("user_id")
        .references(() => exports.user.id)
        .notNull(),
    address_id: (0, pg_core_1.uuid)("address_id")
        .references(() => exports.address.id)
        .notNull(),
    default: (0, pg_core_1.boolean)("default").notNull().default(false),
}, (t) => [(0, pg_core_1.primaryKey)({ columns: [t.user_id, t.address_id] })]);
exports.wishlist = (0, pg_core_1.pgTable)("wishlist", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    user_id: (0, pg_core_1.text)("user_id")
        .references(() => exports.user.id)
        .notNull(),
});
exports.wishlist_item = (0, pg_core_1.pgTable)("wishlist_item", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    wishlist_id: (0, pg_core_1.uuid)("wishlist_id")
        .references(() => exports.wishlist.id)
        .notNull(),
    product_item_id: (0, pg_core_1.uuid)("product_item_id")
        .references(() => exports.product_item.id)
        .notNull(),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
});
exports.cart = (0, pg_core_1.pgTable)("cart", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    user_id: (0, pg_core_1.text)("user_id")
        .references(() => exports.user.id)
        .notNull(),
});
exports.cart_items = (0, pg_core_1.pgTable)("cart_items", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    cart_id: (0, pg_core_1.uuid)("cart_id")
        .references(() => exports.cart.id)
        .notNull(),
    product_item_id: (0, pg_core_1.uuid)("product_item_id")
        .references(() => exports.product_item.id)
        .notNull(),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
});
exports.orders = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    user_id: (0, pg_core_1.text)("user_id")
        .references(() => exports.user.id)
        .notNull(),
    order_date: (0, pg_core_1.timestamp)("order_date").defaultNow(),
    shipping_address_id: (0, pg_core_1.uuid)("shipping_address_id")
        .references(() => exports.address.id)
        .notNull(),
    total_amount: (0, pg_core_1.numeric)("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.order_items = (0, pg_core_1.pgTable)("order_items", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    order_id: (0, pg_core_1.uuid)("order_id")
        .references(() => exports.orders.id, { onDelete: "cascade" })
        .notNull(),
    product_item_id: (0, pg_core_1.uuid)("product_item_id")
        .references(() => exports.product_item.id)
        .notNull(),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    price: (0, pg_core_1.numeric)("price", { precision: 10, scale: 2 }).notNull(),
});
exports.reviews = (0, pg_core_1.pgTable)("reviews", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    product_item_id: (0, pg_core_1.uuid)("product_item_id")
        .notNull()
        .references(() => exports.product_item.id, { onDelete: "cascade" }),
    user_id: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.user.id, { onDelete: "cascade" }),
    rating: (0, pg_core_1.integer)("rating").notNull(),
    comment: (0, pg_core_1.text)(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [(0, drizzle_orm_1.sql) `CHECK (${table.rating} >= 1 AND ${table.rating} <= 5)`]);
exports.schema = {
    user: exports.user,
    account: exports.account,
    session: exports.session,
    verification: exports.verification,
    jwks: exports.jwks,
    product: exports.product,
    product_item: exports.product_item,
    product_config: exports.product_config,
    product_image: exports.product_image,
    category: exports.category,
    variation: exports.variation,
    variation_option: exports.variation_option,
    orders: exports.orders,
    order_items: exports.order_items,
    reviews: exports.reviews,
    wishlist: exports.wishlist,
    wishlist_item: exports.wishlist_item,
    cart: exports.cart,
    cart_items: exports.cart_items,
    address: exports.address,
    user_address: exports.user_address,
    categoryVariation: exports.categoryVariation,
};
