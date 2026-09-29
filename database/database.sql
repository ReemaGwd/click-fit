-- ============================================
-- CLICK FIT DATABASE
-- ============================================

CREATE DATABASE IF NOT EXISTS click_fit;

USE click_fit;


-- ============================================
-- USERS TABLE
-- ============================================

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'user',
    active BOOLEAN NOT NULL DEFAULT TRUE
);


-- ============================================
-- ADD USER STORED PROCEDURE
-- ============================================

DROP PROCEDURE IF EXISTS addUser;

DELIMITER //

CREATE PROCEDURE addUser(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_type VARCHAR(50),
    IN p_active BOOLEAN
)
BEGIN

    INSERT INTO users (
        email,
        password,
        type,
        active
    )
    VALUES (
        p_email,
        p_password,
        p_type,
        p_active
    );

END //

DELIMITER ;


-- ============================================
-- CALL STORED PROCEDURE
-- ============================================

CALL addUser(
    'demo@clickfit.com',
    'demoPassword123',
    'user',
    TRUE
);


-- ============================================
-- VERIFY USER
-- ============================================

SELECT * FROM users;