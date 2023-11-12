import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import Axios from "axios";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import buddhistEra from "dayjs/plugin/buddhistEra";

import th from "dayjs/locale/th";


dayjs.extend(buddhistEra);

const DateLongTH = (date) => {
  dayjs.locale(th); // ตั้งค่าภาษาเป็นภาษาไทย
  return dayjs(date).format("DD MMMM BBBB HH:mm");
};
function Notiline() {
  const [taskList, setTasklist] = useState([]);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    getDatas();
  });

  const getDatas = () => {
    Axios.get("http://localhost:3001/").then((response) => {
      setTasklist(response.data);
    });
  };
  

  const sendNotification = async () => {
    try {
      await Axios.post('http://localhost:3001/send-notification');
      setNotificationSent(true);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div>
      <h1 className="head-center">รายการซ่อมทั้งหมด</h1>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      ></Box>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>วันที่:</TableCell>
                <TableCell align="center">ชื่อลูกค้า:</TableCell>
                <TableCell align="center">เลขทะเบียนรถ:</TableCell>
                <TableCell align="center">ช่างซ่อม:</TableCell>
                <TableCell align="center">รายละเอียด:</TableCell>
                <TableCell align="center">สถานะ:</TableCell>
                <TableCell align="center">แก้ไขรายการ</TableCell>
                <TableCell align="center">ส่งแจ้งเตือน</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taskList &&
                taskList.map((val) => (
                  <TableRow
                    key={val.order_id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {DateLongTH(val.create_order)}
                    </TableCell>
                    <TableCell align="center">{val.name}</TableCell>
                    <TableCell align="center">{val.plate_license}</TableCell>
                    <TableCell align="center">{val.mech_name}</TableCell>
                    <TableCell align="center">{val.description}</TableCell>
                    <TableCell align="center">{val.status_name}</TableCell>
                    <TableCell align="center">
                      <Link to={`/admin/edit/${val.order_id}`}>
                        <IconButton>
                          <EditIcon sx={{ color: "#93B1A6" }} />
                        </IconButton>
                      </Link>
                    </TableCell>

                    <TableCell align="center">
                      <button onClick={sendNotification}>
                        {notificationSent
                          ? "Notification Sent!"
                          : "Send Notification"}
                      </button>
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

export default Notiline;
