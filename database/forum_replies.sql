-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-11-20 13:49:25
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
-- 資料庫： `mfee57`
--

-- --------------------------------------------------------

--
-- 資料表結構 `forum_replies`
--

CREATE TABLE `forum_replies` (
  `id` int(10) NOT NULL,
  `post_id` int(10) NOT NULL COMMENT '關聯的文章id',
  `user_id` int(10) NOT NULL COMMENT '回覆者id',
  `content` longtext NOT NULL COMMENT '回覆內容',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` tinyint(1) DEFAULT 1 COMMENT '狀態：1顯示、0隱藏'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `forum_replies`
--

INSERT INTO `forum_replies` (`id`, `post_id`, `user_id`, `content`, `created_at`, `updated_at`, `status`) VALUES
(1, 2, 1, '<p>西西</p>', '2024-11-18 09:12:52', '2024-11-18 09:12:52', 1),
(2, 2, 1, '<p>哈哈</p>', '2024-11-18 09:13:02', '2024-11-18 09:13:02', 1),
(3, 27, 3, '<p>可惡，想玩</p>', '2024-11-18 11:15:26', '2024-11-18 11:15:26', 1),
(4, 27, 1, '<p>玩都玩，玩爆</p>', '2024-11-18 11:17:19', '2024-11-18 11:17:19', 1),
(5, 27, 1, '<p>11111111111111111111</p><p><br></p><p><br></p><p><br></p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p><br></p><p>11</p><p><br></p>', '2024-11-18 11:23:29', '2024-11-18 11:23:38', 0);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `forum_replies`
--
ALTER TABLE `forum_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_post` (`post_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `forum_replies`
--
ALTER TABLE `forum_replies`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `forum_replies`
--
ALTER TABLE `forum_replies`
  ADD CONSTRAINT `fk_replies_post` FOREIGN KEY (`post_id`) REFERENCES `forum_posts` (`id`),
  ADD CONSTRAINT `fk_replies_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
