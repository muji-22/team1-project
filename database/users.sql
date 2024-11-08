-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-11-06 21:47:45
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `final_project`
--

-- --------------------------------------------------------

--
-- 資料表結構 `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `email` varchar(100) NOT NULL COMMENT '使用者信箱',
  `account` varchar(50) NOT NULL COMMENT '使用者帳號',
  `password` varchar(255) NOT NULL COMMENT '雜湊後的密碼',
  `phone` varchar(20) DEFAULT NULL COMMENT '手機號碼',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT '大頭貼網址',
  `created_time` datetime NOT NULL DEFAULT current_timestamp(),
  `name` varchar(255) NOT NULL COMMENT '使用者姓名',
  `valid` tinyint(1) NOT NULL DEFAULT 1 COMMENT '帳號狀態',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `address` varchar(255) DEFAULT NULL COMMENT '地址'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `users`
--

INSERT INTO `users` (`id`, `email`, `account`, `password`, `phone`, `avatar_url`, `created_time`, `name`, `valid`, `birthday`, `address`) VALUES
(1, 'test1@example.com', 'test1', '$2b$10$OB1u3kOtqgqkUXDdSTeJy.57NX9POsb7Xld.hiaBpQaHHMACTSTWu', '0912345678', NULL, '2024-11-01 15:49:56', '測試用戶一', 1, '1990-01-01', '台北市測試區測試路123號'),
(2, 'test2@example.com', 'test2', '123456', '0987654321', NULL, '2024-11-01 15:49:56', '測試用戶二', 1, '1995-05-05', '新北市測試區測試路456號');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `account` (`account`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
