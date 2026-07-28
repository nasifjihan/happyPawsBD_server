import { listShopItems } from "./catalog.service.js";

export const getShopItems = async (req, res, next) => {
  try {
    const shopItems = await listShopItems();
    res.status(200).json(shopItems);
  } catch (error) {
    next(error);
  }
};
