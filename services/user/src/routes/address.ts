import { Hono } from "hono";
import { getAddress, addAddress, updateAddress, deleteAddress } from "../controllers/address";
const address = new Hono();

address.get("/", getAddress);
address.post("/addAddress", addAddress);
address.put("/updateAddress", updateAddress);
address.delete("/deleteAddress", deleteAddress);
// address.get("/:id", getAddressById);

export { address };