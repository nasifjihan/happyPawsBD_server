import { ShopItems } from "../../model/Schema.js";
import { getShopItems } from "../../utils/content-store.js";

const hasDatabaseRecords = async () => {
  const recordCount = await ShopItems.estimatedDocumentCount();
  return recordCount > 0;
};

export const listShopItems = async () => {
  if (await hasDatabaseRecords()) {
    return ShopItems.find().sort({ id: 1 }).lean();
  }

  return getShopItems();
};
