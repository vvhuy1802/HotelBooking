import { useState, useEffect } from "react";
import "./databooking.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import avatar from "../../../assets/avatar.jpg";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";



const DataBooking = (props) => {
  const { data } = props;
  const navigate = useNavigate();
  const { stateSidebar } = useSelector((state) => state.global);
  const [selectionModel, setSelectionModel] = useState([]);

  const handleColumnsBooking = () => {
    return [
      { field: "id", headerName: "ID", width: 170 },
      { field: "customer", headerName: "Customer", width: 110 },
      {
        field: "room_name",
        headerName: "Room",
        width: 260,
        renderCell: (params) => {
          return (
            <div className="cellWithImg">
              <img
                src={params.row.image || avatar}
                alt="avatar"
                className="cellImg"
              />
               <span>{params.row.room_name}</span>
            </div>
          );
        },
      },
      { field: "check_in", headerName: "Check In", width: 200 },
      {
        field: "check_out",
        headerName: "Check Out",
        width: 200,
      },
      { field: "cost", headerName: "Cost", width: 170 },
      { field: "payment_method",
       headerName: "Payment Method",
        width: 200,
      },
      { field: "status",
       headerName: "Status",
        width: 170,
        renderCell: (params) => {
          return (
            <div>
               <span className={`status ${params.row.status}`}>{params.row.status}</span>
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
            navigate(`/listroom/${params.row.id}`);
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
  
  const paymentAdapter = (method) => {
    if (method === "payment-hotel") {
      return "Payment at hotel";
    } else if (method === "payment-online") {
      return "Payment online";
    }
  };

  const handleAddRowsBooking = () => {
    var rows = [];
    data.map((item) => {
      rows.push(
        {
          id: item._id,
          customer: item.id_user.name,
          room_name: item.id_room.name,
          cost: item.total,
          image: item.image,
          check_in: item.check_in,
          check_out: item.check_out,
          payment_method: paymentAdapter(item.payment_method),
          status: item.status,
        }
      )
    })
    return rows;
  };

  return (
    <div className="datatable">
      {stateSidebar === "rooms" && data.length===0 ? (
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
            stateSidebar === "Bookings"&&
              handleAddRowsBooking()
          }
          columns={
            stateSidebar === "Bookings"
              && handleColumnsBooking()
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

export default DataBooking;
