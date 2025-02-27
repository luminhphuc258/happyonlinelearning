
-- -----------------------------------------------------
-- Schema happyonlinelearning
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `happyonlinelearning` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `happyonlinelearning` ;

-- -----------------------------------------------------
-- Table `happyonlinelearning`.`programs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`programs` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`programs` (
  `program_id` INT(11) NOT NULL AUTO_INCREMENT,
  `program_name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `total_credits` INT(11) NOT NULL,
  `is_active` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`program_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `happyonlinelearning`.`courses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`courses` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`courses` (
  `course_id` INT(11) NOT NULL AUTO_INCREMENT,
  `program_id` INT(11) NOT NULL,
  `course_code` VARCHAR(20) NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `credits` INT(11) NOT NULL,
  `semester` VARCHAR(20) NULL DEFAULT NULL,
  `is_active` TINYINT(1) NULL DEFAULT '1',
  `registration_start` DATETIME NULL DEFAULT NULL,
  `registration_end` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  UNIQUE INDEX `course_code` (`course_code` ASC) VISIBLE,
  INDEX `program_id` (`program_id` ASC) VISIBLE,
  CONSTRAINT `courses_ibfk_1`
    FOREIGN KEY (`program_id`)
    REFERENCES `happyonlinelearning`.`programs` (`program_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`assignments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`assignments` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`assignments` (
  `assignment_id` INT(11) NOT NULL AUTO_INCREMENT,
  `course_id` INT(11) NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `due_date` DATETIME NULL DEFAULT NULL,
  `total_points` FLOAT NULL DEFAULT NULL,
  `submission_type` VARCHAR(50) NULL DEFAULT NULL,
  `is_published` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`assignment_id`),
  INDEX `course_id` (`course_id` ASC) VISIBLE,
  CONSTRAINT `assignments_ibfk_1`
    FOREIGN KEY (`course_id`)
    REFERENCES `happyonlinelearning`.`courses` (`course_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`users` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` TINYINT(1) NULL DEFAULT '1',
  `address` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `avatar` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`instructors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`instructors` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`instructors` (
  `instructor_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `department` VARCHAR(100) NULL DEFAULT NULL,
  `specialization` VARCHAR(100) NULL DEFAULT NULL,
  `bio` TEXT NULL DEFAULT NULL,
  `qualification` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`instructor_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `instructors_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `happyonlinelearning`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`courseinstructors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`courseinstructors` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`courseinstructors` (
  `course_instructor_id` INT(11) NOT NULL AUTO_INCREMENT,
  `course_id` INT(11) NOT NULL,
  `instructor_id` INT(11) NOT NULL,
  `academic_year` VARCHAR(20) NULL DEFAULT NULL,
  `semester` VARCHAR(20) NULL DEFAULT NULL,
  `is_primary` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`course_instructor_id`),
  INDEX `course_id` (`course_id` ASC) VISIBLE,
  INDEX `instructor_id` (`instructor_id` ASC) VISIBLE,
  CONSTRAINT `courseinstructors_ibfk_1`
    FOREIGN KEY (`course_id`)
    REFERENCES `happyonlinelearning`.`courses` (`course_id`)
    ON DELETE CASCADE,
  CONSTRAINT `courseinstructors_ibfk_2`
    FOREIGN KEY (`instructor_id`)
    REFERENCES `happyonlinelearning`.`instructors` (`instructor_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`students`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`students` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`students` (
  `student_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `enrollment_number` VARCHAR(50) NOT NULL,
  `program` VARCHAR(100) NULL DEFAULT NULL,
  `semester` INT(11) NULL DEFAULT NULL,
  `completed_credits` INT(11) NULL DEFAULT '0',
  `total_credits` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE INDEX `enrollment_number` (`enrollment_number` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `students_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `happyonlinelearning`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`enrollments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`enrollments` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`enrollments` (
  `enrollment_id` INT(11) NOT NULL AUTO_INCREMENT,
  `student_id` INT(11) NOT NULL,
  `course_id` INT(11) NOT NULL,
  `enrollment_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(20) NULL DEFAULT NULL,
  `final_grade` FLOAT NULL DEFAULT NULL,
  `is_completed` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`enrollment_id`),
  INDEX `student_id` (`student_id` ASC) VISIBLE,
  INDEX `course_id` (`course_id` ASC) VISIBLE,
  CONSTRAINT `enrollments_ibfk_1`
    FOREIGN KEY (`student_id`)
    REFERENCES `happyonlinelearning`.`students` (`student_id`)
    ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2`
    FOREIGN KEY (`course_id`)
    REFERENCES `happyonlinelearning`.`courses` (`course_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`quizzes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`quizzes` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`quizzes` (
  `quiz_id` INT(11) NOT NULL AUTO_INCREMENT,
  `course_id` INT(11) NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `start_time` DATETIME NULL DEFAULT NULL,
  `end_time` DATETIME NULL DEFAULT NULL,
  `duration_minutes` INT(11) NULL DEFAULT NULL,
  `total_points` FLOAT NULL DEFAULT NULL,
  `is_published` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`quiz_id`),
  INDEX `course_id` (`course_id` ASC) VISIBLE,
  CONSTRAINT `quizzes_ibfk_1`
    FOREIGN KEY (`course_id`)
    REFERENCES `happyonlinelearning`.`courses` (`course_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`quizattempts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`quizattempts` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`quizattempts` (
  `attempt_id` INT(11) NOT NULL AUTO_INCREMENT,
  `quiz_id` INT(11) NOT NULL,
  `student_id` INT(11) NOT NULL,
  `start_time` DATETIME NULL DEFAULT NULL,
  `submit_time` DATETIME NULL DEFAULT NULL,
  `score` FLOAT NULL DEFAULT NULL,
  `is_graded` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`attempt_id`),
  INDEX `quiz_id` (`quiz_id` ASC) VISIBLE,
  INDEX `student_id` (`student_id` ASC) VISIBLE,
  CONSTRAINT `quizattempts_ibfk_1`
    FOREIGN KEY (`quiz_id`)
    REFERENCES `happyonlinelearning`.`quizzes` (`quiz_id`)
    ON DELETE CASCADE,
  CONSTRAINT `quizattempts_ibfk_2`
    FOREIGN KEY (`student_id`)
    REFERENCES `happyonlinelearning`.`students` (`student_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`quizquestions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`quizquestions` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`quizquestions` (
  `question_id` INT(11) NOT NULL AUTO_INCREMENT,
  `quiz_id` INT(11) NOT NULL,
  `question_text` TEXT NOT NULL,
  `question_type` VARCHAR(50) NULL DEFAULT NULL,
  `points` FLOAT NOT NULL,
  `options` TEXT NULL DEFAULT NULL,
  `correct_answer` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  INDEX `quiz_id` (`quiz_id` ASC) VISIBLE,
  CONSTRAINT `quizquestions_ibfk_1`
    FOREIGN KEY (`quiz_id`)
    REFERENCES `happyonlinelearning`.`quizzes` (`quiz_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`quizresponses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`quizresponses` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`quizresponses` (
  `response_id` INT(11) NOT NULL AUTO_INCREMENT,
  `attempt_id` INT(11) NOT NULL,
  `question_id` INT(11) NOT NULL,
  `student_answer` TEXT NULL DEFAULT NULL,
  `earned_points` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`response_id`),
  INDEX `attempt_id` (`attempt_id` ASC) VISIBLE,
  INDEX `question_id` (`question_id` ASC) VISIBLE,
  CONSTRAINT `quizresponses_ibfk_1`
    FOREIGN KEY (`attempt_id`)
    REFERENCES `happyonlinelearning`.`quizattempts` (`attempt_id`)
    ON DELETE CASCADE,
  CONSTRAINT `quizresponses_ibfk_2`
    FOREIGN KEY (`question_id`)
    REFERENCES `happyonlinelearning`.`quizquestions` (`question_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`ratings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`ratings` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`ratings` (
  `rating_id` INT(11) NOT NULL AUTO_INCREMENT,
  `student_id` INT(11) NOT NULL,
  `course_id` INT(11) NULL DEFAULT NULL,
  `instructor_id` INT(11) NULL DEFAULT NULL,
  `rating_value` INT(11) NULL DEFAULT NULL,
  `review_text` TEXT NULL DEFAULT NULL,
  `submitted_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rating_id`),
  INDEX `student_id` (`student_id` ASC) VISIBLE,
  INDEX `course_id` (`course_id` ASC) VISIBLE,
  INDEX `instructor_id` (`instructor_id` ASC) VISIBLE,
  CONSTRAINT `ratings_ibfk_1`
    FOREIGN KEY (`student_id`)
    REFERENCES `happyonlinelearning`.`students` (`student_id`)
    ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2`
    FOREIGN KEY (`course_id`)
    REFERENCES `happyonlinelearning`.`courses` (`course_id`)
    ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_3`
    FOREIGN KEY (`instructor_id`)
    REFERENCES `happyonlinelearning`.`instructors` (`instructor_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`submissions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`submissions` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`submissions` (
  `submission_id` INT(11) NOT NULL AUTO_INCREMENT,
  `assignment_id` INT(11) NOT NULL,
  `student_id` INT(11) NOT NULL,
  `submission_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `file_path` VARCHAR(255) NULL DEFAULT NULL,
  `submission_text` TEXT NULL DEFAULT NULL,
  `earned_points` FLOAT NULL DEFAULT NULL,
  `feedback` TEXT NULL DEFAULT NULL,
  `is_late` TINYINT(1) NULL DEFAULT '0',
  `is_graded` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`submission_id`),
  INDEX `assignment_id` (`assignment_id` ASC) VISIBLE,
  INDEX `student_id` (`student_id` ASC) VISIBLE,
  CONSTRAINT `submissions_ibfk_1`
    FOREIGN KEY (`assignment_id`)
    REFERENCES `happyonlinelearning`.`assignments` (`assignment_id`)
    ON DELETE CASCADE,
  CONSTRAINT `submissions_ibfk_2`
    FOREIGN KEY (`student_id`)
    REFERENCES `happyonlinelearning`.`students` (`student_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `happyonlinelearning`.`userroles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `happyonlinelearning`.`userroles` ;

CREATE TABLE IF NOT EXISTS `happyonlinelearning`.`userroles` (
  `user_role_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `role_name` VARCHAR(50) NOT NULL,
  `assigned_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_role_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `userroles_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `happyonlinelearning`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
