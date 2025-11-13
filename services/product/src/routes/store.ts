import { Hono } from "hono";
import { storeOwnershipMiddleware } from "../utils/storeCheck.js";
import {
  createStore,
  getStoreByOwner,
  updateStore,
  addStoreProduct,
  getStoreProducts,
  updateStoreProduct,
} from "../controllers/store.js";
import { orderStoreProduct } from "../controllers/order.js";

const storeRouter = new Hono();

// Store routes
storeRouter.post("/", createStore);
storeRouter.get("/owner/:ownerId", getStoreByOwner);
storeRouter.patch("/:storeId", storeOwnershipMiddleware, updateStore);

// Store product routes
storeRouter.post( "/:storeId/product",storeOwnershipMiddleware,addStoreProduct);
storeRouter.get("/:storeId/products", getStoreProducts);
storeRouter.patch("/:storeId/product/:productId", storeOwnershipMiddleware, updateStoreProduct);
// Order a store product (buy now)
storeRouter.post("/:storeId/product/:productId/order", orderStoreProduct);

export default storeRouter;