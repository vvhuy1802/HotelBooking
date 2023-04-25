import { useState, useEffect } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import avatar from "../../assets/avatar.jpg";
import { useNavigate } from "react-router-dom";
import { GetAllAdmins } from "../../middlewares/admin";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

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
        const handleView = () => {
          navigate(`/user/${params.row.id}`);
        };
        return (
          <div className="action">
            <div
              className="btnEdit"
              onClick={() => {
                handleView();
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

const handleColumnsAdmin = (navigate) => {
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
    { field: "hotel", headerName: "Hotel", width: 170 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        const handleView = () => {
          navigate(`/admin/${params.row.id}`);
        };
        return (
          <div className="action">
            <div
              className="btnEdit"
              onClick={() => {
                handleView();
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

const handleAddRowsAdmin = (dataAdmin) => {
  var rows = [];
  dataAdmin?.map(
    (admin) =>
      admin.roll !== "adminapp" &&
      rows.push({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone_number || "...",
        hotel: admin.dataHotel[0]?.name || "...",
      })
  );
  return rows;
};

const DataTable = () => {
  const navigate = useNavigate();
  const { totalUser, stateSidebar } = useSelector((state) => state.global);
  const [selectionModel, setSelectionModel] = useState([]);
  const [dataAdmin, setDataAdmin] = useState([]);

  useEffect(() => {
    GetAllAdmins().then((res) => {
      setDataAdmin(res.data.data.admin);
    });
  }, []);

  return (
    <div className="datatable">
      {stateSidebar === "Admin" && dataAdmin.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={
            stateSidebar === "Admin"
              ? handleAddRowsAdmin(dataAdmin)
              : handleAddRowsUser(totalUser)
          }
          columns={
            stateSidebar === "Admin"
              ? handleColumnsAdmin(navigate)
              : handleColumnsUser(navigate)
          }
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
      )}
      {selectionModel?.length > 0 && <div className="delete">Delete</div>}
    </div>
  );
};

export default DataTable;
