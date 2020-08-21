import React from "react";
import { TwitterPicker } from "react-color";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import firebase from "../firebase";
import "react-toastify/dist/ReactToastify.css";
import Input from "../components/Input";
import File from "../components/File";
import Review from "../components/Review";
import ProgressStriped from "../components/ProgressStriped";
const axios = require("axios");

const API_URL =
  "https://us-central1-viro-ar-card.cloudfunctions.net/app/api/profiles";

const Main = () => {
  const history = useHistory();
  const [profileId, setProfileId] = useState(null);
  const [imageTarget, setImageTarget] = useState(null);
  const [profileUrl, setProfileUrl] = useState("");
  const [targetUploadPs, setTargetUploadPs] = useState(0);
  const [videoUploadPs, setVideoUploadPs] = useState(0);
  const [largeImageUploadPs, setLargeImageUploadPs] = useState(0);
  const [avatarUploadPs, setAvatarUploadPs] = useState(0);
  const [name, setName] = useState("Your Name Here");
  const [color, setColor] = useState("#fff");
  const [email, setEmail] = useState("example@email.com");
  const [phone, setPhone] = useState("0999999999");
  const [fbLink, setFbLink] = useState("http://facebook.com");
  const [flag, setFlag] = useState(0);

  const [targetImageUrl, setTargetImageUrl] = useState("card.png");
  const [videoUrl, setVideoUrl] = useState(
    "https://www.videvo.net/videvo_files/converted/2015_08/preview/raininglettersBW.mp495670.webm"
  );
  const [largeImageUrl, setLargeImageUrl] = useState(
    "https://i.imgur.com/GmtwvL1.png"
  );
  const [avatarUrl, setAvatarUrl] = useState(
    "https://tanglaw.com.au/wp-content/uploads/2017/11/male-avatar-placeholder.jpg"
  );

  useEffect((eff) => {
    console.log(API_URL + "/" + history.location.state.userId);
    axios
      .get(API_URL + "/" + history.location.state.userId)
      .then(({ data }) => {
        console.log(data);
        const {
          id,
          targetImageUrl,
          name,
          phone,
          email,
          facebook,
          largeImageUrl,
          avatarImageUrl,
          videoUrl,
          textColor,
          profileUrl,
        } = data;
        setProfileId(id);
        setTargetImageUrl(targetImageUrl);
        setName(name);
        setPhone(phone);
        setEmail(email);
        setFbLink(facebook);
        setLargeImageUrl(largeImageUrl);
        setAvatarUrl(avatarImageUrl);
        setVideoUrl(videoUrl);
        setColor(textColor);
        setProfileUrl(profileUrl);
      });
  }, []);

  const handleTargetImageUpload = ({ target }) => {
    const imageTarget = target.files[0];
    uploadFileToFirebase(
      imageTarget,
      "images",
      (progress) => {
        setTargetUploadPs(progress);
      },
      () => {
        // handle error
      },
      (downloadUrl) => {
        setTargetImageUrl(downloadUrl);
        axios.put(API_URL + "/" + profileId, { targetImageUrl: downloadUrl });
      }
    );
  };

  const handleAvatarImageUpload = ({ target }) => {
    const imageTarget = target.files[0];
    uploadFileToFirebase(
      imageTarget,
      "images",
      (progress) => {
        setAvatarUploadPs(progress);
      },
      () => {
        // handle error
      },
      (downloadUrl) => {
        setAvatarUrl(downloadUrl);
        axios.put(API_URL + "/" + profileId, { avatarImageUrl: downloadUrl });
      }
    );
  };

  const handleLargeImageUpload = ({ target }) => {
    const imageTarget = target.files[0];
    uploadFileToFirebase(
      imageTarget,
      "images",
      (progress) => {
        setLargeImageUploadPs(progress);
      },
      () => {
        // handle error
      },
      (downloadUrl) => {
        setLargeImageUrl(downloadUrl);
        axios.put(API_URL + "/" + profileId, { largeImageUrl: downloadUrl });
      }
    );
  };

  const handleVideoUpload = ({ target }) => {
    const imageTarget = target.files[0];
    uploadFileToFirebase(
      imageTarget,
      "videos",
      (progress) => {
        setVideoUploadPs(progress);
      },
      () => {
        // handle error
      },
      (downloadUrl) => {
        setVideoUrl(downloadUrl);
        axios.put(API_URL + "/" + profileId, { videoUrl: downloadUrl });
      }
    );
  };

  const uploadFileToFirebase = (
    file,
    bucketName,
    onUploadStateChanged,
    onError,
    getDownloadURLCallback
  ) => {
    const storageRef = firebase.storage().ref(`${bucketName}/${file.name}`);
    const uploadTask = storageRef.put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onUploadStateChanged(progress);
      },
      (err) => {
        onError(err);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
          getDownloadURLCallback(downloadUrl);
        });
      }
    );
  };

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const handleNameChange = ({ currentTarget }) => {
    const { value } = currentTarget;
    setName(value);
  };
  const handleEmailChange = ({ currentTarget }) => {
    const { value } = currentTarget;
    setEmail(value);
  };
  const handlePhoneChange = ({ currentTarget }) => {
    const { value } = currentTarget;
    setPhone(value);
  };
  const handleFbLinkChange = ({ currentTarget }) => {
    const { value } = currentTarget;
    setFbLink(value);
  };

  const handleProfileUrlChange = ({ currentTarget }) => {
    const { value } = currentTarget;
    setProfileUrl(value);
  };

  const handleSave = () => {
    axios
      .put(API_URL + "/" + profileId, {
        name,
        email,
        phone,
        facebook: fbLink,
        textColor: color,
        profileUrl,
      })
      .then((res) => {
        res.status === 200
          ? toast("Cap nhat thanh cong")
          : toast("Loi cap nhat");
      })
      .catch((err) => {
        console.log(err.response);
        toast("Loi xay ra trong qua trinh cap nhat, vui long thu lai sau");
      });
  };
  return (
    <div className="Main">
      <div className="container py-2">
        <div className="row">
          <div className="col">
            <Review
              name={name}
              avatar={avatarUrl}
              videoLink={videoUrl}
              largeImage={largeImageUrl}
              cardImage={targetImageUrl}
              color={color}
            />
          </div>
        </div>
        <div className="row py-4">
          <div className="col-3">
            <File
              label="Ảnh danh thiếp"
              name="imageTarget"
              onChange={handleTargetImageUpload}
              accept=".jpg,.png,.jpeg"
            />
            <ProgressStriped
              valueMin="0"
              valueMax="100"
              valueNow={targetUploadPs}
            />
          </div>
          <div className="col-3">
            <File
              label="Ảnh đại diện"
              name="avatar"
              onChange={handleAvatarImageUpload}
              accept=".jpg,.png,.jpeg"
            />
            <ProgressStriped
              valueMin="0"
              valueMax="100"
              valueNow={avatarUploadPs}
            />
          </div>
          <div className="col-3">
            <File
              label="Ảnh phải"
              name="largeImage"
              onChange={handleLargeImageUpload}
              accept=".jpeg, .jpg, .png"
            />
            <ProgressStriped
              valueMin="0"
              valueMax="100"
              valueNow={largeImageUploadPs}
            />
          </div>
          <div className="col-3">
            <File
              label="Chọn Video"
              name="video"
              onChange={handleVideoUpload}
              accept=".mp4"
            />
            <ProgressStriped
              valueMin="0"
              valueMax="100"
              valueNow={videoUploadPs}
            />
          </div>
          <div className="col-3">
            <Input label="Name" value={name} onChange={handleNameChange} />
          </div>
          <div className="col-3">
            <Input label="Email" value={email} onChange={handleEmailChange} />
          </div>
          <div className="col-3">
            <Input label="Phone" value={phone} onChange={handlePhoneChange} />
          </div>
          <div className="col-3">
            <Input
              label="Facebook"
              value={fbLink}
              onChange={handleFbLinkChange}
            />
          </div>
          <div className="col-3">
            <Input
              label="Profile"
              value={profileUrl}
              onChange={handleProfileUrlChange}
            />
          </div>
          <div className="col-3">
            <div style={{ paddingBottom: 10 }}> Chọn màu</div>
            <TwitterPicker
              color="#f0f"
              onChange={({ hex }) => {
                setColor(hex);
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <button className="btn btn-info" onClick={handleSave}>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
