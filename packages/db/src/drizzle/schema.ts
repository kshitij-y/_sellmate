import {
    pgTable,
    uuid,
    varchar,
    text,
    numeric,
    timestamp,
    boolean,
    integer,
    primaryKey,
    foreignKey,
    jsonb,
    decimal,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});
export const jwks = pgTable("jwks", {
    id: text("id").primaryKey(),
    publicKey: text("public_key").notNull(),
    privateKey: text("private_key").notNull(),
    createdAt: timestamp("created_at").notNull(),
});

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const userProfile = pgTable("user_profile", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .unique()
        .references(() => user.id, { onDelete: "cascade" }),
    phone: text("phone"),
    address: jsonb("address").$type<{
        line1: string;
        city: string;
        state: string;
        pincode: string;
    }>(),
    rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const store = pgTable("store", {
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
        .notNull()
        .unique()
        .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    logo: text("logo"),
    coverImage: text("cover_image"),
    category: text("category"),
    location: text("location"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const storeProducts = pgTable("store_products", {
    id: text("id").primaryKey(),
    storeId: text("store_id")
        .notNull()
        .references(() => store.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    stock: integer("stock").default(0),
    images: jsonb("images").$type<string[]>(),
    category: text("category"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const listing = pgTable("listing", {
    id: text("id").primaryKey(),
    sellerId: text("seller_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    condition: text("condition").notNull(),
    category: text("category"),
    price: integer("price").notNull(),
    images: jsonb("images").$type<string[]>(),
    location: text("location"),
    isSold: boolean("is_sold").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    totalAmount: integer("total_amount").notNull(),
    status: text("status").default("pending").notNull(), // pending, paid, shipped, delivered
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
    id: text("id").primaryKey(),
    orderId: text("order_id")
        .notNull()
        .references(() => orders.id, { onDelete: "cascade" }),
    storeProductId: text("store_product_id")
        .notNull()
        .references(() => storeProducts.id),
    quantity: integer("quantity").notNull(),
    price: integer("price").notNull(), // price at the time of order
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const delivery = pgTable("delivery", {
    id: text("id").primaryKey(),
    orderId: text("order_id")
        .notNull()
        .references(() => orders.id, { onDelete: "cascade" }),
    deliveryUserId: text("delivery_user_id").references(() => user.id, {
        onDelete: "set null",
    }),
    status: text("status").default("pending").notNull(), // pending | picked | delivered
    pickupAddress: text("pickup_address"),
    dropAddress: text("drop_address"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
    id: text("id").primaryKey(),
    reviewerId: text("reviewer_id")
        .notNull()
        .references(() => user.id),
    targetUserId: text("target_user_id")
        .notNull()
        .references(() => user.id),
    orderId: text("order_id").references(() => orders.id),
    rating: integer("rating").notNull(), // 1–5
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cart = pgTable("cart", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .unique()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
    id: text("id").primaryKey(),
    cartId: text("cart_id")
        .notNull()
        .references(() => cart.id, { onDelete: "cascade" }),

    storeProductId: text("store_product_id").references(() => storeProducts.id),

    quantity: integer("quantity").default(1).notNull(),
    price: integer("price").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const schema = {
    user,
    account,
    session,
    verification,
    jwks,
    userProfile,
    store,
    storeProducts,
    listing,
    orders,
    orderItems,
    delivery,
    reviews,
    cart,
    cartItems,
};
