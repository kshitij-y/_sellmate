import { Hono } from "hono";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.js";

const cartRouter = new Hono();

// get cart for user (join cart + cart_items)
cartRouter.get("/", getCart);

// add item to cart (store_product_id + quantity)
cartRouter.post("/add", addToCart);

// update quantity for an item
cartRouter.patch("/update/:itemId", updateCartItem);

// remove single cart item
cartRouter.delete("/remove/:itemId", removeCartItem);

// clear entire cart
cartRouter.delete("/clear", clearCart);

export default cartRouter;
