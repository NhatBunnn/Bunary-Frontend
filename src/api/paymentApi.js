import { fetcher as defaultFetcher } from "./fetcher";

const resolveFetcher = (fn) => (typeof fn === "function" ? fn : defaultFetcher);

/**
 * Lấy danh sách gói nạp Crystal
 */
export const getActivePackages = async (fetcher) => {
  const f = resolveFetcher(fetcher);
  return await f({
    url: "/api/payments/packages",
    method: "GET",
  });
};

/**
 * Tạo yêu cầu thanh toán VNPay (hỗ trợ cả createPayment(fetcher, id) lẫn createPayment(id))
 */
export const createPayment = async (arg1, arg2) => {
  let f = defaultFetcher;
  let packageId = arg1;

  if (typeof arg1 === "function") {
    f = arg1;
    packageId = arg2;
  }

  return await f({
    url: "/api/payments/create",
    method: "POST",
    data: { packageId },
  });
};

/**
 * Lấy số dư Crystal của người dùng
 */
export const getCrystalBalance = async (fetcher) => {
  const f = resolveFetcher(fetcher);
  return await f({
    url: "/api/v1/crystal/balance",
    method: "GET",
  });
};

/**
 * Lấy lịch sử giao dịch nạp Crystal
 */
export const getCrystalTransactions = async (fetcher) => {
  const f = resolveFetcher(fetcher);
  return await f({
    url: "/api/v1/crystal/transactions",
    method: "GET",
  });
};
