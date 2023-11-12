import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Box, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import axios from "axios";


function form() {
  const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState("");
  const [mechanic, setMech] = useState("");
  const [TStatus, setTstatus] = useState("");
  const [description, setDescription] = useState("");
  const [estimate_time,setEstimateTime] =useState("");

  const addDatas = () => {
    axios.post("http://localhost:3001/form", {
      customer_phone: phone,
      plate_id: plate,
      mech_name: mechanic,
      repair_status: TStatus,
      order_description: description,
      estimate_time:estimate_time,
    }).then(()=>{
      alert('เพิ่มข้อมูลสำเร็จ');
    });
  };

  return (
    <div>
      <Box component="form" onSubmit={addDatas}>
        <div className="bg-con">
          <Box
            sx={{
              margin: "0",
              flexDirection: "column",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <h2>ข้อมูลลูกค้า</h2>
            <TextField
              required
              style={{ width: "500px", margin: "2%" }}
              margin="2%"
              id="outlined-required"
              label="เบอร์โทรศัพท์ลูกค้า"
              placeholder="เบอร์โทรศัพท์ลูกค้า"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />

            <h2>ข้อมูลรถยนต์</h2>
            <TextField
              required
              style={{ width: "100%", margin: "2%" }}
              margin="dense"
              id="outlined-required"
              label="ป้ายทะเบียน"
              placeholder="ป้ายทะเบียน"
              onChange={(e) => {
                setPlate(e.target.value);
              }}
            />

            <h2>ข้อมูลช่าง</h2>
            <FormControl fullWidth>
              <InputLabel id="name-repairman">ช่างซ่อม</InputLabel>
              <Select
                labelId="name-repairman"
                label="ช่างซ่อม"
                placeholder="ช่างซ่อม"
                style={{ width: "100%", margin: "2%" }}
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
                
              </Select>
            </FormControl>
            <TextField
              style={{ width: "100%", margin: "2%" }}
              id="outlined-multiline-static"
              label="รายละเอียด"
              multiline
              rows={4}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />

            <h2>วันที่คาดว่าจะเสร็จ</h2>
            <TextField
              style={{ width: "100%", margin: "2%" }}
              
              id="date"
              type="date"
              onChange={(e) => {
                setEstimateTime(e.target.value);
              }}
            />

            <Box sx={{ display:"flex",justifyContent:"center"}}>
            <Button sx={{ backgroundColor: "#183D3D", display:"flex",justifyContent:"center",alignItems:"center"}}
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
          
          
        </div>


      </Box>
    </div>
);
}

export default form;
