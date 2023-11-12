import React from "react";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import WorkOffOutlinedIcon from "@mui/icons-material/WorkOffOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import Onprogress from "../Componets/Report_status/Onprogress";
import Onfinish from "../Componets/Report_status/Onfinish";
import CountOrderRepair from "../Componets/Report_status/CountOrderRepair";
import OnWaiting from "../Componets/Report_status/OnWaiting";
import WorkIcon from "@mui/icons-material/Work";
import Report_Mech from '../Componets/Report_mech/Report_Mech'
// import Button from "@mui/material/Button";

function Dashboard() {
 
  return (
    <div>
      <h1 className="head-center">Dashboard</h1>

      <div className="dashboard">
        <div className="bg-dt">
          <div className="head-dt">งานทั้งหมด</div>
          <div className="con-dt">
            <div className="work-icon">
              <WorkIcon
                color="warning"
                sx={{ fontSize: 50, color: "#5C8374" }}
              />
            </div>
            <div className="dt-db"></div>
            <h1 className="dt-num">
              <CountOrderRepair />
            </h1>
          </div>
        </div>

        <div className="bg-dt">
          <div className="head-dt">งานที่เสร็จแล้ว</div>
          <div className="con-dt">
            <div className="work-icon">
              <WorkOffOutlinedIcon  sx={{ fontSize: 50 , color: "#5C8374" }} />
            </div>
            <div className="dt-db"></div>
            <h1 className="dt-num">
              <Onfinish />
            </h1>
          </div>
        </div>

        <div className="bg-dt">
          <div className="head-dt">งานรอดำเนินการ</div>
          <div className="con-dt">
            <div className="work-icon">
              <WorkHistoryOutlinedIcon sx={{ fontSize: 50  , color: "#5C8374"}} />
            </div>
            <div className="dt-db"></div>
            <h1 className="dt-num">
              <Onprogress />
            </h1>
          </div>
        </div>

        <div className="bg-dt">
          <div className="head-dt">รับรถเข้าอู่</div>
          <div className="con-dt">
            <div className="work-icon">
              <WorkOutlineOutlinedIcon
                sx={{ fontSize: 50, color: "#5C8374" }}
              />
            </div>
            <div className="dt-db"></div>
            <h1 className="dt-num">
              <OnWaiting />
            </h1>
          </div>
        </div>
      </div>

      <div>
        <Report_Mech></Report_Mech>
      </div>
      

      
    </div>
  );
}

export default Dashboard;
