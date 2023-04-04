const { check, oneOf, validationResult } = require("express-validator");
const { getStudentsByEmails, getTeachersByEmails } = require("../services/api");

const registerValidationRules = () => {
  return [
    oneOf(
      [
        check("student").exists().notEmpty(),
        check("students").exists().notEmpty(),
      ],
      "student or students property is required and must not be empty."
    ),
    check("student").optional().isEmail().withMessage("student must be email"),
    check("students")
      .optional()
      .isEmail()
      .withMessage("students must be email"),
    oneOf(
      [
        check("teacher").exists().notEmpty().isEmail(),
        check("teachers").exists().notEmpty().isEmail(),
      ],
      "teacher or teachers property is required and must not be empty."
    ),
    check("teacher").optional().isEmail().withMessage("teacher must be email"),
    check("teachers")
      .optional()
      .isEmail()
      .withMessage("teachers must be email"),
  ];
};

const commonStudentsValidationRules = () => {
  return [check("teacher").notEmpty().withMessage("teacher is required")];
};

const suspendStudentValidationRules = () => {
  return [
    check("student").notEmpty().withMessage("student property is required"),
    check("student").custom(async (value) => {
      const email = value || "";
      const student = await getStudentsByEmails([email]);
      if (!student.length) {
        throw new Error("student not found.");
      }
      return true;
    }),
  ];
};

const retrieveForNotificationsValidationRules = () => {
  return [
    check("teacher").notEmpty().withMessage("teacher is required"),
    check("teacher").isEmail().withMessage("teacher must be email"),
    check("teacher")
      .optional()
      .custom(async (value) => {
        const email = value || "";
        const teacher = await getTeachersByEmails([email]);
        if (!teacher.length) {
          throw new Error("teacher not found.");
        }
        return true;
      }),
    check("notification").notEmpty().withMessage("notification is required"),
  ];
};

const validate = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
};

module.exports = {
  registerValidationRules,
  commonStudentsValidationRules,
  suspendStudentValidationRules,
  retrieveForNotificationsValidationRules,
  validate,
};
