import React, { useEffect, useState } from "react";
import "../TableEdit/Table.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { Box, Button, IconButton, NativeSelect } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import Swal from "sweetalert2";

dayjs.extend(buddhistEra);

const DateLongTH = (date) => {
  dayjs.locale("th"); // ตั้งค่าภาษาเป็นภาษาไทย

  return dayjs(date).format("DD/MM/BBBB");
};

function TableEdit_order() {
  const { order_id } = useParams();
  const [des_detail, setDetail] = useState("");
  const [estimate_price, setPrice] = useState("");
  const [update_status, setStatus] = useState("");

  const [DetailList, setDetailList] = useState([]);
  const [getDetailId, setGetDetailId] = useState([]);
  const [totalEstimatePrice, setTotalEstimatePrice] = useState(0);

  const deleteDetaillist = (order_detail_id) => {
    axios
      .delete(`http://localhost:3001/deleteDetail_list/${order_detail_id}`)
      .then((response) => {
        // อัพเดทรายการรวมราคาประเมินก่อนลบรายการซ่อม
        const deletedDetail = DetailList.find(
          (detail) => detail.order_detail_id === order_detail_id
        );
        if (deletedDetail) {
          setTotalEstimatePrice(
            totalEstimatePrice - parseFloat(deletedDetail.estimate_price)
          );
        }

        // ลบรายการซ่อมจาก DetailList
        setDetailList(
          DetailList.filter((val) => val.order_detail_id !== order_detail_id)
        );
      });
  };

  const addData = () => {
    axios
      .post("http://localhost:3001/addOrderDetail/" + order_id, {
        des_detail: des_detail,
        estimate_price: estimate_price,
        update_status: update_status,
      })
      .then(() => {
        alert("เพิ่มข้อมูลรายละเอียดสำเร็จ");
        setTotalEstimatePrice(totalEstimatePrice + parseFloat(estimate_price));
      });
  };

  // โหลดรายการซ่อมเมื่อหน้าเว็บโหลด
  useEffect(() => {
    getDatas(); // เรียกใช้ getDatas เพื่อโหลดรายการซ่อม
  }, [order_id]); // เมื่อ order_id เปลี่ยนค่า

  // โหลดรายการซ่อมจากเซิร์ฟเวอร์
  const getDatas = () => {
    axios
      .get("http://localhost:3001/getOrder_detail/" + order_id)
      .then((response) => {
        setDetailList(response.data);
        // เมื่อโหลดข้อมูลรายการซ่อมสำเร็จแล้วอัพเดทรายการรวมราคาประเมิน
        const total = response.data.reduce(
          (acc, detail) => acc + parseFloat(detail.estimate_price),
          0
        );
        setTotalEstimatePrice(total);
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลรายการซ่อม:", error);
      });
  };

  const getOrderDetail_id = (order_detail_id) => {
    axios
      .get("http://localhost:3001/getDetail_id/" + order_detail_id)
      .then((res) => {
        console.log(res.data);
        setGetDetailId(res.data[0]);
        setDetail(res.data[0].repair_description);
        setPrice(res.data[0].estimate_price);
        setStatus(res.data[0].status_update);
      });
  };

  const upDateOrderDetail = (order_detail_id) => {
    getOrderDetail_id(order_detail_id);
    axios
      .put("http://localhost:3001/getDetail_id/edit/" + order_detail_id, {
        des_detail,
        estimate_price,
        update_status,
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2>รายละเอียดของรายการซ่อม</h2>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <div className="con-select">
          <TextField
            required
            style={{ width: "300px", margin: "2%" }}
            margin="dense"
            id="outlined-required"
            placeholder="รายละเอียดการซ่อม"
            value={des_detail}
            onChange={(e) => setDetail(e.target.value)}
          />

          <TextField
            style={{ width: "300px", margin: "2%" }}
            margin="dense"
            id="outlined-required"
            placeholder="ราคาประเมิน"
            value={estimate_price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <FormControl sx={{ m: 1, minWidth: 250, margin: "2%" }}>
            <FormControl fullWidth>
              <InputLabel
                variant="standard"
                htmlFor="demo-customized-select-native"
              ></InputLabel>
              <NativeSelect
                id="demo-customized-select-native"
                value={update_status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">กรุณาเลือกสถานะการซ่อม</option>
                <option value="รออะไหล่">รออะไหล่</option>
                <option value="กำลังดำเนินการซ่อม">กำลังดำเนินการซ่อม</option>
                <option value="ดำเนินการซ่อมเสร็จสิ้น">
                  ดำเนินการซ่อมเสร็จสิ้น
                </option>
              </NativeSelect>
            </FormControl>
            {/* <InputLabel id="demo-simple-select-label">สถานะการซ่อม:</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="สถานะการซ่อม"
              value={getDetailId[0]?.status_update}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="รออะไหล่">รออะไหล่</MenuItem>
              <MenuItem value="กำลังดำเนินการซ่อม">กำลังดำเนินการซ่อม</MenuItem>
              <MenuItem value="ดำเนินการซ่อมเสร็จสิ้น">
                ดำเนินการซ่อมเสร็จสิ้น
              </MenuItem>
            </Select> */}
          </FormControl>

          <div className="bt-center">
            <Button
              sx={{ backgroundColor: "#183D3D" }}
              variant="contained"
              color={"success"}
              size="medium"
              style={{ width: "150px", height: "50px", margin: "2%" }}
              type="submit"
              startIcon={<AddRoundedIcon />}
              onClick={() => {
                if (getDetailId.length === 0) {
                  addData();
                } else {
                  upDateOrderDetail(getDetailId?.order_detail_id);
                }
              }}
            >
              {getDetailId.length === 0 ? "เพิ่มข้อมูล" : "บันทึกข้อมูล"}
            </Button>
          </div>
        </div>
      </Box>

      <Box>
        <div className="edit-table">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 1000 }} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">วันที่</TableCell>
                  <TableCell align="center">รายละเอียด</TableCell>
                  <TableCell align="center">สถานะ</TableCell>
                  <TableCell align="center">ราคาประเมิน</TableCell>
                  <TableCell align="center">แก้ไขรายการ</TableCell>
                  <TableCell align="center">ลบรายการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DetailList &&
                  DetailList.map((val) => (
                    <TableRow
                      key={val.order_id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {DateLongTH(val.update_date)}
                      </TableCell>
                      <TableCell align="center">
                        {val.repair_description}
                      </TableCell>
                      <TableCell align="center">{val.status_update}</TableCell>
                      <TableCell align="center">
                        {val.estimate_price} บาท
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => {
                            getOrderDetail_id(val.order_detail_id);
                          }}
                        >
                          <EditIcon sx={{ color: "#93B1A6" }} />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => {
                            Swal.fire({
                              title: "ตำเตือน",
                              text: "ต้องการลบข้อมูลนี้ใช่หรือไม่",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "ใช่ ต้องการลบ!",
                              cancelButtonText: "ยกเลิก",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                Swal.fire("ลบข้อมูลสำเร็จ", "success");
                                deleteDetaillist(val.order_detail_id);
                              }
                            });
                          }}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={2}>รวมราคาประเมิน:</TableCell>
                  <TableCell align="right">
                    {totalEstimatePrice.toFixed(2)} บาท
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </Box>
  );
}

export default TableEdit_order;
