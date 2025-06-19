import { Hono } from "hono";
import { getAddress,getdefaultAddress, addAddress, updateAddress, deleteAddress } from "../controllers/address";
const address = new Hono();

address.get("/", getAddress);
address.post("/addAddress", addAddress);
address.put("/updateAddress", updateAddress);
address.delete("/deleteAddress", deleteAddress);
address.get("/getdefault", getdefaultAddress);

export { address };