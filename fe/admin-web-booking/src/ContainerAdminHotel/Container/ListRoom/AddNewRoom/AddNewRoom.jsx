import React, { useState } from "react";
import "./addnewroom.scss";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Select from "react-select";
import Switch from "../../../Components/Switch/Switch";
import { AddNewRoomInHotel } from "./apiAddNewRoom";
import { useSelector } from "react-redux";

const AddNewRoom = ({ title, inputs }) => {
  const [file, setFile] = useState(null);
  const {userInfo}=useSelector(state=>state.global)
  const [formData, setFormData] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [uti, setUti] = useState([]);
  const [value, setValue] = useState(false);
  const [listImage, setListImage] = useState([]);
  const options = [
    { value: "Internet Explorer", label: "Internet Explorer" },
    { value: "Firefox", label: "Firefox" },
    { value: "Google Chrome", label: "Google Chrome" },
    { value: "Opera", label: "Opera" },
    { value: "Safari", label: "Safari" },
  ];

  const handleChange = (selectedOptions) => {
    let dataUti=selectedOptions.map(item=>item.value);
    setUti(dataUti);
    setSelectedOptions(selectedOptions);
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

  const handleChangeInput = (e) => {
    const { id, value } = e.target;
    if(id==="price"){
      let price=parseInt(value);
      setFormData({ ...formData, [id]: price });
    }
    else {
    setFormData({ ...formData, [id]: value });
    }
  };

  const handleDeleteImage = (id) => {
    const listImageTemp = [...listImage];
    const index = listImageTemp.findIndex((item) => item.id === id);
    listImageTemp.splice(index, 1);
    setListImage(listImageTemp);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const data={...formData,image:listImage,isactive:value,utility:uti,tag:[]}
    console.log(data);
    const res = await AddNewRoomInHotel(data);
  }

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
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    id={input.id_input}
                    value={input.id_input!=="hotel_id"?(formData[input.id_input] || ''):userInfo.idHotel}
                    placeholder={input.placeholder}
                    onChange={handleChangeInput}
                  />
                </div>
              ))}
              <Select
                className="selectStyle"
                options={options}
                isMulti
                value={selectedOptions}
                onChange={handleChange}
              />
              <div className="switchStyle">
                <span className="spanStyle">Active</span>
              <Switch
              isOn={value}
              handleToggle={() => setValue(!value)}
              />
              </div>
              <button className="buttonSave">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewRoom;
