# Bunary - Nền tảng học từ vựng

Chào mừng đến với Bunary! Đây là một dự án front-end được xây dựng bằng React.js, với mục tiêu tạo ra một nền tảng giúp người dùng học từ vựng thông qua các bộ thẻ (word sets), flashcards, và các bài kiểm tra trắc nghiệm.

## ✨ Tính năng chính

Dựa trên trang `WordSetPage`, ứng dụng có các tính năng nổi bật sau:

- **Xem chi tiết bộ từ vựng**: Hiển thị danh sách các từ, định nghĩa, phiên âm, và hình ảnh minh họa.
- **Nhiều chế độ học**:
  - **Thẻ ghi nhớ (Flashcards)**: Lật thẻ để học từ và nghĩa.
  - **Trắc nghiệm (Multiple Choice)**: Chọn đáp án đúng.
  - **Kiểm tra (Test)**: Chế độ kiểm tra kiến thức tổng hợp.
- **Quản lý bộ từ vựng**:
  - Người dùng có thể tạo, chỉnh sửa các bộ từ của riêng mình.
  - Lưu các bộ từ yêu thích vào bộ sưu tập cá nhân.
- **Tương tác xã hội**:
  - **Đánh giá và bình luận**: Người dùng có thể xếp hạng (1-5 sao) và để lại nhận xét cho các bộ từ.
  - Xem thông tin tác giả của bộ từ.
- **Giao diện người dùng hiện đại**: Thiết kế sạch sẽ, dễ sử dụng với các thành phần tương tác.

## 🚀 Công nghệ sử dụng

Dự án được xây dựng với các công nghệ và thư viện hiện đại:

- **Framework**: React.js
- **Ngôn ngữ**: JavaScript (JSX)
- **Quản lý trạng thái & Dữ liệu**:
  - React Hooks (`useState`, `useEffect`, `useContext`).
  - Custom Hooks (ví dụ: `useWordSetPage`) để tách biệt logic.
  - React Context API (ví dụ: `UserProvider`) để quản lý thông tin người dùng.
- **Routing**: React Router DOM
- **Styling**:
  - CSS Modules (`.module.css`) để đóng gói style cho component.
  - Thư viện `classnames` để quản lý class động.
- **Icons**:
  - Font Awesome
  - Lucide React
- **Cấu trúc dự án**:
  - Tổ chức theo component (`src/components`).
  - Tổ chức theo tính năng (`src/features`).
  - Tổ chức theo trang (`src/pages`).

## 📂 Cấu trúc thư mục (dự kiến)

```
src/
├── assets/
├── components/       # Các component UI tái sử dụng (Button, Dialog, Loading...)
├── context/          # React Context providers (UserProvider...)
├── features/         # Các module tính năng lớn (collection, authentication...)
├── hooks/            # Custom hooks chung
├── pages/            # Các component tương ứng với mỗi trang (WordSetPage...)
├── services/         # Logic gọi API
├── styles/           # Styles chung, biến CSS
├── utils/            # Các hàm tiện ích (getThumbnailUrl...)
├── App.js
├── index.js
└── ...
```

## 🏁 Bắt đầu

Để chạy dự án này trên máy cục bộ của bạn, hãy làm theo các bước sau.

### Yêu cầu

- Node.js (phiên bản 16.x trở lên)
- npm hoặc yarn

### Cài đặt

1.  **Clone repository về máy:**

    ```bash
    git clone <your-repository-url>
    cd Bunary-reactjs
    ```

2.  **Cài đặt các dependencies:**

    Sử dụng npm:

    ```bash
    npm install
    ```

    Hoặc sử dụng yarn:

    ```bash
    yarn install
    ```

3.  **Chạy dự án:**

    ```bash
    npm start
    ```

    Ứng dụng sẽ tự động mở trên trình duyệt tại địa chỉ `http://localhost:3000`.

## 🤝 Đóng góp

Chúng tôi luôn chào đón các đóng góp! Nếu bạn muốn cải thiện dự án, vui lòng tạo một Pull Request.
