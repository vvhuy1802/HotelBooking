import React, { useState } from "react";
import "./new.scss";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import * as XLSX from "xlsx";

const New = ({ title, inputs }) => {
  const [file, setFile] = useState(null);
  const [dataFromExcel, setDataFromExcel] = useState(null);
  const [listImage, setListImage] = useState([]);
  const [isShowImage, setIsShowImage] = useState(false);
  const [imgIndex, setImgIndex] = useState(null);
  const [indexItemExcel, setIndexItemExcel] = useState(null);
  const [isSet, setIsSet] = useState(true);

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

  const handleAddAvatarFromExcel = (file) => {
    const listImageTemp = [...dataFromExcel[indexItemExcel].image];
    listImageTemp[0] = {
      id: Math.random(),
      img: URL.createObjectURL(file[0]),
    };
    const dataExcelTemp = [...dataFromExcel];
    dataExcelTemp[indexItemExcel].image = listImageTemp;
    console.log(dataExcelTemp);
    setDataFromExcel(dataExcelTemp);
  };

  const handleAddListImageFromExcel = (file) => {
    const listImageTemp = [...dataFromExcel[indexItemExcel].image];
    for (let i = 0; i < file.length; i++) {
      listImageTemp.push({
        id: Math.random(),
        img: URL.createObjectURL(file[i]),
      });
    }
    const dataExcelTemp = [...dataFromExcel];
    dataExcelTemp[indexItemExcel].image = listImageTemp;
    setDataFromExcel(dataExcelTemp);
  };

  const handleDeleteImage = (id) => {
    const listImageTemp = [...listImage];
    const index = listImageTemp.findIndex((item) => item.id === id);
    listImageTemp.splice(index, 1);
    setListImage(listImageTemp);
  };

  const handleDeleteImageFromExcel = (id, i) => {
    const listImageTemp = [...dataFromExcel[i].image];
    const index = listImageTemp.findIndex((item) => item.id === id);
    listImageTemp.splice(index, 1);
    const dataExcelTemp = [...dataFromExcel];
    dataExcelTemp[i].image = listImageTemp;
    setDataFromExcel(dataExcelTemp);
  };

  const handleOpenImage = (img) => {
    setIsShowImage(true);
    const index = listImage.findIndex((item) => item.id === img.id);
    setImgIndex(index);
  };

  const handleOpenImageFromExcel = (img, i) => {
    setIsShowImage(true);
    const index = dataFromExcel[i].image.findIndex(
      (item) => item.id === img.id
    );
    console.log(i, index);
    setImgIndex({
      index: index,
      indexExcel: i,
    });
  };

  const handleHidePassword = (id) => {
    const input = document.getElementById(id);
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  };

  const handleImportExcel = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workBook = XLSX.read(data, { type: "array" });
        const workSheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[workSheetName];
        const dataExcel = XLSX.utils.sheet_to_json(workSheet);
        //add field image
        dataExcel.forEach((item) => {
          item.image = [];
        });
        setDataFromExcel(dataExcel);
        console.log(dataExcel);
      };
    };
    input.click();
  };

  const handleSave = () => {
    const data = {};
    for (let i = 0; i < inputs.length; i++) {
      data[inputs[i].id_input] = document.getElementById(
        inputs[i].id_input
      ).value;
    }
    data.image = inputs.length === 6 ? file : listImage;
    console.log(data);
  };

  return (
    <div className="new">
      <div className="container">
        <div className="top title">
          <h1
            onClick={() => {
              setDataFromExcel(null);
            }}
          >
            {title}
          </h1>
          <p
            className="uploadExcel"
            onClick={() => {
              handleImportExcel();
            }}
          >
            Import from excel
          </p>
        </div>
        {dataFromExcel ? (
          <>
            <div className="bottomExcel">
              {dataFromExcel.map((item, index) => (
                <div className="bottom" key={index}>
                  <div className="left">
                    <p>
                      <span>{inputs.length === 6 ? "Avatar" : "Images"}</span>
                    </p>
                    <div className="container">
                      {inputs.length === 6 && (
                        <div
                          className="avatarContainer"
                          onClick={() => {
                            if (isSet) {
                              setIndexItemExcel(index);
                              setIsSet(!isSet);
                            }
                          }}
                        >
                          <label htmlFor="fileAvatar">
                            <img
                              src={
                                dataFromExcel[index]?.image.length > 0
                                  ? dataFromExcel[index]?.image[0]?.img
                                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                              }
                              alt=""
                              className="imgAvatar"
                            />
                            <input
                              type="file"
                              id="fileAvatar"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  handleAddAvatarFromExcel(e.target.files);
                                  setIsSet(!isSet);
                                  e.target.value = null;
                                }
                              }}
                              style={{ display: "none", cursor: "pointer" }}
                            />
                          </label>
                        </div>
                      )}
                      {inputs.length === 8 && (
                        <div className="listImageContainer">
                          <div className="content">
                            {dataFromExcel[index]?.image.map((img) => (
                              <div
                                className="item"
                                key={img.id}
                                onClick={() => {
                                  setIndexItemExcel(index);
                                }}
                              >
                                <img
                                  src={img.img}
                                  alt=""
                                  className="imgList"
                                  onClick={() => {
                                    handleOpenImageFromExcel(img, index);
                                  }}
                                />
                                <ClearOutlinedIcon
                                  onClick={() => {
                                    handleDeleteImageFromExcel(img.id, index);
                                  }}
                                  className="divDelete"
                                />
                              </div>
                            ))}
                            <label htmlFor="listImage">
                              <div
                                className="bgAdd"
                                onClick={() => {
                                  setIndexItemExcel(index);
                                }}
                              >
                                <AddToPhotosIcon className="iconAdd" />
                              </div>
                              <input
                                type="file"
                                id="listImage"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    handleAddListImageFromExcel(e.target.files);
                                    e.target.value = null;
                                  } else {
                                    console.log("null");
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
                  </div>
                  {isShowImage && inputs.length === 8 && (
                    <div className="middle">
                      <div
                        className="containerMiddle"
                        onClick={(e) => {
                          if (e.target.classList.contains("containerMiddle")) {
                            setIsShowImage(false);
                          }
                        }}
                      >
                        <CancelIcon
                          className="iconCancel"
                          onClick={() => {
                            setIsShowImage(false);
                          }}
                        />
                        <img
                          src={
                            dataFromExcel[imgIndex.indexExcel].image[
                              imgIndex.index
                            ].img
                          }
                          alt=""
                          className="imgMiddle"
                        />
                        <div className="listImgMiddle">
                          {dataFromExcel[imgIndex.indexExcel].image.map(
                            (img) => (
                              <img
                                src={img.img}
                                alt=""
                                className={`imgListMiddle ${
                                  img.id ===
                                  dataFromExcel[imgIndex.indexExcel].image[
                                    imgIndex.index
                                  ].id
                                    ? "active"
                                    : "notActive"
                                }`}
                                key={img.id}
                                onClick={() => {
                                  setImgIndex({
                                    indexExcel: imgIndex.indexExcel,
                                    index: dataFromExcel[
                                      imgIndex.indexExcel
                                    ].image.findIndex(
                                      (item) => item.id === img.id
                                    ),
                                  });
                                }}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="right">
                    <p>
                      <span>Informations</span>
                    </p>
                    <form>
                      {inputs.map((input) => (
                        <div className="formInput" key={input.id}>
                          <label>{input.label}</label>
                          <input
                            type={input.type}
                            id={input.id_input}
                            placeholder={input.placeholder}
                            value={item[input.id_input]}
                            onChange={(e) => {
                              const newItem = { ...item };
                              newItem[input.id_input] = e.target.value;
                              const newData = [...dataFromExcel];
                              newData[index] = newItem;
                              setDataFromExcel(newData);
                            }}
                            key={input.id_input}
                          />
                        </div>
                      ))}
                      <div
                        className="Divbutton"
                        onClick={() => {
                          console.log(dataFromExcel[index]);
                        }}
                      >
                        Save
                      </div>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="bottom">
              <div className="left">
                <p>
                  <span>{inputs.length === 6 ? "Avatar" : "Images"}</span>
                </p>
                <div className="container">
                  {inputs.length === 6 && (
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
                  )}
                  {inputs.length === 8 && (
                    <div className="listImageContainer">
                      <div className="content">
                        {listImage.map((img) => (
                          <div className="item" key={img.id}>
                            <img
                              src={img.img}
                              alt=""
                              className="imgList"
                              onClick={() => {
                                handleOpenImage(img);
                              }}
                            />
                            <ClearOutlinedIcon
                              onClick={() => {
                                handleDeleteImage(img.id);
                              }}
                              className="divDelete"
                            />
                          </div>
                        ))}
                        <label htmlFor="listImage">
                          <div className="bgAdd">
                            <AddToPhotosIcon className="iconAdd" />
                          </div>
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
              </div>
              {isShowImage && inputs.length === 8 && (
                <div className="middle">
                  <div
                    className="containerMiddle"
                    onClick={(e) => {
                      if (e.target.classList.contains("containerMiddle")) {
                        setIsShowImage(false);
                      }
                    }}
                  >
                    <CancelIcon
                      className="iconCancel"
                      onClick={() => {
                        setIsShowImage(false);
                      }}
                    />
                    <img
                      src={listImage[imgIndex].img}
                      alt=""
                      className="imgMiddle"
                    />
                    <div className="listImgMiddle">
                      {listImage.map((img) => (
                        <img
                          src={img.img}
                          alt=""
                          className={`imgListMiddle ${
                            img.id === listImage[imgIndex].id
                              ? "active"
                              : "notActive"
                          }`}
                          key={img.id}
                          onClick={() => {
                            setImgIndex(
                              listImage.findIndex((item) => item.id === img.id)
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="right">
                <p>
                  <span>Informations</span>
                </p>
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
                  <div
                    className="Divbutton"
                    onClick={() => {
                      handleSave();
                    }}
                  >
                    Save
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default New;
