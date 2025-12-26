import { useState } from "react";
import { X, Image as ImageIcon, Smile, Video } from "lucide-react";
import DialogWrapper from "@components/wrapper/DialogWrapper/DialogWrapper";
import Button from "@components/Button/Button";
import styles from "./CreatePostModal.module.css";
import classNames from "classnames/bind";
import { Image } from "@assets/images";

const c = classNames.bind(styles);

function CreatePostModal({ isOpen, onClose, user, createPost }) {
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // used for upload
  const [selectedPreviews, setSelectedPreviews] = useState([]); // used for preview

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const availableSlots = 3 - selectedFiles.length;

    if (availableSlots <= 0) return;

    const filesToUpload = files.slice(0, availableSlots);

    filesToUpload.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles((prev) => [...prev, ...filesToUpload]);
    // Reset input value to allow selecting same file again if needed
    e.target.value = "";
  };

  const removeImage = (index) => {
    setSelectedPreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    createPost(content, selectedFiles);
    setContent("");
    setSelectedFiles([]);
    setSelectedPreviews([]);
    onClose();
  };

  const handleCancel = () => {
    setContent("");
    setSelectedFiles([]);
    setSelectedPreviews([]);
    onClose();
  };

  return (
    <DialogWrapper
      isOpen={isOpen}
      onClose={handleCancel}
      title="Create Post"
      className={c("createPostModal")}
      contentStyle={{ maxWidth: "500px", width: "90vw", minWidth: "600px" }}
    >
      <div className={c("modalContent")}>
        {/* User Info */}
        <div className={c("userInfo")}>
          <Image src={user?.avatar} className={c("avatar")} alt="Avatar" />
          <span className={c("userName")}>{user?.fullName}</span>
        </div>

        {/* Textarea */}
        <textarea
          className={c("textarea")}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          autoFocus
        />

        {/* Image Preview */}
        {selectedPreviews.length > 0 && (
          <div className={c("imageGrid", `grid-${selectedPreviews.length}`)}>
            {selectedPreviews.map((image, index) => (
              <div key={index} className={c("imagePreview")}>
                <img src={image} alt={`Preview ${index + 1}`} />
                <button
                  className={c("removeImage")}
                  onClick={() => removeImage(index)}
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Media Options */}
        <div className={c("mediaOptions")}>
          <span className={c("addToPost")}>Add to your post</span>
          <div className={c("options")}>
            <label
              className={c("option", { disabled: selectedFiles.length >= 3 })}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className={c("fileInput")}
                disabled={selectedFiles.length >= 3}
              />
              <ImageIcon
                size={20}
                className={c("photoIcon", {
                  disabledIcon: selectedFiles.length >= 3,
                })}
              />
            </label>
            <button className={c("option")}>
              <Video size={20} className={c("videoIcon")} />
            </button>
            <button className={c("option")}>
              <Smile size={20} className={c("emojiIcon")} />
            </button>
          </div>
        </div>

        {/* Post Button */}
        <Button
          label="Post"
          onClick={handlePost}
          primary
          className={c("postBtn")}
          disabled={!content.trim() && selectedFiles.length === 0}
        />
      </div>
    </DialogWrapper>
  );
}

export default CreatePostModal;
