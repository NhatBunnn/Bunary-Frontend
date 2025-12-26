import { useState } from "react";
import DialogWrapper from "@components/wrapper/DialogWrapper/DialogWrapper";
import Button from "@components/Button/Button";
import styles from "./ProfileEditModal.module.css";
import classNames from "classnames/bind";
import { Upload, User, Palette } from "lucide-react";

const c = classNames.bind(styles);

function ProfileEditModal({ isOpen, onClose, user }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    banner: user?.banner || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [field]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // TODO: Implement API call to save changes
    console.log("Saving changes:", formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      username: user?.username || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
      banner: user?.banner || "",
    });
    onClose();
  };

  return (
    <DialogWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      className={c("profileEditModal")}
      contentStyle={{ maxWidth: "800px", width: "90vw", minWidth: "600px" }}
    >
      <div className={c("modalContent")}>
        {/* Tab Navigation */}
        <div className={c("tabNav")}>
          <button
            className={c("tabBtn", { active: activeTab === "profile" })}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} />
            <span>Profile</span>
          </button>
          <button
            className={c("tabBtn", { active: activeTab === "appearance" })}
            onClick={() => setActiveTab("appearance")}
          >
            <Palette size={18} />
            <span>Appearance</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className={c("tabContent")}>
          {activeTab === "profile" && (
            <div className={c("profileTab")}>
              <div className={c("formGroup")}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={c("input")}
                />
              </div>

              <div className={c("formGroup")}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className={c("input")}
                />
              </div>

              <div className={c("formGroup")}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  className={c("textarea")}
                  rows={4}
                />
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className={c("appearanceTab")}>
              <div className={c("formGroup")}>
                <label>Avatar</label>
                <div className={c("imageUpload")}>
                  <div className={c("imagePreview")}>
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Avatar"
                        className={c("avatarPreview")}
                      />
                    ) : (
                      <div className={c("placeholder")}>
                        <Upload size={32} />
                        <span>No avatar</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "avatar")}
                    className={c("fileInput")}
                  />
                  <label htmlFor="avatar" className={c("uploadBtn")}>
                    <Upload size={16} />
                    Upload Avatar
                  </label>
                </div>
              </div>

              <div className={c("formGroup")}>
                <label>Banner</label>
                <div className={c("imageUpload")}>
                  <div className={c("bannerPreview")}>
                    {formData.banner ? (
                      <img
                        src={formData.banner}
                        alt="Banner"
                        className={c("bannerImage")}
                      />
                    ) : (
                      <div className={c("placeholder")}>
                        <Upload size={32} />
                        <span>No banner</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="banner"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "banner")}
                    className={c("fileInput")}
                  />
                  <label htmlFor="banner" className={c("uploadBtn")}>
                    <Upload size={16} />
                    Upload Banner
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={c("actions")}>
          <Button
            label="Cancel"
            onClick={handleCancel}
            className={c("cancelBtn")}
          />
          <Button
            label="Save Changes"
            onClick={handleSave}
            primary
            className={c("saveBtn")}
          />
        </div>
      </div>
    </DialogWrapper>
  );
}

export default ProfileEditModal;
