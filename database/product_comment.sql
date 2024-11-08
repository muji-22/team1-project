-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-11-08 13:56:23
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
-- 資料表結構 `product_comment`
--

CREATE TABLE `product_comment` (
  `id` int(10) NOT NULL,
  `user_id` int(5) NOT NULL,
  `product_id` int(10) NOT NULL,
  `order_id` int(10) NOT NULL,
  `comment` varchar(150) DEFAULT NULL,
  `score` tinyint(1) NOT NULL CHECK (`score` between 1 and 5),
  `comment_date` datetime DEFAULT current_timestamp(),
  `updated_time` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` tinyint(1) DEFAULT 1 COMMENT '1:顯示, 0:隱藏, -1:刪除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `product_comment`
--
ALTER TABLE `product_comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_product` (`product_id`),
  ADD KEY `idx_order` (`order_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_comment`
--
ALTER TABLE `product_comment`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `product_comment`
--
ALTER TABLE `product_comment`
  ADD CONSTRAINT `fk_comment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `fk_comment_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
