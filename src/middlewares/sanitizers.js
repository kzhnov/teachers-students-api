const { body, param } = require("express-validator");

const sanitizeRegisterFields = () => {
  return [body("student").trim().escape(), body("teacher").trim().escape()];
};

const sanitizeCommonStudentsFields = () => {
  return [param("teacher").trim().escape()];
};

const sanitizeSuspendStudentFields = () => {
  return [body("student").trim().escape()];
};

const sanitizeRetrieveForNotificationsFields = () => {
  return [
    body("teacher").trim().escape(),
    body("notification").trim().escape(),
  ];
};

module.exports = {
  sanitizeRegisterFields,
  sanitizeCommonStudentsFields,
  sanitizeSuspendStudentFields,
  sanitizeRetrieveForNotificationsFields,
};
