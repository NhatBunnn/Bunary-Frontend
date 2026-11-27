import { fetcher as defaultFetcher } from "./fetcher";

const resolveFetcher = (fn) => (typeof fn === "function" ? fn : defaultFetcher);

export const getShopOverview = async (fetcher) => {
  const f = resolveFetcher(fetcher);
  return await f({
    url: "/api/v1/shop",
    method: "GET",
  });
};

export const buyShopItem = async (fetcher, itemId) => {
  const f = resolveFetcher(fetcher);
  return await f({
    url: `/api/v1/shop/items/${itemId}/buy`,
    method: "POST",
  });
};

export const toggleEquipShopItem = async (fetcher, itemId) => {
  const f = resolveFetcher(fetcher);
  return await f({
    url: `/api/v1/shop/items/${itemId}/equip`,
    method: "POST",
  });
};

export const useShopPowerup = async (fetcher, itemId) => {
  const f = resolveFetcher(fetcher);
  return await f({
    url: `/api/v1/shop/items/${itemId}/use`,
    method: "POST",
  });
};
