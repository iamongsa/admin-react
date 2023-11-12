import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

function AddMech() {
  const [mech_name, setMech_name] = useState("");
  const [mech_phone, setMech_Phone] = useState("");
  

  const nav = useNavigate();
  

  const addData = () => {
    axios
      .post("http://localhost:3001/admin/manage/mechanic/add", {
        mech_name: mech_name,
        mech_phone: mech_phone,
        
      })
      .then(
        alert("เพิ่มข้อมูลสำเร็จ")
      );
  };

  return (
    <div>
      
      <Box component="form" onSubmit={addData}>
        <div className="bg-con">
        <Box
        sx={{
          margin: "3%",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h2 className="text-head-center " >เพิ่มข้อมูลช่าง</h2>
          <TextField
            required
            style={{ width: "500px", margin: "2%" }}
            margin="dense"
            id="outlined-required"
            label="ชื่อช่างซ่อม"
            placeholder="ชื่อช่างซ่อม"
            onChange={(e) => {
              setMech_name(e.target.value);
            }}
          />
          <TextField
            required
            style={{ width: "500px", margin: "2%" }}
            margin="dense"
            id="outlined-required"
            label="เบอร์โทรช่างซ่อม"
            placeholder="เบอร์โทรช่างซ่อม"
            onChange={(e) => {
              setMech_Phone(e.target.value);
            }}
          />
          
          <div className="con-btw">
            <Button sx={{ backgroundColor: "#93B1A6" }}
              variant="contained"
              color="error"
              size="medium"
              style={{ width: "150px", height: "50px", margin: "40px" }}
              onClick={() => {
                Swal.fire({
                  title: "คำเตือน",
                  text: "ต้องการยกเลิกการเพิ่มข้อมูลนี้หรือไม่",
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
              style={{ width: "150px", height: "50px", margin: "40px"}}
              type="submit"
            >
              ยืนยัน
            </Button>

            
          </div>
          </Box>
        </div>
      </Box>
    </div>
  );
}

export default AddMech;
