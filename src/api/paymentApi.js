export const getActivePackages = async (fetcher) => {
  return await fetcher({
    url: "/api/payments/packages",
    method: "GET",
  });
};

export const createPayment = async (fetcher, packageId) => {
  return await fetcher({
    url: "/api/payments/create",
    method: "POST",
    data: { packageId },
  });
};

export const getCrystalBalance = async (fetcher) => {
  return await fetcher({
    url: "/api/v1/crystal/balance",
    method: "GET",
  });
};

export const getCrystalTransactions = async (fetcher) => {
  return await fetcher({
    url: "/api/v1/crystal/transactions",
    method: "GET",
  });
};
