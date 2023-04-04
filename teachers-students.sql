CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `suspended` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
);

CREATE TABLE `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `teachers_students` (
  `teacher_id` int NOT NULL,
  `student_id` int NOT NULL,
  PRIMARY KEY (`teacher_id`, `student_id`),
  FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  FOREIGN KEY (`student_id`) REFERENCES `students` (id)
);

CREATE INDEX idx_student_email
ON `students` (`email`);

CREATE INDEX idx_student_suspended
ON `students` (`suspended`);

CREATE INDEX idx_teacher_email
ON `teachers` (`email`);