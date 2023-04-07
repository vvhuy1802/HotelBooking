import React from "react";
import "./table.scss";
import avatar from "../../assets/avatar.jpg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
const ListTable = () => {
  const { totalOrder } = useSelector((state) => state.global);

  const paymentAdapter = (method) => {
    if (method === "payment-hotel") {
      return "Payment at hotel";
    } else if (method === "payment-online") {
      return "Payment online";
    }
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Order ID</TableCell>
            <TableCell className="tableCell">Customer</TableCell>
            <TableCell className="tableCell">Hotel</TableCell>
            <TableCell className="tableCell">Room</TableCell>
            <TableCell className="tableCell">Check In</TableCell>
            <TableCell className="tableCell">Check Out</TableCell>
            <TableCell className="tableCell">Cost</TableCell>
            <TableCell className="tableCell">Status</TableCell>
            <TableCell className="tableCell">Payment Method</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {totalOrder.data
            ?.map(
              (item, index) =>
                index < 5 && (
                  <TableRow key={item._id}>
                    <TableCell>{item._id}</TableCell>
                    <TableCell className="tableCell">
                      {item.id_user.name}
                    </TableCell>
                    <TableCell className="tableCell">
                      {nameHotel(item.id_hotel)}
                    </TableCell>
                    <TableCell className="tableCell">
                      <div className="cellWrapper">
                        <img src={avatar} alt="" className="cellImg" />
                        {item.id_room.name}
                      </div>
                    </TableCell>
                    <TableCell className="tableCell">
                      {formatDate(item.check_in)}
                    </TableCell>
                    <TableCell className="tableCell">
                      {formatDate(item.check_out)}
                    </TableCell>
                    <TableCell className="tableCell">{item.total}</TableCell>
                    <TableCell className="tableCell">
                      {paymentAdapter(item.payment_method)}
                    </TableCell>
                    <TableCell className="tableCell">
                      <span className={`status ${item.status}`}>
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                )
            )
            .reverse()}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListTable;
