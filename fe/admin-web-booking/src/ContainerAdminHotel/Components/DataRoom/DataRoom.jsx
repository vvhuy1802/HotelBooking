import { useState, useEffect } from "react";
import "./dataroom.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import avatar from "../../../assets/avatar.jpg";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";


const DataRoom = (props) => {
  const { data } = props;
  const navigate = useNavigate();
  const {stateSidebar } = useSelector((state) => state.global);
  const [selectionModel, setSelectionModel] = useState([]);

  const handleColumnsRoom = () => {
    return [
      { field: "id", headerName: "ID", width: 170 },
      { field: "hotel_id", headerName: "Hotel ID", width: 110 },
      {
        field: "name",
        headerName: "Name",
        width: 260,
      },
      { field: "description", headerName: "Description", width: 200 },
      {
        field: "price",
        headerName: "Price",
        width: 200,
      },
      { field: "utility", headerName: "Utility", width: 170 },
      { field: "image",
       headerName: "Image",
        width: 170,
        renderCell: (params) => {
          return (
            <div className="cellWithImg">
              <img
                src={params.row.image || avatar}
                alt="avatar"
                className="cellImg"
              />
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
            navigate(`/listroom/${params.row.id}`,{
              state: {
                id: params.row.id,
                name: params.row.name,
                description: params.row.description,
                price: params.row.price,
                image: params.row.image,
                utility: params.row.utility,
                hotel_id: params.row.hotel_id,
                tag: params.row.tag,
              }
            });
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

  const handleAddRowsRoom = () => {
    var rows = [];
    data.map((item) => {
      rows.push(
        {
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          utility: item.utility,
          hotel_id: item.hotel_id,
          tag: item.tag,
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
            stateSidebar === "rooms"&&
              handleAddRowsRoom()
          }
          columns={
            stateSidebar === "rooms"
              && handleColumnsRoom()
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

export default DataRoom;
