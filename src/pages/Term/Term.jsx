import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TermPage() {
  return (
    <div className="container py-5 d-flex justify-content-center">
      <div
        className="p-5 shadow-lg rounded-4 bg-white"
        style={{ maxWidth: "850px", width: "100%" }}
      >
        <h1 className="mb-4 text-center fw-bold text-primary">
          Điều khoản sử dụng
        </h1>

        <p className="text-secondary mb-4 text-center">
          Cảm ơn bạn đã sử dụng nền tảng học tiếng Anh của chúng tôi. Vui lòng
          đọc kỹ các điều khoản sau.
        </p>

        <section className="mb-4">
          <h4 className="fw-semibold mb-2 text-primary">
            1. Chấp nhận điều khoản
          </h4>
          <p>
            Khi truy cập và sử dụng nền tảng, bạn đồng ý tuân thủ mọi điều khoản
            được nêu ra tại đây.
          </p>
        </section>

        <section className="mb-4">
          <h4 className="fw-semibold mb-2 text-primary">
            2. Trách nhiệm của người dùng
          </h4>
          <ul className="list-group">
            <li className="list-group-item d-flex align-items-center border-0 ps-0">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="me-2 text-success"
              />{" "}
              Cung cấp thông tin chính xác khi đăng ký.
            </li>
            <li className="list-group-item d-flex align-items-center border-0 ps-0">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="me-2 text-success"
              />{" "}
              Tự chịu trách nhiệm bảo mật tài khoản.
            </li>
            <li className="list-group-item d-flex align-items-center border-0 ps-0">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="me-2 text-success"
              />{" "}
              Không được sử dụng nền tảng cho mục đích xấu hoặc gian lận.
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h4 className="fw-semibold mb-2 text-primary">
            3. Thanh toán & tiền tệ
          </h4>
          <p>
            Một số tính năng nâng cao yêu cầu sử dụng tiền tệ trả phí. Mọi giao
            dịch đều là cuối cùng và không hoàn lại.
          </p>
        </section>

        <section className="mb-4">
          <h4 className="fw-semibold mb-2 text-primary">4. Quyền riêng tư</h4>
          <p>
            Chúng tôi cam kết bảo mật dữ liệu cá nhân của bạn. Thông tin sẽ
            không bị bán hoặc sử dụng sai mục đích.
          </p>
        </section>

        <section className="mb-4">
          <h4 className="fw-semibold mb-2 text-primary">
            5. Thay đổi điều khoản
          </h4>
          <p>
            Chúng tôi có quyền cập nhật điều khoản bất cứ lúc nào. Việc bạn tiếp
            tục sử dụng nền tảng đồng nghĩa với việc bạn chấp nhận thay đổi này.
          </p>
        </section>

        <div className="alert alert-info rounded-3 mt-4 text-center">
          Khi tiếp tục sử dụng nền tảng, bạn đã đồng ý với toàn bộ điều khoản.
        </div>
      </div>
    </div>
  );
}
