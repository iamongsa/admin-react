import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Box, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import buddhistEra from "dayjs/plugin/buddhistEra";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import TableEdit_order from "../../Componets/TableEdit/TableEdit_order";

dayjs.extend(buddhistEra);

const DateLongTH = (date) => {
  dayjs.locale("th"); // ตั้งค่าภาษาเป็นภาษาไทย

  return dayjs(date).format("DD/MM/BBBB");
};

function EditOrder() {
  const { order_id } = useParams();
  const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState("");
  const [mech_name, setMech] = useState("");
  const [repair_status, setTstatus] = useState("");
  const [order_description, setDescription] = useState("");
  const [estimate_time, setEstimateTime] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:3001/admin/update/" + order_id)
      .then((res) => {
        console.log(res);
        setPhone(res.data[0].phone);
        setPlate(res.data[0].plate_license);
        setMech(res.data[0].mech_name);
        setTstatus(res.data[0].status_name);
        setDescription(res.data[0].description);
        setEstimateTime(res.data[0].estimate_time);
      })
      .catch((err) => console.log(err));
  }, []);

  const nav = useNavigate();

  const sendNotification = async (status,phone,estimate_time) => {
    try {
      await axios.post('http://localhost:3001/send-notification',{status:status,phone:phone,estimate_time:estimate_time});
      
    } catch (error) {
      console.error('Error sending notification:', error);
    }
}
const UpdateData = (e) => {
  e.preventDefault();
  axios
    .put("http://localhost:3001/admin/edit/" + order_id, {
      mech_name,
      repair_status,
      order_description,
      estimate_time,
    })
    .then((response) => {
      
      alert("แก้ไขข้อมูลสำเร็จ");
      nav(-1);
      
      const formatjson = JSON.parse(response?.config?.data)
      
      sendNotification(formatjson?.repair_status,phone,estimate_time)

    })
    .catch((error) => {
      console.log(error);
    });
};

  const Canceledit = () => {
    nav(-1);
  };

  return (
    <>
      <div>
        <Box component="form" onSubmit={UpdateData}>
          <div className="bg-con">
            <Box
              sx={{
                margin: "3%",
                flexDirection: "column",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <h2>ข้อมูลลูกค้า</h2>
              <TextField
                disabled
                style={{ width: "500px", margin: "2%" }}
                margin="2%"
                id="outlined-required"
                label="เบอร์โทรศัพท์ลูกค้า"
                placeholder="เบอร์โทรศัพท์ลูกค้า"
                value={phone}
              />

              <h2>ข้อมูลรถยนต์</h2>
              <TextField
                disabled
                style={{ width: "100%", margin: "2%" }}
                margin="dense"
                id="outlined-required"
                label="ป้ายทะเบียน"
                placeholder="ป้ายทะเบียน"
                value={plate}
              />

              <h2>ข้อมูลช่าง</h2>
              <FormControl fullWidth>
                <InputLabel id="name-repairman">ช่างซ่อม</InputLabel>
                <Select
                  labelId="name-repairman"
                  label="ช่างซ่อม"
                  placeholder="ช่างซ่อม"
                  style={{ width: "100%", margin: "2%" }}
                  value={mech_name}
                  onChange={(e) => {
                    setMech(e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="ช่างบิ๊ก">
                    <em>ช่างบิ๊ก</em>
                  </MenuItem>
                  <MenuItem value="ช่างซี่">
                    <em>ช่างซี่</em>
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="status">สถานะ</InputLabel>
                <Select
                  labelId="status"
                  label="สถานะ"
                  placeholder="สถานะ"
                  style={{ width: "100%", margin: "2%" }}
                  value={repair_status}
                  onChange={(e) => {
                    setTstatus(e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="รับรถเข้าอู่">
                    <em>รับรถเข้าอู่</em>
                  </MenuItem>
                  <MenuItem value="กำลังดำเนินการซ่อม">
                    <em>กำลังดำเนินการซ่อม</em>
                  </MenuItem>
                  <MenuItem value="ดำเนินการซ่อมเสร็จสิ้น">
                    <em>ดำเนินการซ่อมเสร็จสิ้น</em>
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                style={{ width: "100%", margin: "2%" }}
                id="outlined-multiline-static"
                label="รายละเอียด"
                multiline
                rows={4}
                value={order_description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />

              <h2>วันที่คาดว่าจะเสร็จ</h2>
              <TextField
                disabled
                style={{ width: "100%", margin: "2%" }}
                id="outlined-required"
                value={DateLongTH(estimate_time)}
              />
              <TextField
                style={{ width: "100%", margin: "2%" }}
                id="date"
                type="date"
                value={estimate_time}
                onChange={(e) => {
                  setEstimateTime(e.target.value);
                }}
              />
            </Box>
          </div>
          <Box sx={{ display:"flex",justifyContent:"center" }}>
          <Button
            sx={{ backgroundColor: "#93B1A6" }}
            variant="contained"
            color="error"
            size="medium"
            style={{ width: "150px", height: "50px", margin: "30px" }}
            onClick={() => {
              Swal.fire({
                title: "คำเตือน",
                text: "ต้องการยกเลิกใช่หรือไม่",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "ใช่ ต้องการ",
                cancelButtonText: "ยกเลิก",
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire("ยกเลิกสำเร็จ");
                  Canceledit();
                }
              });
            }}
          >
            ยกเลิก
          </Button>
          <Button
            sx={{ backgroundColor: "#183D3D" }}
            variant="contained"
            color="success"
            size="medium"
            style={{ width: "150px", height: "50px", margin: "30px" }}
            type="submit"
          >
            ยืนยัน
          </Button>
          </Box>
        </Box>

        <TableEdit_order/>
      </div>
    </>
  );
}

export default EditOrder;
