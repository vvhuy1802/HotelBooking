import React, { useState } from "react";
import "./new.scss";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const New = ({ title, inputs }) => {
  const [file, setFile] = useState(null);
  const [listImage, setListImage] = useState([]);

  const handleAddListImage = (file) => {
    //listImage have id, img
    const listImageTemp = [...listImage];
    for (let i = 0; i < file.length; i++) {
      listImageTemp.push({
        id: Math.random(),
        img: URL.createObjectURL(file[i]),
      });
    }
    setListImage(listImageTemp);
  };

  const handleDeleteImage = (id) => {
    const listImageTemp = [...listImage];
    const index = listImageTemp.findIndex((item) => item.id === id);
    listImageTemp.splice(index, 1);
    setListImage(listImageTemp);
  };

  return (
    <div className="new">
      <div className="container">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <label htmlFor="file">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
                className="imgAvatar"
              />
              <input
                type="file"
                id="file"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                style={{ display: "none", cursor: "pointer" }}
              />
            </label>
            {inputs.length === 8 && (
              <div className="listImageContainer">
                <div className="content">
                  {listImage.map((img) => (
                    <div className="item" key={img.id}>
                      <img src={img.img} alt="" className="imgList" />
                      <ClearOutlinedIcon
                        onClick={() => {
                          handleDeleteImage(img.id);
                        }}
                        className="divDelete"
                      />
                    </div>
                  ))}
                  <label htmlFor="listImage">
                    <AddPhotoAlternateIcon className="iconAdd" />
                    <input
                      type="file"
                      id="listImage"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleAddListImage(e.target.files);
                        }
                      }}
                      style={{ display: "none", cursor: "pointer" }}
                      multiple
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="right">
            <form>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    id={input.id_input}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}
              <button>Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
