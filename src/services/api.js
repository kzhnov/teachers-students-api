const db = require("../utils/db");
const {
  standardizeInput,
  retrieveMentionedEmails,
} = require("../utils/helpers");

const register = async (teacher, teachers, student, students) => {
  try {
    let teacherEmailsArray = standardizeInput([teacher, teachers]);
    let studentEmailsArray = standardizeInput([student, students]);

    if (teacherEmailsArray.length && studentEmailsArray.length) {
      const existingTeachers = await getTeachersByEmails(teacherEmailsArray);
      const existingStudents = await getStudentsByEmails(studentEmailsArray);

      const existingTeacherEmails = existingTeachers.map((t) => t.email);
      const existingStudentEmails = existingStudents.map((s) => s.email);

      const newTeacherEmails = teacherEmailsArray.filter(
        (email) => !existingTeacherEmails.includes(email)
      );
      const newStudentEmails = studentEmailsArray.filter(
        (email) => !existingStudentEmails.includes(email)
      );

      if (newTeacherEmails.length) {
        const teacherEmailData = newTeacherEmails.map((email) => [email]);
        await db.query("INSERT INTO teachers (email) VALUES ?", [
          teacherEmailData,
        ]);
      }

      if (newStudentEmails.length) {
        const studentEmailData = newStudentEmails.map((email) => [email]);
        await db.query("INSERT INTO students (email) VALUES ?", [
          studentEmailData,
        ]);
      }

      const teachersInTable = await getTeachersByEmails(teacherEmailsArray);
      const studentsInTable = await getStudentsByEmails(studentEmailsArray);

      if (teachersInTable.length && studentsInTable.length) {
        let queries = [];
        let values = [];
        let teacherStudentData = [];
        teachersInTable.forEach((t) => {
          studentsInTable.forEach((s) => {
            const query = `(teacher_id = ? AND student_id = ?)`;
            queries.push(query);
            values.push(t.id);
            values.push(s.id);
            const teacherStudentIdPair = [t.id, s.id];
            teacherStudentData.push(teacherStudentIdPair);
          });
        });
        if (queries.length) {
          const queryString = queries.join(" OR ");
          const deleteQuery = `DELETE FROM teachers_students WHERE ${queryString}`;
          await db.query(deleteQuery, values);

          if (teacherStudentData.length) {
            await db.query(
              "INSERT INTO teachers_students (teacher_id, student_id) VALUES ?",
              [teacherStudentData]
            );
          }
        }
      }
      return {
        status: "success",
      };
    }
  } catch (err) {
    return {
      status: "error",
      message: err.message,
    };
  }
};

const getCommonStudents = async (teachers) => {
  try {
    let teacherEmailsArray = standardizeInput([teachers]);

    const commonEmailCount = teacherEmailsArray.length;
    if (commonEmailCount) {
      const getQuery =
        "SELECT s.email, COUNT(s.email) AS email_count FROM students AS s INNER JOIN teachers_students AS ts ON s.id = ts.student_id INNER JOIN teachers AS t ON t.id = ts.teacher_id WHERE t.email IN (?) GROUP BY s.email HAVING email_count = ?";

      const [students] = await db.query(getQuery, [
        teacherEmailsArray,
        commonEmailCount,
      ]);
      const studentEmails = students.map((s) => s.email);

      return {
        status: "success",
        data: studentEmails,
      };
    }
    return {
      status: "success",
      data: [],
    };
  } catch (err) {
    return {
      status: "error",
      message: err.message,
    };
  }
};

const suspendStudent = async (student) => {
  try {
    let studentEmailsArray = standardizeInput([student]);

    if (studentEmailsArray.length) {
      const [result] = await db.query(
        "UPDATE students SET suspended = 1 WHERE email IN (?)",
        [studentEmailsArray]
      );
    }

    return {
      status: "success",
    };
  } catch (err) {
    return {
      status: "error",
      message: err.message,
    };
  }
};

const retrieveForNotifications = async (teacher, notification) => {
  try {
    const emails = retrieveMentionedEmails(notification);
    let students;

    if (emails.length) {
      [students] = await db.query(
        "SELECT DISTINCT(s.email) FROM students AS s INNER JOIN teachers_students AS ts ON s.id = ts.student_id INNER JOIN teachers AS t ON t.id = ts.teacher_id WHERE s.suspended != 1 AND (t.email = ? OR s.email IN (?))",
        [teacher, emails]
      );
    } else {
      [students] = await db.query(
        "SELECT DISTINCT(s.email) FROM students AS s INNER JOIN teachers_students AS ts ON s.id = ts.student_id INNER JOIN teachers AS t ON t.id = ts.teacher_id WHERE s.suspended != 1 AND t.email = ?",
        [teacher]
      );
    }
    const studentEmails = students.map((s) => s.email);
    return {
      status: "success",
      data: studentEmails,
    };
  } catch (err) {
    return {
      status: "error",
      message: err.message,
    };
  }
};

const getStudentsByEmails = async (emails) => {
  try {
    const [rows, fields] = await db.query(
      "SELECT id, email FROM students WHERE email IN (?)",
      [emails]
    );
    return rows;
  } catch (err) {
    console.log(err.message);
    return;
  }
};

const getTeachersByEmails = async (emails) => {
  try {
    const [rows, fields] = await db.query(
      "SELECT id, email FROM teachers WHERE email IN (?)",
      [emails]
    );
    return rows;
  } catch (err) {
    console.log(err.message);
    return;
  }
};

module.exports = {
  register,
  getCommonStudents,
  suspendStudent,
  retrieveForNotifications,
  getStudentsByEmails,
  getTeachersByEmails,
};
