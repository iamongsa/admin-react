import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

function Onfinish() {
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    // ทำการร้องข้อมูลจากเซิร์ฟเวอร์ โดยใช้ Axios
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/dashboard/on_finish');
        const data = response.data;
        const count = data[0]["COUNT(*)"]; // ดึงค่า COUNT(*) จากข้อมูล JSON
        setRowCount(count); // นับจำนวนแถวที่ได้จากเซิร์ฟเวอร์
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการร้องข้อมูล:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {rowCount}
    </div>
  );
}

export default Onfinish;
