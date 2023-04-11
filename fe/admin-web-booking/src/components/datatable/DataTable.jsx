import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
const columns = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "name", headerName: "Name", width: 170 },
  { field: "email", headerName: "Email", width: 170 },
  {
    field: "phone",
    headerName: "Phone Number",
    type: "number",
    width: 170,
  },
  { field: "type_account", headerName: "Type Account", width: 170 },
];



const handleAddRows = (totalUser) => {
  var rows = [];
  totalUser.data.users.map((user) => (
    rows.push({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone_number,
      type_account: user.type,
    })
  ));
  return rows;
};

const DataTable = () => {
  const { totalUser } = useSelector((state) => state.global);
  return (
    <div className="datatable">
      <DataGrid
        rows={handleAddRows(totalUser)}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
};

export default DataTable;
