import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
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

function Users() {
  const [userList, setUserlist] = useState([]);

  useEffect(() => {
    getEmployees();
  });

  const deleteUserslist = async (cus_id) => {
    const response = await Axios.delete(
      `http://localhost:3001/admin/manage/users/delete/${cus_id}`
    );

    setUserlist(
      userList.filter((val) => {
        return val.cus_id != cus_id;
      })
    );
  };

  const getEmployees = () => {
    Axios.get("http://localhost:3001/admin/manage/users").then((response) => {
      setUserlist(response.data);
    });
  };

  return (
    <>
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
        ><h1>ข้อมูลลูกค้า</h1>
          <div className="addbt-con" >
            <Link to={"/admin/manage/user/add"}>
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
            <Table sx={{ Width: "80%" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ชื่อลูกค้า:</TableCell>
                  <TableCell align="center">เบอร์โทร:</TableCell>
                  <TableCell align="center">LINE ID:</TableCell>
                  <TableCell align="center">ที่อยู่:</TableCell>
                  <TableCell align="center">ลบรายการ</TableCell>
                  <TableCell align="center">แก้ไขรายการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList &&
                  userList.map((val) => (
                    <TableRow
                      key={val.cus_id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {val.name}
                      </TableCell>
                      <TableCell align="center">{val.phone}</TableCell>
                      <TableCell align="center">{val.line_id}</TableCell>
                      <TableCell align="center">{val.address}</TableCell>
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
                                deleteUserslist(val.cus_id);
                              }
                            });
                          }}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        {/* //////////////ปุ่ม edit//////////////// */}
                        <Link to={`/admin/manage/users/edit/${val.cus_id}`}>
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
    </>
  );
}

export default Users;
