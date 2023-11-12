const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const line = require("@line/bot-sdk");
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "new_ad_project",
});

app.get("/", (req, res) => {
  let sql = `SELECT order_repair.order_id, order_repair.create_order, customers.name, cars.plate_license, mechanic.mech_name, order_repair.description, status_order.status_name
    FROM order_repair
    INNER JOIN customers ON order_repair.customer_id = customers.cus_id
    INNER JOIN cars ON order_repair.car_id = cars.car_id
    INNER JOIN mechanic ON order_repair.mechanic_id = mechanic.mech_id
    INNER JOIN status_order ON order_repair.status_id = status_order.status_id
    ORDER BY order_repair.create_order DESC;
    `;
  db.query(sql, (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      res.send(result);
    }
  });
});

//ลบข้อมูล order
app.delete("/delete/:order_id", (req, res) => {
  const order_id = req.params.order_id;
  db.query(
    "DELETE FROM order_repair WHERE order_id =?",
    order_id,
    (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

//Add order
app.post("/form", (req, res) => {
  // Extract data from the form
  const {
    customer_phone,
    plate_id,
    mech_name,
    repair_status,
    order_description,
    estimate_time,
  } = req.body;

  // SQL queries to find IDs
  const customerSQL = "SELECT cus_id FROM customers WHERE phone = ?";
  const carSQL = "SELECT car_id FROM cars WHERE plate_license = ?";
  const mechSQL = "SELECT mech_id FROM mechanic WHERE mech_name = ?";
  const statusSQL = "SELECT status_id FROM status_order WHERE status_name = ?";

  try {
    // Find customer_id
    db.query(customerSQL, [customer_phone], (customerErr, customerResult) => {
      console.log(customerResult);
      if (customerResult.length > 0) {
        const customer_id = customerResult[0].cus_id;

        // Find car_id
        db.query(carSQL, [plate_id], (carErr, carResult) => {
          console.log(carResult);
          if (carResult.length > 0) {
            const car_id = carResult[0].car_id;

            // Find mechanic_id
            db.query(mechSQL, [mech_name], (mechErr, mechResult) => {
              if (mechResult) {
                const mechanic_id = mechResult[0].mech_id;

                // Find status_id
                db.query(
                  statusSQL,
                  [repair_status],
                  (statusErr, statusResult) => {
                    if (statusResult) {
                      const status_id = statusResult[0].status_id;

                      // Insert data into the order_repair table
                      db.query(
                        "INSERT INTO order_repair (customer_id, car_id, mechanic_id, status_id, description, estimate_time) VALUES (?, ?, ?, ?, ?, ?)",
                        [
                          customer_id,
                          car_id,
                          mechanic_id,
                          status_id,
                          order_description,
                          estimate_time,
                        ],
                        (err, result) => {
                          if (err) {
                            return res.send(err);
                          } else {
                            res.send("Values Inserted");
                          }
                        }
                      );
                    } else {
                      res.send("Status not found");
                    }
                  }
                );
              } else {
                res.send("Mechanic not found");
              }
            });
          } else {
            return res.send(carErr);
          }
        });
      } else {
        return res.send(customerErr);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/admin/update/:order_id", (req, res) => {
  const sql =
    "SELECT order_repair.order_id, order_repair.estimate_time, customers.phone, cars.plate_license, mechanic.mech_name, order_repair.description, status_order.status_name FROM order_repair INNER JOIN customers ON order_repair.customer_id = customers.cus_id INNER JOIN cars ON order_repair.car_id = cars.car_id INNER JOIN mechanic ON order_repair.mechanic_id = mechanic.mech_id INNER JOIN status_order ON order_repair.status_id = status_order.status_id WHERE order_id = ?";
  const order_id = req.params.order_id;
  db.query(sql, [order_id], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

app.put("/admin/edit/:order_id", (req, res) => {
  const { order_id } = req.params;
  const mech_name = req.body.mech_name;
  const repair_status = req.body.repair_status;
  const order_description = req.body.order_description;
  const estimate_time = req.body.estimate_time;

  const mechSQL = "SELECT mech_id FROM mechanic WHERE mech_name = ?";
  const statusSQL = "SELECT status_id FROM status_order WHERE status_name = ?";

  db.query(mechSQL, [mech_name], (mechErr, mechResult) => {
    if (mechErr) {
      console.log(mechErr);
    } else {
      const mechanic_id = mechResult[0].mech_id;

      db.query(statusSQL, [repair_status], (statusErr, statusResult) => {
        if (statusErr) {
          console.log(statusErr);
        } else {
          const status_id = statusResult[0].status_id;

          db.query(
            `UPDATE order_repair SET mechanic_id = ?, status_id = ?,  description = ? ,estimate_time = ? WHERE order_id = ?`,
            [
              mechanic_id,
              status_id,
              order_description,
              estimate_time,
              order_id,
            ],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        }
      });
    }
  });
});

app.get("/getOrder_detail/:order_id", (req, res) => {
  const { order_id } = req.params;
  const sql = "SELECT * FROM order_detail WHERE order_id = ?";

  db.query(sql, [order_id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลรายการซ่อม");
    } else {
      res.send(result);
    }
  });
});

//ลบข้อมูล order
app.delete("/deleteDetail_list/:order_detail__id", (req, res) => {
  const order_detail__id = req.params.order_detail__id;
  db.query(
    "DELETE FROM order_detail WHERE order_detail_id =?",
    order_detail__id,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/addOrderDetail/:order_id", (req, res) => {
  const order_id = req.params.order_id;
  const { des_detail, estimate_price, update_status } = req.body;

  const sql =
    "INSERT INTO order_detail (order_id, repair_description, estimate_price, status_update) VALUES (?, ?, ?, ?)";
  const values = [order_id, des_detail, estimate_price, update_status];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการ INSERT:", err);
      res.send("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      return;
    }
    console.log("บันทึกข้อมูลเรียบร้อย");
    res.send("บันทึกข้อมูลเรียบร้อย");
  });
});

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////Users/////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

app.get("/admin/manage/users", (req, res) => {
  db.query("SELECT * FROM `customers`", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Add Users
app.post("/admin/manage/user/add", (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const line_id = req.body.line_id;
  const address = req.body.address;

  db.query(
    "INSERT INTO customers (`name`, `phone`, `line_id`, `address`) VALUES(?,?,?,?)",
    [name, phone, line_id, address],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.delete("/admin/manage/users/delete/:cus_id", (req, res) => {
  const cus_id = req.params.cus_id;
  db.query("DELETE FROM customers WHERE cus_id =?", cus_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

////Get id to edit page
app.get("/admin/manage/users/update/:cus_id", (req, res) => {
  const sql = "SELECT * FROM customers WHERE cus_id=?";
  const cus_id = req.params.cus_id;
  db.query(sql, [cus_id], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

app.put("/admin/manage/users/edit/:cus_id", async (req, res) => {
  const { cus_id } = req.params;
  const { Name, phone, line_id, address } = req.body;

  try {
    await db.query(
      `UPDATE customers SET name = ?, phone = ?,  line_id = ? ,address = ? WHERE cus_id = ?`,
      [Name, phone, line_id, address, cus_id]
    );

    res.json({
      message: "User updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////Cars///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

app.get("/admin/manage/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Add Car
app.post("/admin/manage/car/add", (req, res) => {
  const plate = req.body.plate_license;
  const brand = req.body.make;
  const model = req.body.model;
  const vin_number = req.body.vin_number;

  db.query(
    "INSERT INTO cars (plate_license,make,model,vin_number) VALUES(?,?,?,?)",
    [plate, brand, model, vin_number],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

///Delete
app.delete("/admin/manage/car/delete/:car_id", (req, res) => {
  const car_id = req.params.car_id;
  db.query("DELETE FROM cars WHERE car_id =?", car_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

///Get update list id
app.get("/admin/manage/cars/update/:car_id", (req, res) => {
  const sql = "SELECT * FROM cars WHERE car_id=?";
  const id = req.params.car_id;
  db.query(sql, id, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

//// update
app.put("/admin/manage/cars/edit/:car_id", async (req, res) => {
  const { car_id } = req.params;
  const { plate_license, make, model, vin_number } = req.body;

  try {
    await db.query(
      `UPDATE cars SET plate_license = ?, make = ?, model = ?, vin_number = ?  WHERE car_id = ?`,
      [plate_license, make, model, vin_number, car_id]
    );

    res.json({
      message: "User updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////Mechanics//////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

app.get("/admin/manage/mechanics", (req, res) => {
  db.query("SELECT * FROM mechanic", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Add Mech
app.post("/admin/manage/mechanic/add", (req, res) => {
  const m_name = req.body.mech_name;
  const m_phone = req.body.mech_phone;

  db.query(
    "INSERT INTO mechanic (mech_name,mech_phone) VALUES(?,?)",
    [m_name, m_phone],
    (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.delete("/admin/manage/mechanics/delete/:mech_id", (req, res) => {
  const mech_id = req.params.mech_id;
  db.query("DELETE FROM mechanic WHERE mech_id =?", mech_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

///Get update list id
app.get("/admin/manage/mechanic/update/:mech_id", (req, res) => {
  const sql = "SELECT * FROM mechanic WHERE mech_id=?";
  const id = req.params.mech_id;
  db.query(sql, id, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

//// update
app.put("/admin/manage/mechanic/edit/:mech_id", async (req, res) => {
  const { mech_id } = req.params;
  const { mech_name, mech_phone } = req.body;

  try {
    await db.query(
      `UPDATE mechanic SET mech_name = ?, mech_phone = ? WHERE mech_id = ?`,
      [mech_name, mech_phone, mech_id]
    );

    res.json({
      message: "Mechanic updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////Dashboard/////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

app.get("/admin/dashboard/on_progress", (req, res) => {
  db.query(
    "SELECT COUNT(*) FROM order_repair WHERE status_id = 2",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/admin/dashboard/on_finish", (req, res) => {
  db.query(
    "SELECT COUNT(*) FROM order_repair WHERE status_id = 3",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/admin/dashboard/on_waiting", (req, res) => {
  db.query(
    "SELECT COUNT(*) FROM order_repair WHERE status_id=1",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/admin/dashboard/all_order_repair", (req, res) => {
  db.query("SELECT COUNT(*) FROM order_repair ", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// app.get("/repairs", (req, res) => {
//   const selectedMonth = req.query.month || ""; // เดือนที่เลือก
//   const selectedYear = req.query.year || ""; // ปีที่เลือก
//   const selectedMechanic = req.query.mechanic || ""; // ช่างที่เลือก
//   // คำสั่ง SQL สำหรับดึงข้อมูลรายการซ่อม
//   // คำสั่ง SQL สำหรับดึงข้อมูลรายการซ่อม
//   let sql = `SELECT MONTH(create_order) AS repair_month, YEAR(create_order) AS repair_year, COUNT(*) AS total_repairs
// FROM order_repair
// WHERE 1 = 1`;

//   if (selectedMonth) {
//     sql += ` AND MONTH(create_order) = ${selectedMonth}`;
//   }

//   if (selectedYear) {
//     sql += ` AND YEAR(create_order) = ${selectedYear}`;
//   }

//   if (selectedMechanic) {
//     sql += ` AND mechanic_id = ${selectedMechanic}`;
//   }

//   sql += ` GROUP BY repair_month, repair_year`;

//   // ดึงข้อมูลจากฐานข้อมูล
//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
//       res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
//     } else {
//       res.json(result);
//     }
//   });
// });

app.get("/repairs/mechanic/:mechanic_id", (req, res) => {
  const mechanic_id = req.params.mechanic_id || "";

  // คำสั่ง SQL สำหรับดึงข้อมูลรายการซ่อมตามสถานะ
  const sqlInProgress = `SELECT COUNT(*) AS total_in_progress
    FROM order_repair
    WHERE mechanic_id = ? AND status_id = 2`; // 2 คือสถานะ "InProgress"

  const sqlCompleted = `SELECT COUNT(*) AS total_completed
    FROM order_repair
    WHERE mechanic_id = ? AND status_id = 3`; // 3 คือสถานะ "Completed"

  const sqlWaiting = `SELECT COUNT(*) AS total_waiting
    FROM order_repair
    WHERE mechanic_id = ? AND status_id = 1`; // 1 คือสถานะ "Waiting"

  db.query(sqlInProgress, [mechanic_id], (errInProgress, resultInProgress) => {
    if (errInProgress) {
      console.error(
        "เกิดข้อผิดพลาดในการดึงข้อมูลรายการซ่อมที่ดำเนินการซ่อม:",
        errInProgress
      );
    } else {
      const totalInProgress = resultInProgress[0].total_in_progress;

      db.query(sqlCompleted, [mechanic_id], (errCompleted, resultCompleted) => {
        if (errCompleted) {
          console.error(
            "เกิดข้อผิดพลาดในการดึงข้อมูลรายการซ่อมที่เสร็จแล้ว:",
            errCompleted
          );
        } else {
          const totalCompleted = resultCompleted[0].total_completed;

          db.query(sqlWaiting, [mechanic_id], (errWaiting, resultWaiting) => {
            if (errWaiting) {
              console.error(
                "เกิดข้อผิดพลาดในการดึงข้อมูลรายการซ่อมที่รอรับรถเข้าอู่:",
                errWaiting
              );
            } else {
              const totalWaiting = resultWaiting[0].total_waiting;

              res.json({ totalInProgress, totalCompleted, totalWaiting });
            }
          });
        }
      });
    }
  });
});

app.get("/repairs", (req, res) => {
  const selectedMonth = req.query.month || ""; // เดือนที่เลือก
  const selectedYear = req.query.year || ""; // ปีที่เลือก
  const selectedMechanic = req.query.mechanic || ""; // ช่างที่เลือก
  // คำสั่ง SQL สำหรับดึงข้อมูลรายการซ่อม
  // คำสั่ง SQL สำหรับดึงข้อมูลรายการซ่อม
  let sql = `SELECT MONTH(create_order) AS repair_month, YEAR(create_order) AS repair_year, COUNT(*) AS total_repairs
FROM order_repair
WHERE 1 = 1`;

  if (selectedMonth) {
    sql += ` AND MONTH(create_order) = ${selectedMonth}`;
  }

  if (selectedYear) {
    sql += ` AND YEAR(create_order) = ${selectedYear}`;
  }

  if (selectedMechanic) {
    sql += ` AND mechanic_id = ${selectedMechanic}`;
  }

  sql += ` GROUP BY repair_month, repair_year`;

  // ดึงข้อมูลจากฐานข้อมูล
  db.query(sql, (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    } else {
      res.json(result);
    }
  });
});

//////////////////////status_list/////////////////////////
//get//
app.get("/admin/status_order/waiting_order", (req, res) => {
  let sql = `SELECT order_repair.order_id, order_repair.create_order, customers.name, cars.plate_license, mechanic.mech_name, order_repair.description, status_order.status_name
    FROM order_repair
    INNER JOIN customers ON order_repair.customer_id = customers.cus_id
    INNER JOIN cars ON order_repair.car_id = cars.car_id
    INNER JOIN mechanic ON order_repair.mechanic_id = mechanic.mech_id
    INNER JOIN status_order ON order_repair.status_id = status_order.status_id
    WHERE order_repair.status_id = 1
    ORDER BY order_repair.create_order DESC;
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/admin/status_order/on_progress_order", (req, res) => {
  let sql = `SELECT order_repair.order_id, order_repair.create_order, customers.name, cars.plate_license, mechanic.mech_name, order_repair.description, status_order.status_name
    FROM order_repair
    INNER JOIN customers ON order_repair.customer_id = customers.cus_id
    INNER JOIN cars ON order_repair.car_id = cars.car_id
    INNER JOIN mechanic ON order_repair.mechanic_id = mechanic.mech_id
    INNER JOIN status_order ON order_repair.status_id = status_order.status_id
    WHERE order_repair.status_id = 2
    ORDER BY order_repair.create_order DESC;
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/admin/status_order/finish_order", (req, res) => {
  let sql = `SELECT order_repair.order_id, order_repair.create_order, customers.name, cars.plate_license, mechanic.mech_name, order_repair.description, status_order.status_name
    FROM order_repair
    INNER JOIN customers ON order_repair.customer_id = customers.cus_id
    INNER JOIN cars ON order_repair.car_id = cars.car_id
    INNER JOIN mechanic ON order_repair.mechanic_id = mechanic.mech_id
    INNER JOIN status_order ON order_repair.status_id = status_order.status_id
    WHERE order_repair.status_id = 3
    ORDER BY order_repair.create_order DESC;
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/getDetail_id/:order_detail_id", (req, res) => {
  const detail_id = req.params.order_detail_id;
  let sql = "SELECT * FROM order_detail WHERE order_detail_id=?";
  db.query(sql, [detail_id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/getDetail_id/edit/:order_detail_id", async (req, res) => {
  const Detail_id = req.params.order_detail_id;
  const Description = req.body.des_detail;
  const Status = req.body.update_status;
  const Estimate_price = req.body.estimate_price;

  try {
    await db.query(
      `UPDATE order_detail SET repair_description = ?, status_update = ?,  estimate_price = ?  WHERE order_detail_id = ?`,
      [Description, Status, Estimate_price, Detail_id]
    );

    res.json({
      message: "Updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

//////////////////////////////////////////////////////////

const config = {
  channelSecret: "851b2e51614b10647b64d323828633d7",
  channelAccessToken:
    "7upCGqI3EFyM+P4hUhnnEi80Aam9DxMZgUEBSnB/mqLzY8KmtGdBKO1yPVBwJzo+Tqz1NX+mlKSsXZJmKAk+fyRFW8qBhP3BjRU67EKcd8CvPKZM4em8q6JKB1a9sCj88yrg1i3cHBAjmdvOP1Al4QdB04t89/1O/w1cDnyilFU=",
};

const client = new line.Client(config);

app.use(bodyParser.json());

// รับ webhook จาก LINE
app.post("/webhook", (req, res) => {
  const events = req.body.events;

  events.forEach((event) => {
    if (event.type === "follow") {
      const userId = event.source.userId;
      console.log("User followed:", userId);

      const sql = "INSERT INTO line_detail (userId) VALUES (?)";
      db.query(sql, [userId], (err, results) => {
        if (err) {
          console.error("Error inserting user ID:", err);
          return;
        }
        console.log("User ID inserted into database:", userId);
      });
    } else if (event.type === "message" && event.message.type === "text") {
      const phoneNumber = event.message.text;

      // ตรวจสอบว่าข้อความที่ได้รับเป็นเบอร์โทรศัพท์หรือไม่
      if (/^\d{10}$/.test(phoneNumber)) {
        // ตรวจสอบว่าเป็นเบอร์โทรศัพท์ที่มี 10 ตัว

        // ตรวจสอบว่าเบอร์โทรศัพท์ที่ได้รับตรงกับข้อมูลในตาราง customers
        const checkPhoneNumberQuery =
          "SELECT COUNT(*) AS count FROM customers WHERE phone = ?";
        db.query(
          checkPhoneNumberQuery,
          [phoneNumber],
          (checkErr, checkResults) => {
            if (checkErr) {
              console.error("Error checking phone number:", checkErr);
              return;
            }

            const phoneNumberExists = checkResults[0].count > 0;

            if (phoneNumberExists) {
              // เมื่อเบอร์โทรตรงกับข้อมูลใน customers ให้ทำการอัปเดต
              const updatePhoneNumberQuery =
                "UPDATE line_detail SET phoneNumber = ? WHERE userId = ?";
              db.query(
                updatePhoneNumberQuery,
                [phoneNumber, event.source.userId],
                (updateErr, updateResults) => {
                  if (updateErr) {
                    console.error("Error updating phone number:", updateErr);
                    return;
                  }
                  console.log("Phone number updated in database:", phoneNumber);

                  // ทำการอัปเดต line_customer_id โดยใช้ JOIN กับ customers
                  const updateLineCustomerIdQuery = `
            UPDATE line_detail ld
            JOIN customers c ON ld.phoneNumber = c.phone
            SET ld.line_customer_id = c.cus_id
            WHERE ld.phoneNumber = ?`;
                  db.query(
                    updateLineCustomerIdQuery,
                    [phoneNumber],
                    (updateLineCustomerIdErr, updateLineCustomerIdResult) => {
                      if (updateLineCustomerIdErr) {
                        console.error(
                          "Error updating line_customer_id:",
                          updateLineCustomerIdErr
                        );
                        return;
                      }
                      console.log(
                        "Line customer ID updated in database:",
                        updateLineCustomerIdResult
                      );
                    }
                  );
                }
              );
            } else {
              console.log(
                "Phone number does not exist in customers table. Not updating database."
              );
            }
          }
        );
      }
    }
  });
  res.sendStatus(200);
});

// เพิ่ม route ใหม่สำหรับรับ HTTP request จาก React app
app.post("/send-notification", (req, res) => {
  const { status, phone, estimate_time } = req.body;
  console.log(status, phone, estimate_time);

  db.query(
    "SELECT * FROM line_detail WHERE phoneNumber =?",
    [phone],
    (err, result) => {
      if (err) {
        console.error("Error querying database:", err);
        res.status(500).send("Error querying database");
        return;
      }

      const userId = result[0].userId;

      db.query(
        "SELECT * FROM order_repair WHERE estimate_time =?",
        [estimate_time],
        (err, estimateResult) => {
          if (err) {
            console.error("Error querying estimate time:", err);
            res.status(500).send("Error querying estimate time");
            return;
          }

          const notificationMessage = {
            type: "text",
            text: `รายการซ่อมของคุณ
          -${status}- 
          เวลาซ่อมเสร็จสิ้นโดยประมาณ: ${estimate_time}`,
          };

          client
            .pushMessage(userId, notificationMessage)
            .then(() => {
              console.log("Notification sent successfully");
              res.sendStatus(200);
            })
            .catch((error) => {
              console.error("Error sending notification:", error);
              res.status(500).send("Error sending notification");
            });
        }
      );
    }
  );
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
