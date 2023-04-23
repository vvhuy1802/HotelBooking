import { useState } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import avatar from "../../assets/avatar.jpg";
import { useNavigate } from "react-router-dom";

const Type = (type) => {
  return type === "app" ? "App" : type === "google" ? "Google" : "Facebook";
};

const handleColumnsUser = (navigate) => {
  return [
    { field: "id", headerName: "ID", width: 170 },
    {
      field: "name",
      headerName: "Name",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              src={params.row.img || avatar}
              alt="avatar"
              className="cellImg"
            />
            <span>{params.row.name}</span>
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "phone",
      headerName: "Phone Number",
      width: 200,
    },
    { field: "type_account", headerName: "Type Account", width: 170 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        const handleEdit = () => {
          navigate(`/user/${params.row.id}`);
        };
        return (
          <div className="action">
            <div
              className="btnEdit"
              onClick={() => {
                handleEdit();
              }}
            >
              View
            </div>
          </div>
        );
      },
    },
  ];
};

const handleAddRowsUser = (totalUser) => {
  var rows = [];
  totalUser?.data?.users?.map((user) =>
    rows.push({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone_number || "...",
      type_account: Type(user.type),
    })
  );
  return rows;
};

const handleColumnsApp = (navigate) => {
  return [
    { field: "id", headerName: "ID", width: 170 },
    {
      field: "name",
      headerName: "Name",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              src={params.row.img || avatar}
              alt="avatar"
              className="cellImg"
            />
            <span>{params.row.name}</span>
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "phone",
      headerName: "Phone Number",
      width: 200,
    },
    { field: "type_account", headerName: "Type Account", width: 170 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        const handleEdit = () => {
          navigate(`/user/${params.row.id}`);
        };
        return (
          <div className="action">
            <div
              className="btnEdit"
              onClick={() => {
                handleEdit();
              }}
            >
              View
            </div>
          </div>
        );
      },
    },
  ];
};

const handleAddRowsApp = (totalApp) => {};

const DataTable = () => {
  const navigate = useNavigate();
  const { totalUser, stateSidebar } = useSelector((state) => state.global);
  const [selectionModel, setSelectionModel] = useState([]);
  return (
    <div className="datatable">
      <DataGrid
        rows={handleAddRowsUser(totalUser)}
        columns={handleColumnsUser(navigate)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableVirtualization
        disableDensitySelector
        disableColumnMenu
        disableColumnSelector
        onRowSelectionModelChange={(e) => {
          setSelectionModel(e);
        }}
      />
      {selectionModel?.length > 0 && <div className="delete">Delete</div>}
    </div>
  );
};

export default DataTable;
