import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useState, useEffect } from "react";
import Axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { yellow } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Swal from "sweetalert2";

function Mechanic() {
  const [MechList, setMechlist] = useState([]);

  useEffect(() => {
    getDatas();
  });

  const deleteMechlist = (mech_id) => {
    Axios.delete(
      `http://localhost:3001/admin/manage/mechanics/delete/${mech_id}`
    ).then((response) => {
      setMechlist(
        MechList.filter((val) => {
          return val.mech_id != mech_id;
        })
      );
    });
  };

  const getDatas = () => {
    Axios.get("http://localhost:3001/admin/manage/mechanics").then(
      (response) => {
        setMechlist(response.data);
      }
    );
  };
  return (
    <div>
      
      <Box
        component="form"
        sx={{
          margin: "3%",
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
        }}
        noValidate
        autoComplete="off"
      >
        <h1>ข้อมูลช่าง</h1>
        <div className="addbt-con">
          <Link to={"/admin/manage/mechanics/add"}>
            <Button
              style={{ width: "150px", height: "50px", margin: "10px" ,color:"white",backgroundColor:"#5C8374"}}
              variant="contained"
              startIcon={<AddRoundedIcon />}
            >
              เพิ่มข้อมูล
            </Button>
          </Link>
        </div>
      </Box>

      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>id:</TableCell>
                <TableCell align="center">ชื่อ:</TableCell>
                <TableCell align="center">เบอร์โทร:</TableCell>
                <TableCell align="center">ลบรายการ</TableCell>
                <TableCell align="center">แก้ไขรายการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MechList &&
                MechList.map((val) => (
                  <TableRow
                    key={val.mech_id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {val.mech_id}
                    </TableCell>
                    <TableCell align="center">{val.mech_name}</TableCell>
                    <TableCell align="center">{val.mech_phone}</TableCell>

                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          Swal.fire({
                            title: "คำเตือน",
                            text: "ต้องการลบข้อมูลนี้หรือไม่",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "ใช่ ต้องการลบ!",
                            cancelButtonText: "ยกเลิก",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              Swal.fire(
                                "Deleted!",
                                "ลบข้อมูลสำเร็จ",
                                "success"
                              );
                              deleteMechlist(val.mech_id);
                            }
                          });
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                    <Link to={`/admin/manage/mechanic/edit/${val.mech_id}`}>
                        <IconButton>
                          <EditIcon sx={{ color: "#93B1A6" }} />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default Mechanic;
