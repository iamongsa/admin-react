import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function EditMech() {
  const { mech_id } = useParams();
  const [mech_name, setMech_name] = useState("");
  const [mech_phone, setMech_phone] = useState("");
  

  const nav = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/admin/manage/mechanic/update/" + mech_id)
      .then((res) => {
        console.log(res);
        setMech_name(res.data[0].mech_name);
        setMech_phone(res.data[0].mech_phone);
        
        
      })
      .catch((err) => console.log(err));
  }, []);


  const UpdateData = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3001/admin/manage/mechanic/edit/" + mech_id, {
        mech_name,
        mech_phone,
        
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
      <h2 className="text-head-center">แก้ไขข้อมูลช่าง</h2>
      <div className="bg-con">
        <Box component="form" 
        sx={{
          margin: "3%",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
        }}
        onSubmit={UpdateData}>
          <TextField
            style={{ width: "400px", margin: "10px" }}
            margin="dense"
            id="outlined-required"
            placeholder="เลขทะเบียน"
            value={mech_name}
            label="เลขทะเบียน"
            onChange={(e) => setMech_name(e.target.value)}
          />

          <TextField
            style={{ width: "400px", margin: "10px" }}
            margin="dense"
            id="outlined-required"
            placeholder="ยี่ห้อ"
            value={mech_phone}
            label="ยี่ห้อ"
            onChange={(e) => setMech_phone(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button  sx={{ backgroundColor: "#93B1A6" }}
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
          <Button sx={{ backgroundColor: "#183D3D" }}
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

export default EditMech;