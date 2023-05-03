import React, { useEffect, useState } from "react";
import "./addnewroom.scss";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Select from "react-select";
import Switch from "../../../Components/Switch/Switch";
import { AddNewRoomInHotel } from "./apiAddNewRoom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storage } from "../../../../configFirebase/config";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

const AddNewRoom = ({ title, inputs }) => {
  const navigate=useNavigate();
  const [file, setFile] = useState(null);
  const {userInfo}=useSelector(state=>state.global)
  const [formData, setFormData] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [uti, setUti] = useState([]);
  const [value, setValue] = useState(false);
  const [listImage, setListImage] = useState([]);
  let options = [
    { value: "Bồn tắm", label: "Bồn tắm" },
    { value: "Bếp riêng", label: "Bếp riêng" },
    { value: "Nhìn ra hồ", label: "Nhìn ra hồ" },
    { value: "Nhìn ra thành phố", label: "Nhìn ra thành phố" },
    { value: "Nhìn ra sông", label: "Nhìn ra sông" },
    { value: "TV màn hình phẳng", label: "TV màn hình phẳng" },
    { value: "Hệ thống cách âm", label: "Hệ thống cách âm" },
    { value: "Wifi miễn phí", label: "Wifi miễn phí" },
    { value: "Ban công", label: "Ban công" },
    { value: "Tầm nhìn ra khung cảnh", label: "Tầm nhìn ra khung cảnh" },
    {
      value: "Phòng tắm riêng trong phòng",
      label: "Phòng tắm riêng trong phòng",
    },
    { value: "Điều hòa không khí", label: "Điều hòa không khí" },
    { value: "Sân hiên", label: "Sân hiên" },
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
      const storageRef = ref(storage, `/${userInfo.idHotel}/${file[i].name}`);
      uploadBytes(storageRef, file[i]).then((snapshot) => {
        const pathReference = ref(storage, `/${userInfo.idHotel}/${file[i].name}`);
        getDownloadURL(pathReference).then((url) => {
          listImageTemp.push(url);
          setListImage(listImageTemp);
        });
      });
    }
    // 'file' comes from the Blob or File API
  };

  useEffect(() => {
    setFormData({ ...formData, hotel_id: userInfo.idHotel });
  }, []);

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

  const handleDeleteImage = (img) => {
    const listImageTemp = [...listImage];
    const index = listImageTemp.findIndex((item) => item === img);
    var fileName = img.substring(img.lastIndexOf('/') + 1, img.indexOf('?'));
    var filetrue=fileName.split("%2F")[1];
    const desertRef = ref(storage, `/${userInfo.idHotel}/${filetrue}`);
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
    listImageTemp.splice(index, 1);
    setListImage(listImageTemp);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const data={...formData,image:listImage,isactive:value,utility:uti,tag:[]}
    const res = await AddNewRoomInHotel(data);
    navigate("/listroom");
  }

  return (
    <div className="new">
      <div className="container">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <div className="listImageContainer">
              <div className="content">
                {listImage.map((img) => (
                  <div className="item">
                    <img src={img} alt="" className="imgList" />
                    <ClearOutlinedIcon
                      onClick={() => {
                        handleDeleteImage(img);
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
