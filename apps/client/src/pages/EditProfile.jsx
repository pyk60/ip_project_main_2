import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile({ profile, setProfile }) {
  const navigate = useNavigate();

  const [previewName, setPreviewName] = useState(profile.name);
  const [previewPic, setPreviewPic] = useState(profile.profilePic);

  const handleSave = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      name: previewName,
      profilePic: previewPic,
    }));
    navigate("/mypage");
  };

  const handleCancel = () => {
    navigate("/mypage");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        color: "white",
        backgroundColor: "black",
        height: "100vh",
      }}
    >
      <div>
        <img
          src={previewPic}
          alt="프로필 미리보기"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            marginBottom: "20px", // 이미지와 이름 사이 간격
          }}
        />
        <h2 style={{ marginBottom: "20px" }}>{previewName}</h2>
      </div>
      <div style={{ width: "300px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            textAlign: "left",
            color: "#ccc",
          }}
        >
          이름
        </label>
        <input
          type="text"
          value={previewName}
          onChange={(e) => setPreviewName(e.target.value)}
          style={{
            display: "block",
              width: "100%",
              padding: "8px",
              marginBottom: "20px",
              backgroundColor: "#ddd",
              border: "none",
              borderRadius: "4px",
          }}
        />
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            textAlign: "left",
            color: "#ccc",
          }}
        >
          프로필 사진 URL
        </label>
        <input
          type="text"
          value={previewPic}
          onChange={(e) => setPreviewPic(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "30px",
            backgroundColor: "#ddd",
            border: "none",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          저장
        </button>
        <button
          onClick={handleCancel}
          style={{
            padding: "10px 20px",
            backgroundColor: "gray",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
}
