import { ShopItems } from "../../model/Schema.js";

export const listShopItems = async () => {
  return ShopItems.find().sort({ id: 1 }).lean();
};
