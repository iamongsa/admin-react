import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
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
import { Link } from "react-router-dom";

function Cars() {
  

  const [carList, setcarlist] = useState([]);

  useEffect(() => {
    getDatas();
  });

  const deleteCarlist = async (car_id) => {
    const response = await Axios.delete(
      `http://localhost:3001/admin/manage/car/delete/${car_id}`
    );

    setUserlist(
      userList.filter((val) => {
        return val.car_id != car_id;
      })
    );
  };

  const getDatas = () => {
    Axios.get("http://localhost:3001/admin/manage/cars").then((response) => {
      setcarlist(response.data);
    });
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
        <h1>ข้อมูลรถยนต์</h1>
        <div className="addbt-con">
          <Link to={"/admin/manage/car/add"}>
            <Button
              style={{ width: "150px", height: "50px", margin: "10px" ,color:"white",backgroundColor:"#5C8374" }}
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
                <TableCell>เลขทะเบียน:</TableCell>
                <TableCell align="right">ยี่ห้อ:</TableCell>
                <TableCell align="right">รุ่น:</TableCell>
                <TableCell align="right">หมายเลขตัวถัง:</TableCell>
                <TableCell align="center">ลบรายการ</TableCell>
                <TableCell align="center">แก้ไขรายการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carList &&
                carList.map((val) => (
                  <TableRow
                    key={val.car_id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {val.plate_license}
                    </TableCell>
                    <TableCell align="right">{val.make}</TableCell>
                    <TableCell align="right">{val.model}</TableCell>
                    <TableCell align="right">{val.vin_number}</TableCell>
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
                              deleteCarlist(val.car_id);
                            }
                          });
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`/admin/manage/cars/edit/${val.car_id}`}>
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

export default Cars;
