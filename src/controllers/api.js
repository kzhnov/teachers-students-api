const apiService = require("../services/api");

const register = async (req, res) => {
  const { teacher, teachers, student, students } = req.body;

  const result = await apiService.register(
    teacher,
    teachers,
    student,
    students
  );

  if (result.status === "success") {
    res.sendStatus(204);
  } else {
    res.status(500).json({ message: result.message });
  }
};

const getCommonStudents = async (req, res) => {
  const { teacher } = req.query;
  const result = await apiService.getCommonStudents(teacher);

  if (result.status === "success") {
    const students = result.data;
    res.status(200).json({ students });
  } else {
    res.status(500).json({ message: result.message });
  }
};

const suspendStudent = async (req, res) => {
  const { student } = req.body;

  const result = await apiService.suspendStudent(student);

  if (result.status === "success") {
    res.sendStatus(204);
  } else {
    res.status(500).json({ message: result.message });
  }
};

const retrieveForNotifications = async (req, res) => {
  const { teacher, notification } = req.body;
  const result = await apiService.retrieveForNotifications(
    teacher,
    notification
  );

  if (result.status === "success") {
    const recipients = result.data;
    res.status(200).json({ recipients });
  } else {
    res.status(500).json({ message: result.message });
  }
};

module.exports = {
  register,
  getCommonStudents,
  suspendStudent,
  retrieveForNotifications,
};
