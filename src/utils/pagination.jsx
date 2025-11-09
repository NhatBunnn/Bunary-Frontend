// code này chat gpt viết nhá chứ t chả hiểu mẹ cả-))

export function getPaginationPages(current, total) {
  const pages = [];
  const delta = 2; // số trang hiển thị xung quanh current

  let left = current - delta;
  let right = current + delta;

  // đảm bảo left ≥ 2, right ≤ total - 1
  if (left < 2) left = 2;
  if (right > total - 1) right = total - 1;

  pages.push(1); // luôn hiển thị trang 1

  if (left > 2) {
    pages.push("..."); // chèn ... nếu khoảng cách quá xa với trang 1
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < total - 1) {
    pages.push("..."); // chèn ... nếu khoảng cách quá xa với trang cuối
  }

  if (total > 1) {
    pages.push(total); // luôn hiển thị trang cuối
  }

  return pages;
}
