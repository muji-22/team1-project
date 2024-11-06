-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-11-06 21:47:30
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
-- 資料表結構 `tags`
--

CREATE TABLE `tags` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `tags`
--

INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES
(1, '大腦', '2024-08-21 05:33:38'),
(2, '派對', '2024-08-21 05:33:38'),
(3, '樂齡', '2024-08-21 05:33:38'),
(4, '幼兒', '2024-08-21 05:33:38'),
(5, '紙牌', '2024-08-21 05:33:38'),
(6, '猜心', '2024-08-21 05:33:38'),
(7, '輕策略', '2024-08-21 05:33:38'),
(8, '競速', '2024-08-21 05:33:38'),
(9, '台灣作家', '2024-08-21 05:33:38'),
(10, '骰子', '2024-08-21 05:33:38'),
(11, '巧手', '2024-08-21 05:33:38'),
(12, '合作', '2024-08-21 05:33:38'),
(13, '言語', '2024-08-21 05:33:38'),
(14, '陣營', '2024-08-21 05:33:38'),
(15, '中策略', '2024-08-21 05:33:38'),
(16, '重策略', '2024-08-21 05:33:38');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
