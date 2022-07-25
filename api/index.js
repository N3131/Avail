// api/index.js

const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MySQL connection
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "availj",
  multipleStatements: true,
});

connection.connect();

app.post("/getSprint", function (req, res) {
  connection.query(
    "SELECT * FROM Sprint WHERE stageID=" + req.body.stageId + "",
    function (err, rows, fields) {
      if (err) throw err;

      res.send(rows);
    }
  );
});

app.post("/getStageInfo", function (req, res) {
  connection.query(
    "SELECT * FROM Stage WHERE stageID=" + req.body.stageId + "",
    function (err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    }
  );
});

app.post("/getStage", function (req, res) {
  connection.query(
    "SELECT estimateOriginal FROM Stage WHERE stageID=" + req.body.stageId + "",
    function (err, row, fields) {
      if (err) throw err;
      res.send(row[0]);
    }
  );
});

app.post("/saveTable", function (req, res) {
  if (req.body.key == "notifications") {
    connection.query(
      "UPDATE Sprint SET " +
        req.body.key +
        '="' +
        req.body.val +
        '" WHERE sprintID=' +
        req.body.sprintId +
        " AND stageID=" +
        req.body.stageId +
        "",
      function (err, row, fields) {
        if (err) throw err;
        res.send(true);
      }
    );
  } else {
    connection.query(
      "UPDATE Sprint SET " +
        req.body.key +
        "=" +
        req.body.val +
        " WHERE sprintID=" +
        req.body.sprintId +
        " AND stageID=" +
        req.body.stageId +
        "",
      function (err, row, fields) {
        if (err) throw err;
        res.send(true);
      }
    );
  }
});

app.post("/addTableRow", function (req, res) {
  connection.query(
    "INSERT INTO Sprint (stageID, notifications, week, sprint, plannedH, resourcedH, workedH, plannedForTlist, completedH, corrections, newTasks, extraWork) VALUES (" +
      req.body.stageId +
      ", '" +
      req.body.notifications +
      "', " +
      req.body.week +
      ", " +
      req.body.sprint +
      ", " +
      req.body.plannedH +
      ", " +
      req.body.resourcedH +
      ", " +
      req.body.workedH +
      ", " +
      req.body.plannedForTList +
      ", " +
      req.body.completedH +
      ", " +
      req.body.corrections +
      ", " +
      req.body.newTasks +
      ", " +
      req.body.extraWork +
      ")",
    function (err, row, fields) {
      if (err) throw err;
      res.send(true);
    }
  );
});

app.post("/removeTableRow", function (req, res) {
  connection.query(
    "DELETE FROM Sprint WHERE Sprint.sprintID =" + req.body.sprintId,
    function (err, row, fields) {
      if (err) throw err;
      res.send(true);
    }
  );
});

export default {
  path: "/api",
  handler: app,
};
