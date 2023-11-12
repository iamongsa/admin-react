import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditUser() {
  const { cus_id } = useParams();
  const [Name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line_id, setLineid] = useState("");
  const [address, setAddress] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/admin/manage/users/update/" + cus_id)
      .then((res) => {
        console.log(res);
        setName(res.data[0].name);
        setPhone(res.data[0].phone);
        setLineid(res.data[0].line_id);
        setAddress(res.data[0].address);
      })
      .catch((err) => console.log(err));
  }, []);

  const UpdateData = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3001/admin/manage/users/edit/" + cus_id, {
        Name,
        phone,
        line_id,
        address,
      })
      .then((response) => {
        alert("แก้ไขข้อมูลสำเร็จ");
        nav(-1);
        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h2 className="text-head-center">แก้ไขข้อมูลลูกค้า</h2>
      <div className="bg-con">
        <Box
          component="form"
          sx={{
            margin: "3%",
            flexDirection: "column",
            display: "flex",
            justifyContent: "center",
          }}
          onSubmit={UpdateData}
        >
          <TextField
            style={{ width: "400px", margin: "10px" }}
            margin="dense"
            id="outlined-required"
            placeholder="ชื่อลูกค้า"
            value={Name}
            label="ชื่อลูกค้า"
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            style={{ width: "400px", margin: "10px" }}
            margin="dense"
            id="outlined-required"
            placeholder="เบอร์โทร"
            value={phone}
            label="เบอร์โทร"
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            style={{ width: "400px", margin: "10px" }}
            id="outlined-required"
            label="Line ID"
            placeholder="Line Id"
            value={line_id}
            onChange={(e) => setLineid(e.target.value)}
          />
          <TextField
            style={{ width: "400px", margin: "10px" }}
            id="outlined-multiline-static"
            placeholder="ที่อยู่"
            multiline
            rows={4}
            label="ที่อยู่"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              sx={{ backgroundColor: "#93B1A6" }}
              variant="contained"
              color="error"
              size="medium"
              style={{ width: "150px", height: "50px", margin: "30px" }}
              onClick={() => {
                Swal.fire({
                  title: "คำเตือน",
                  text: "ต้องการยกเลิกหรือไม่",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "ใช่ ต้องการ!",
                  cancelButtonText: "ยกเลิก",
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire("ยกเลิกสำเร็จ");
                    nav(-1);
                  }
                });
              }}
            >
              ยกเลิก
            </Button>
            <Button
              Button
              sx={{ backgroundColor: "#183D3D" }}
              variant="contained"
              color="success"
              size="medium"
              type="submit"
              style={{ width: "150px", height: "50px", margin: "30px" }}
            >
              ยืนยัน
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default EditUser;
