import React, { useEffect, useState } from "react";
import WorkOffOutlinedIcon from "@mui/icons-material/WorkOffOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import WorkIcon from "@mui/icons-material/Work";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";

function Report_Mech() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [data, setData] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState("");
  const [repairData, setRepairData] = useState({
    totalInProgress: 0,
    totalCompleted: 0,
    totalWaiting: 0,
  });

  useEffect(() => {
    // หากมีการเปลี่ยนแปลงเดือนหรือปีหรือช่างที่เลือก
    // จะดึงข้อมูลใหม่
    if (selectedMonth || selectedYear || selectedMechanic) {
      fetchData();
    }
  }, [selectedMonth, selectedYear, selectedMechanic]);

  const fetchRepairData = async (mechanic_id) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/repairs/mechanic/${mechanic_id}`
      );
      const data = response.data;
      setRepairData(data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการร้องข้อมูล:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/repairs?month=${selectedMonth}&year=${selectedYear}&mechanic=${selectedMechanic}`
      );
      const data = response.data;
      setData(data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    }
  };
  const handleMechanicChange = (event) => {
    const selectedMechanic = event.target.value;
    setSelectedMechanic(selectedMechanic);

    // เรียก API เมื่อมีการเลือกช่าง
    if (selectedMechanic) {
      fetchRepairData(selectedMechanic);
      fetchData(selectedMechanic);
    } else {
      // ล้างข้อมูลหากไม่ได้เลือกช่าง
      setRepairData({
        totalInProgress: 0,
        totalCompleted: 0,
        totalWaiting: 0,
      });
    }
  };

  return (
    <div>
      <h1 className="head-center">Report</h1>
      <div className="bg-dt-report">
        <div className="select-data ">
          <FormControl sx={{ margin: 5, minWidth: "20%" }} size="small">
            <InputLabel id="demo-select-small-label">ช่างซ่อม:</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="ช่างซ่อม"
              value={selectedMechanic}
              onChange={handleMechanicChange}
            >
              <MenuItem value="">
                <em>ทั้งหมด</em>
              </MenuItem>
              <MenuItem value="1">ช่างบิ๊ก</MenuItem>
              <MenuItem value="2">ช่างซี่</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ margin: 5, minWidth: "20%" }} size="small">
            <InputLabel id="demo-select-small-label">เดือน:</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="เดือน"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="">
                <em>ทั้งหมด</em>
              </MenuItem>
              <MenuItem value="1">มกราคม</MenuItem>
              <MenuItem value="2">กุมภาพันธ์</MenuItem>
              <MenuItem value="3">มีนาคม</MenuItem>
              <MenuItem value="4">เมษายน</MenuItem>
              <MenuItem value="5">พฤษภาคม</MenuItem>
              <MenuItem value="6">มิถุนายน</MenuItem>
              <MenuItem value="7">กรกฎาคม</MenuItem>
              <MenuItem value="8">สิงหาคม</MenuItem>
              <MenuItem value="9">กันยายน</MenuItem>
              <MenuItem value="10">ตุลาคม</MenuItem>
              <MenuItem value="11">พฤศจิกายน</MenuItem>
              <MenuItem value="12">ธันวาคม</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ margin: 5, minWidth: "20%" }} size="small">
            <InputLabel id="demo-select-small-label">ปี:</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="ปี"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <MenuItem value="">
                <em>ทั้งหมด</em>
              </MenuItem>
              <MenuItem value="2023">2566</MenuItem>
              <MenuItem value="2024">2567</MenuItem>
            </Select>
          </FormControl>
          </div>
          <div className="data-report">
            <div className="head-dt">ดำเนินการซ่อมเสร็จสิ้น</div>
            <div className="con-dt">
              <div className="work-icon">
                <WorkOffOutlinedIcon  sx={{ fontSize: 50  , color: "#5C8374"}} />
              </div>
              <div className="dt-db"></div>
              <h1 className="dt-num">{repairData.totalCompleted}</h1>
            </div>
            <div className="head-dt">กำลังดำเนินการซ่อม</div>
            <div className="con-dt">
              <div className="work-icon">
                <WorkHistoryOutlinedIcon
                  sx={{ fontSize: 50  , color: "#5C8374"}}
                />
              </div>
              <div className="dt-db"></div>
              <h1 className="dt-num">{repairData.totalInProgress}</h1>
            </div>
            <div className="head-dt">รอรับรถเข้าอู่</div>
            <div className="con-dt">
              <div className="work-icon">
                <WorkOutlineOutlinedIcon
                  sx={{ fontSize: 50, color: "#5C8374" }}
                />
              </div>
              <div className="dt-db"></div>
              <h1 className="dt-num">{repairData.totalWaiting}</h1>
            </div>
            <div className="head-dt">จำนวนรายการซ่อมทั้งหมด</div>
            {data &&
              data.map((data, index) => (
                <div className="con-dt" key={index}>
                  <div className="work-icon">
                    <WorkIcon
                      color="warning"
                      sx={{ fontSize: 50 , color: "#5C8374" }}
                    />
                  </div>
                  <div className="dt-db"></div>
                  {data.total_repairs !== 0 && (
                    <h1 className="dt-num">{data.total_repairs}</h1>
                  )}
                </div>
              ))}
          </div>
        
      </div>
    </div>
  );
}

export default Report_Mech;
