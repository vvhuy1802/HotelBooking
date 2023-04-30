import "./single.scss";
import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetSingleUser } from "../../middlewares/user";
import { GetSingleAdmin } from "../../middlewares/admin";
import { GetSingleHotel } from "../../middlewares/hotel";
import { setStateSidebar } from "../../redux/Slices/Global";
import { moneyAdapter } from "../../functions/Adapter";
import { UpdateInfoAdmin } from "../../middlewares/admin";
import { setAnnouncementAuto, setTotalAdmin } from "../../redux/Slices/Global";

import Chart from "../../components/chart/Chart";
import ListTable from "../../components/table/Table";
import avatar from "../../assets/avatar.jpg";
import Skeleton from "@mui/material/Skeleton";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import CancelIcon from "@mui/icons-material/Cancel";

const Single = ({ inputs }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentPath = location.pathname;
  const [user, setUser] = useState({});
  const [admin, setAdmin] = useState({});
  const [hotel, setHotel] = useState({});
  const { typeMoney, totalAdmin } = useSelector((state) => state.global);
  const [file, setFile] = useState(null);
  const [listImage, setListImage] = useState([]);
  const [isShowImage, setIsShowImage] = useState(false);
  const [imgIndex, setImgIndex] = useState(null);

  useEffect(() => {
    if (currentPath.split("/")[1] === "user") {
      dispatch(setStateSidebar("Users"));
      GetSingleUser(currentPath.split("/")[2]).then((res) => {
        if (res.status === 200) {
          setUser(res.data.data.user);
        }
      });
    } else if (currentPath.split("/")[1] === "admin") {
      dispatch(setStateSidebar("Admin"));
      GetSingleAdmin(currentPath.split("/")[2]).then((res) => {
        const data = res.data.data.admin;
        setAdmin({
          name: data.name,
          email: data.email,
          phone: data.phone_number,
          country: data.country,
          idhotel: data.dataHotel[0].name,
          password: "********",
        });
      });
    } else if (currentPath.split("/")[1] === "hotel") {
      dispatch(setStateSidebar("Hotels"));
      GetSingleHotel(currentPath.split("/")[2]).then((res) => {
        setListImage([]);
        if (res.status === 200) {
          const data = res.data;
          setHotel({
            id: data.id,
            name: data.name,
            advantage: data.advantage,
            description: data.description,
            address: data.address,
            tag: data.tag,
            longitude: data.position[0],
            latitude: data.position[1],
          });
          res.data.image.map((img) => {
            return setListImage((prev) => [
              ...prev,
              {
                id: Math.random(),
                img: img,
              },
            ]);
          });
        }
      });
    }
  }, [dispatch, currentPath]);

  const totalSpending = () => {
    var total = 0;
    user?.orders?.forEach((order) => {
      total += order.total;
    });
    return moneyAdapter(total, typeMoney);
  };

  const updateTotalAdmin = (data) => {
    const newData = [...totalAdmin?.data.admin];
    const index = newData.findIndex((item) => item._id === data._id);
    newData[index] = data;
    dispatch(
      setTotalAdmin({
        data: {
          admin: newData,
        },
      })
    );
  };

  const handleUpdateAdmin = () => {
    const data = {
      name: "",
      avatar: "",
      phone_number: "",
      country: "",
    };
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].id_input === "name")
        data.name = document.getElementById(inputs[i].id_input).value;
      if (inputs[i].id_input === "phone")
        data.phone_number = document.getElementById(inputs[i].id_input).value;
      if (inputs[i].id_input === "country")
        data.country = document.getElementById(inputs[i].id_input).value;
    }
    data.avatar = file ? file : admin?.avatar;

    UpdateInfoAdmin(currentPath.split("/")[2], data).then((res) => {
      if (res.status === 200) {
        updateTotalAdmin(res.data.data.admin);
        dispatch(
          setAnnouncementAuto({
            message: "Update successfully!",
            type: "success",
            id: Math.random(),
          })
        );
      } else {
        setAnnouncementAuto({
          message: "Update failed!",
          type: "error",
          id: Math.random(),
        });
      }
    });
  };

  const handleOpenImage = (img) => {
    setIsShowImage(true);
    const index = listImage.findIndex((item) => item.id === img.id);
    setImgIndex(index);
  };

  const handleDeleteImage = (id) => {
    const listImageTemp = [...listImage];
    const index = listImageTemp.findIndex((item) => item.id === id);
    listImageTemp.splice(index, 1);
    setListImage(listImageTemp);
  };

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

  const handleUpdateHotel = () => {
    const data = {};
    for (let i = 0; i < inputs.length; i++) {
      data[inputs[i].id_input] = document.getElementById(
        inputs[i].id_input
      ).value;
    }
    data.image = listImage;
    console.log(data);
  };

  return (
    <div className="single">
      <div className="container">
        {currentPath.split("/")[1] === "user" ? (
          <>
            <div className="top">
              <div className="left">
                <h1 className="title">Information</h1>
                <div className="item">
                  {user?.email ? (
                    <img src={avatar} alt="" className="itemImg" />
                  ) : (
                    <Skeleton variant="circular" className="itemImg" />
                  )}
                  <div className="details">
                    {user?.email ? (
                      <h1 className="itemTitle">{user?.name}</h1>
                    ) : (
                      <Skeleton variant="text" className="skeletonText dif" />
                    )}
                    {user?.email ? (
                      <div className="detailItem">
                        <span className="itemKey">Email:</span>
                        <span className="itemValue">{user?.email}</span>
                      </div>
                    ) : (
                      <Skeleton variant="text" className="skeletonText dif" />
                    )}
                    {user?.email ? (
                      <div className="detailItem">
                        <span className="itemKey">Phone:</span>
                        <span className="itemValue">
                          {user?.phone_number || "null"}
                        </span>
                      </div>
                    ) : (
                      <Skeleton variant="text" className="skeletonText dif" />
                    )}
                  </div>
                </div>
                <div className="booking">
                  {user?.email ? (
                    <div className="bookingItem">
                      <span className="itemKey">Total Orders:</span>
                      <span className="itemValue">{user?.orders?.length}</span>
                    </div>
                  ) : (
                    <Skeleton variant="text" className="skeletonText" />
                  )}
                  {user?.email ? (
                    <div className="bookingItem">
                      <span className="itemKey">Total Spending:</span>
                      <span className="itemValue">{totalSpending()}</span>
                    </div>
                  ) : (
                    <Skeleton variant="text" className="skeletonText" />
                  )}
                </div>
              </div>
              <div className="right">
                <Chart
                  dataChart={user?.orders}
                  height={200}
                  title={"User Spending (Last 6 Months)"}
                />
              </div>
            </div>
            <div className="bottom">
              <div className="listContainer">
                <div className="listTitle">Last Transactions</div>
                <ListTable dataTable={user?.orders} userName={user?.name} />
              </div>
            </div>
          </>
        ) : currentPath.split("/")[1] === "admin" ? (
          <>
            <div className="bottomAdmin">
              <div className="left">
                <p>
                  <span>Avatar</span>
                </p>
                <div className="container">
                  {inputs.length === 6 && (
                    <label htmlFor="file">
                      {admin?.email ? (
                        <img
                          src={
                            file
                              ? URL.createObjectURL(file)
                              : admin?.avatar
                              ? admin?.avatar
                              : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                          }
                          alt=""
                          className="imgAvatar"
                        />
                      ) : (
                        <Skeleton
                          variant="circular"
                          className="avatarContainer"
                        />
                      )}

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
                </div>
              </div>
              <div className="right">
                <p>
                  <span>Informations</span>
                </p>
                <form>
                  {inputs.map((input) => (
                    <div className="formInput" key={input.id}>
                      <label>
                        {input.label === "ID Hotel" ? "Hotel" : input.label}
                      </label>
                      {admin?.email ? (
                        <input
                          type={input.type}
                          id={input.id_input}
                          placeholder={input.placeholder}
                          value={admin[input.id_input] || ""}
                          disabled={input.disabled}
                          onChange={(e) => {
                            setAdmin({
                              ...admin,
                              [input.id_input]: e.target.value,
                            });
                          }}
                        />
                      ) : (
                        <Skeleton variant="text" className="skeletonInput" />
                      )}
                    </div>
                  ))}
                  <div
                    className="Divbutton"
                    onClick={() => {
                      handleUpdateAdmin();
                    }}
                  >
                    Save
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bottomHotel">
              <div className="left">
                <p>
                  <span>Images</span>
                </p>
                <div className="container">
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
                      {hotel?.id ? (
                        <input
                          type={input.type}
                          id={input.id_input}
                          placeholder={input.placeholder}
                          value={hotel[input.id_input] || ""}
                          disabled={input.disabled}
                          onChange={(e) => {
                            setHotel({
                              ...hotel,
                              [input.id_input]: e.target.value,
                            });
                          }}
                        />
                      ) : (
                        <Skeleton variant="text" className="skeletonInput" />
                      )}
                    </div>
                  ))}
                  <div
                    className="Divbutton"
                    onClick={() => {
                      handleUpdateHotel();
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

export default Single;
