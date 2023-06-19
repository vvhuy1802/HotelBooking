import "./datatable.scss";
import { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import avatar from "../../assets/avatar.jpg";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { storage } from "../../configFirebase/config";
import { deleteObject, ref } from "firebase/storage";

import { GetImageUrl } from "../../functions/Global";
import { moneyAdapter, paymentAdapter } from "../../functions/Adapter";
import { DeleteHotel } from "../../middlewares/hotel";
import { DeleteAdmin } from "../../middlewares/admin";
import { setAnnouncementAuto, deleteData } from "../../redux/Slices/Global";

const Type = (type) => {
  return type === "app" ? "App" : type === "google" ? "Google" : "Facebook";
};

const handleColumnsUser = (navigate) => {
  return [
    { field: "id", headerName: "ID", width: 250 },
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
    { field: "email", headerName: "Email", width: 230 },
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
          // console.log(params.row);
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
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "name",
      headerName: "Name",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              src={params.row.avatar || avatar}
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
      width: 150,
    },
    { field: "country", headerName: "Country", width: 130 },
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

const handleColumnsHotel = (navigate) => {
  return [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "name",
      headerName: "Name",
      width: 210,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              src={params.row.image || avatar}
              alt="avatar"
              className="cellImg"
            />
            <span>{params.row.name}</span>
          </div>
        );
      },
    },
    {
      field: "room",
      headerName: "Rooms",
      width: 70,
      renderCell: (params) => {
        return (
          <div className="cellNumbeRoom">
            <span>{params.row.room}</span>
          </div>
        );
      },
    },
    {
      field: "address",
      headerName: "Address",
      width: 450,
    },
    {
      field: "isactive",
      headerName: "Active",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellWithActive">
            <span className={params.row.isactive ? "active" : "inactive"}>
              {params.row.isactive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        const handleView = () => {
          navigate(`/hotel/${params.row.id}`);
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

const handleColumnsBooking = (navigate) => {
  return [
    { field: "id", headerName: "Order ID", width: 135 },
    {
      field: "customer",
      headerName: "Customer",
      width: 175,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              src={params.row.image || avatar}
              alt="avatar"
              className="cellImg"
            />
            <span>{params.row.customer}</span>
          </div>
        );
      },
    },
    {
      field: "hotel",
      headerName: "Hotel",
      width: 100,
    },
    {
      field: "room",
      headerName: "Room",
      width: 160,
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row.room}</span>
          </div>
        );
      },
    },
    {
      field: "check_in",
      headerName: "Check in",
      width: 100,
    },
    {
      field: "check_out",
      headerName: "Check out",
      width: 100,
    },
    {
      field: "cost",
      headerName: "Cost",
      width: 100,
    },
    {
      field: "payment_method",
      headerName: "Payment",
      width: 100,
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (params) => {
        return (
          <span className={`status ${params.row.status}`}>
            {params.row.status}
          </span>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        const handleView = () => {
          navigate(`/booking/${params.row.id}`);
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

const DataTable = () => {
  const navigate = useNavigate();
  const {
    totalUser,
    totalHotel,
    totalAdmin,
    totalOrder,
    typeMoney,
    stateSidebar,
  } = useSelector((state) => state.global);

  var dataTitle = {};
  switch (stateSidebar) {
    case "Admin":
      dataTitle = {
        title: "Admins",
        path: "/admin/new",
      };
      break;
    case "Users":
      dataTitle = {
        title: "Users",
        path: "/user/new",
      };
      break;
    case "Hotels":
      dataTitle = {
        title: "Hotels",
        path: "/hotel/new",
      };
      break;
    case "Bookings":
      dataTitle = {
        title: "Bookings",
        path: "/hotel/new",
      };
      break;
    default:
      break;
  }

  const handleAddRowsUser = (totalUser) => {
    var rows = [];
    totalUser?.data?.users
      ?.map((user) =>
        rows.push({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone_number || "...",
          type_account: Type(user.type),
        })
      )
      .reverse();
    return rows;
  };

  const handleAddRowsAdmin = (totalAdmin) => {
    var rows = [];
    totalAdmin?.data?.admin.map(
      (admin) =>
        admin.roll !== "adminapp" &&
        rows.push({
          id: admin._id,
          name: admin.name,
          email: admin.email,
          country: admin.country || "Viet Nam",
          phone: admin.phone_number || "...",
          hotel: admin.dataHotel[0]?.name || "...",
          avatar: admin.avatar,
        })
    );
    return rows;
  };

  const handleAddRowsHotel = (totalHotel) => {
    var rows = [];
    totalHotel?.map((hotel) =>
      rows.push({
        id: hotel._id,
        name: hotel.name,
        isactive: hotel.isactive,
        room: hotel.rooms?.length,
        image: hotel.image[0],
        address: hotel.address,
      })
    );
    return rows;
  };

  const handleAddRowsBooking = useCallback(
    (totalOrder) => {
      const nameHotel = (id) => {
        if (id === "amishotel") {
          return "Amis Hotel";
        } else if (id === "raondalat") {
          return "Raon Dalat";
        } else if (id === "aaronhotel") {
          return "Aaron Hotel";
        } else if (id === "azuraresort") {
          return "Azura Resort";
        } else if (id === "maybungalow") {
          return "May Bungalow";
        } else return "No Data";
      };

      const formatDate = (date) => {
        const newDate = new Date(date);
        const day = newDate.getDate();
        const month = newDate.getMonth() + 1;
        const year = newDate.getFullYear();
        return `${day}/${month}/${year}`;
      };

      var rows = [];
      totalOrder?.data?.map((order) =>
        rows.push({
          id: order._id,
          customer: order.id_user.name,
          hotel: nameHotel(order.id_hotel),
          room: order.id_room.name,
          payment_method: paymentAdapter(order.payment_method),
          check_in: formatDate(order.check_in),
          check_out: formatDate(order.check_out),
          cost: moneyAdapter(order.total, typeMoney),
          status: order.status,
        })
      );

      rows.sort(function (a, b) {
        const dateA = a.check_in.split("/");
        const dateB = b.check_in.split("/");
        const newDateA = new Date(dateA[2], dateA[1] - 1, dateA[0]);
        const newDateB = new Date(dateB[2], dateB[1] - 1, dateB[0]);
        return newDateB - newDateA;
      });

      return rows;
    },
    [typeMoney]
  );

  const dispatch = useDispatch();
  const [selectionModel, setSelectionModel] = useState([]);
  const [rowss, setRowss] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    switch (stateSidebar) {
      case "Admin":
        setRowss(handleAddRowsAdmin(totalAdmin));
        break;
      case "Users":
        setRowss(handleAddRowsUser(totalUser));
        break;
      case "Hotels":
        setRowss(handleAddRowsHotel(totalHotel));
        break;
      case "Bookings":
        setRowss(handleAddRowsBooking(totalOrder));
        break;
      default:
        break;
    }
  }, [
    stateSidebar,
    totalAdmin,
    totalUser,
    totalHotel,
    totalOrder,
    typeMoney,
    handleAddRowsBooking,
  ]);
  const handleDeleteImageToFirebase = async (img) => {
    const path = GetImageUrl(img);
    const desertRef = ref(storage, `/${path}`);
    await deleteObject(desertRef)
      .then(() => {
        // console.log(`${path} deleted successfully`);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleDelete = () => {
    switch (stateSidebar) {
      case "Admin":
        selectionModel.map(async (id) => {
          const res = await DeleteAdmin(id);
          // console.log(res);
          if (res.status === 200) {
            //get this admin by id in totalAdmin
            const admin = totalAdmin?.data?.admin?.find(
              (admin) => admin._id === id
            );
            //delete image avatar in firebase
            if (admin?.avatar) {
              handleDeleteImageToFirebase(admin.avatar);
            }

            dispatch(
              deleteData({
                id: id,
                type: "admin",
              })
            );
          } else {
            dispatch(
              setAnnouncementAuto({
                message: `Delete admin fail ${id}`,
                type: "error",
              })
            );
            return;
          }

          if (selectionModel[selectionModel?.length - 1] === id) {
            dispatch(
              setAnnouncementAuto({
                message: `Delete admin success`,
                type: "success",
              })
            );
          }
        });
        break;
      case "Users":
        break;
      case "Hotels":
        selectionModel.map(async (id) => {
          const res = await DeleteHotel(id);
          if (res.status === 200) {
            //get this hotel by id in totalHotel
            const hotel = totalHotel?.find((hotel) => hotel._id === id);
            //delete image in firebase
            if (hotel?.image?.length > 0) {
              for (let i = 0; i < hotel.image?.length; ) {
                await handleDeleteImageToFirebase(hotel.image[i]);
                i++;
              }
            }
            dispatch(
              deleteData({
                id: id,
                type: "hotel",
              })
            );
          } else {
            dispatch(
              setAnnouncementAuto({
                message: `Delete hotel fail ${id}`,
                type: "error",
              })
            );
            return;
          }

          if (selectionModel[selectionModel.length - 1] === id) {
            dispatch(
              setAnnouncementAuto({
                message: `Delete hotel success`,
                type: "success",
              })
            );
          }
        });

        break;
      case "Bookings":
        break;
      default:
        break;
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {dataTitle.title}
        {stateSidebar !== "Users" && stateSidebar !== "Bookings" && (
          <Link
            to={dataTitle.path}
            style={{ textDecoration: "none" }}
            className="link"
          >
            Add new
          </Link>
        )}
      </div>
      {(stateSidebar === "Admin" && totalAdmin?.length === 0) ||
      (stateSidebar === "Users" && totalUser?.length === 0) ||
      (stateSidebar === "Hotels" && totalHotel?.length === 0) ||
      (stateSidebar === "Bookings" && totalOrder?.length === 0) ? (
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
          rows={rowss}
          columns={
            stateSidebar === "Admin"
              ? handleColumnsAdmin(navigate)
              : stateSidebar === "Users"
              ? handleColumnsUser(navigate)
              : stateSidebar === "Bookings"
              ? handleColumnsBooking(navigate)
              : handleColumnsHotel(navigate)
          }
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableVirtualization
          disableDensitySelector
          disableColumnSelector
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          disableColumnFilter
          disableSelectionOnClick
          onRowSelectionModelChange={(e) => {
            setSelectionModel(e);
          }}
        />
      )}
      {selectionModel?.length > 0 && (
        <div
          className="delete"
          onClick={() => {
            handleDelete();
          }}
        >
          Delete
        </div>
      )}
    </div>
  );
};

export default DataTable;
