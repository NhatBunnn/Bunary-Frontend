import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrash,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function BulkImport({ show, onHide, onImport }) {
  const [inputText, setInputText] = useState("");
  const [separator, setSeparator] = useState("tab");
  const [customSeparator, setCustomSeparator] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [activeTab, setActiveTab] = useState("input");

  const parseData = (text) => {
    if (!text.trim()) {
      setPreviewData([]);
      return;
    }

    const lines = text
      .trim()
      .split(/\r?\n/)
      .filter((line) => line.trim());

    const result = lines
      .map((line, idx) => {
        const trimmed = line.trim();

        // === Ưu tiên định dạng: term /ipa/ (pos) meaning ===
        const regex = /^(.+?)\s*\/(.+?)\/\s*\(([^)]+)\)\s+(.+)$/;
        const match = trimmed.match(regex);

        if (match) {
          const [, term, ipa, pos, meaning] = match;

          // Chuẩn hóa loại từ
          const partOfSpeechMap = {
            n: "noun",
            v: "verb",
            adj: "adjective",
            adv: "adverb",
            prep: "preposition",
            conj: "conjunction",
            pron: "pronoun",
            int: "interjection",
            det: "determiner",
            pro: "pronoun",
          };

          const key = pos.trim().toLowerCase().replace(/\./g, "");
          const partOfSpeech = partOfSpeechMap[key] || pos.trim();

          return {
            index: idx + 1,
            term: term.trim(),
            ipa: ipa.trim(),
            partOfSpeech,
            meaning: meaning.trim(),
          };
        }

        // === Fallback: dùng delimiter ===
        const delimiter =
          separator === "tab"
            ? "\t"
            : separator === "comma"
            ? ","
            : separator === "semicolon"
            ? ";"
            : customSeparator || "\t";

        const parts = trimmed.split(delimiter).map((p) => p.trim());

        if (parts.length >= 2 && parts[0] && parts[1]) {
          return {
            index: idx + 1,
            term: parts[0],
            meaning: parts[1],
            ipa: parts[2] || "",
            partOfSpeech: parts[3] || "",
          };
        }

        return null;
      })
      .filter(Boolean);

    setPreviewData(result);
  };

  const handlePaste = (e) => {
    // đợi trình duyệt dán xong rồi mới đọc nội dung
    setTimeout(() => {
      const newValue = e.target.value;
      setInputText(newValue);
      parseData(newValue);
    }, 0);
  };

  const handlePreview = () => {
    parseData(inputText);
    setActiveTab("preview");
  };

  const handleImport = () => {
    const words = previewData.map((item) => ({
      term: item.term,
      meaning: item.meaning,
      ipa: item.ipa,
      partOfSpeech: item.partOfSpeech,
      thumbnail: null,
    }));
    onImport(words);
    onHide();
  };

  const clearAll = () => {
    setInputText("");
    setPreviewData([]);
    setActiveTab("input");
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
      onClick={onHide}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "1000px",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h5 style={{ margin: 0, fontWeight: 600, fontSize: "1.1rem" }}>
            Nhập nhiều từ – Dán dữ liệu từ Word, Excel, Google Docs...
          </h5>
          <button
            onClick={onHide}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "1rem 1.5rem",
            maxHeight: "calc(90vh - 140px)",
            overflowY: "auto",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #e5e7eb",
              marginBottom: "1rem",
            }}
          >
            <button
              onClick={() => setActiveTab("input")}
              style={{
                padding: "0.5rem 1rem",
                border: "none",
                background: activeTab === "input" ? "white" : "transparent",
                borderBottom:
                  activeTab === "input" ? "3px solid #3b82f6" : "none",
                fontWeight: activeTab === "input" ? 600 : 500,
                color: activeTab === "input" ? "#3b82f6" : "#6b7280",
                cursor: "pointer",
              }}
            >
              Nhập dữ liệu
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              style={{
                padding: "0.5rem 1rem",
                border: "none",
                background: activeTab === "preview" ? "white" : "transparent",
                borderBottom:
                  activeTab === "preview" ? "3px solid #3b82f6" : "none",
                fontWeight: activeTab === "preview" ? 600 : 500,
                color: activeTab === "preview" ? "#3b82f6" : "#6b7280",
                cursor: "pointer",
              }}
            >
              Xem trước ({previewData.length})
            </button>
          </div>

          {/* Tab: Input */}
          {activeTab === "input" && (
            <div>
              <textarea
                value={inputText}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputText(value);
                  parseData(value);
                }}
                onPaste={handlePaste}
                placeholder={`Ví dụ:\nresemblance /rɪˈzem.bləns/ (n) sự giống nhau\ndiffer /ˈdɪf.ər/ (v) khác biệt\nquickly /ˈkwɪk.li/ (adv) nhanh chóng`}
                style={{
                  width: "100%",
                  height: "220px",
                  padding: "0.75rem",
                  border: "2px solid #3b82f6",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontSize: "0.95rem",
                  resize: "none",
                  outline: "none",
                  backgroundColor: "#f8fafc",
                }}
              />

              {/* Separator Config */}
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px dashed #cbd5e1",
                }}
              >
                <small
                  style={{
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    style={{ marginRight: "0.35rem" }}
                  />
                  Nếu không dùng định dạng{" "}
                  <code
                    style={{
                      background: "#e2e8f0",
                      padding: "0.2rem 0.4rem",
                      borderRadius: "4px",
                    }}
                  >
                    term /ipa/ (pos) nghĩa
                  </code>
                  , chọn phân tách:
                </small>

                {["tab", "comma", "semicolon", "custom"].map((val) => (
                  <label
                    key={val}
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="radio"
                      name="separator"
                      value={val}
                      checked={separator === val}
                      onChange={(e) => setSeparator(e.target.value)}
                      style={{ marginRight: "0.5rem" }}
                    />
                    {val === "tab" && "Tab (mặc định từ Excel)"}
                    {val === "comma" && "Phẩy (,)"}
                    {val === "semicolon" && "Chấm phẩy (;)"}
                    {val === "custom" && "Tùy chỉnh"}
                  </label>
                ))}

                {separator === "custom" && (
                  <input
                    type="text"
                    placeholder="Nhập ký tự phân tách..."
                    value={customSeparator}
                    onChange={(e) => setCustomSeparator(e.target.value)}
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.5rem",
                      width: "180px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                    }}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div
                style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}
              >
                <button
                  onClick={handlePreview}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "white",
                    color: "#3b82f6",
                    border: "1px solid #3b82f6",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <FontAwesomeIcon icon={faEye} /> Xem trước
                </button>
                <button
                  onClick={clearAll}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "white",
                    color: "#ef4444",
                    border: "1px solid #ef4444",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} /> Xóa hết
                </button>
              </div>
            </div>
          )}

          {/* Tab: Preview */}
          {activeTab === "preview" && (
            <div>
              {previewData.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#f59e0b",
                    backgroundColor: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: "8px",
                  }}
                >
                  <strong>Chưa có dữ liệu hợp lệ.</strong>
                  <br />
                  Hãy thử dán dữ liệu theo định dạng:
                  <code
                    style={{
                      display: "block",
                      margin: "0.5rem 0",
                      fontFamily: "monospace",
                    }}
                  >
                    resemblance /rɪˈzem.bləns/ (n) sự giống nhau
                  </code>
                  hoặc dùng Tab/Comma để phân tách.
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: "420px",
                    overflowY: "auto",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.9rem",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: "#f3f4f6",
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                      }}
                    >
                      <tr>
                        <th
                          style={{
                            padding: "0.75rem",
                            textAlign: "center",
                            width: "50px",
                          }}
                        >
                          #
                        </th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>
                          THUẬT NGỮ
                        </th>
                        <th style={thStyle}>IPA</th>
                        <th style={thStyle}>LOẠI TỪ</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>
                          ĐỊNH NGHĨA
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row) => (
                        <tr
                          key={row.index}
                          style={{ borderTop: "1px solid #e5e7eb" }}
                        >
                          <td
                            style={{
                              padding: "0.75rem",
                              textAlign: "center",
                              fontWeight: 600,
                            }}
                          >
                            {row.index}
                          </td>
                          <td style={{ padding: "0.75rem", fontWeight: 500 }}>
                            {row.term}
                          </td>
                          <td style={tdStyle}>
                            {row.ipa ? `/${row.ipa}/` : "—"}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              fontStyle: "italic",
                              color: "#1d4ed8",
                            }}
                          >
                            {row.partOfSpeech || "—"}
                          </td>
                          <td style={{ padding: "0.75rem" }}>{row.meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={onHide}
            style={{
              padding: "0.5rem 1rem",
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleImport}
            disabled={previewData.length === 0}
            style={{
              padding: "0.5rem 1rem",
              background: previewData.length === 0 ? "#93c5fd" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: previewData.length === 0 ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            Nhập ({previewData.length} thẻ)
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles tái sử dụng
const thStyle = {
  padding: "0.75rem",
  textAlign: "left",
  fontSize: "0.85rem",
  color: "#374151",
};

const tdStyle = {
  padding: "0.75rem",
  fontFamily: "monospace",
  fontSize: "0.85rem",
  color: "#1f2937",
};
