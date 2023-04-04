const express = require("express");
const router = express.Router();
const {
  getCommonStudents,
  register,
  suspendStudent,
  retrieveForNotifications,
} = require("../controllers/api");

const {
  registerValidationRules,
  commonStudentsValidationRules,
  suspendStudentValidationRules,
  retrieveForNotificationsValidationRules,
  validate,
} = require("../middlewares/validators");
const {
  sanitizeRegisterFields,
  sanitizeCommonStudentsFields,
  sanitizeSuspendStudentFields,
  sanitizeRetrieveForNotificationsFields,
} = require("../middlewares/sanitizers");

router.post(
  "/register",
  registerValidationRules(),
  validate,
  sanitizeRegisterFields(),
  register
);
router.get(
  "/commonstudents",
  commonStudentsValidationRules(),
  validate,
  sanitizeCommonStudentsFields(),
  getCommonStudents
);
router.post(
  "/suspend",
  suspendStudentValidationRules(),
  validate,
  sanitizeSuspendStudentFields(),
  suspendStudent
);
router.post(
  "/retrievefornotifications",
  retrieveForNotificationsValidationRules(),
  validate,
  sanitizeRetrieveForNotificationsFields(),
  retrieveForNotifications
);

module.exports = router;
