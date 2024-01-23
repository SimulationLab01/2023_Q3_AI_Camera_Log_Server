-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- 主機： localhost
-- 產生時間： 2024 年 01 月 11 日 03:48
-- 伺服器版本： 10.4.24-MariaDB
-- PHP 版本： 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `ai_camera_log_server`
--

-- --------------------------------------------------------

--
-- 資料表結構 `department`
--

CREATE TABLE `department` (
  `department_id` varchar(256) NOT NULL,
  `name` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 資料表結構 `device`
--

CREATE TABLE `device` (
  `device_id` varchar(256) NOT NULL,
  `mac_address` varchar(32) NOT NULL,
  `location` varchar(256) DEFAULT NULL,
  `state` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 資料表結構 `device_user`
--

CREATE TABLE `device_user` (
  `device_user_id` int(11) NOT NULL,
  `device_id` varchar(256) NOT NULL,
  `user_id` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 替換檢視表以便查看 `device_user_with_all`
-- (請參考以下實際畫面)
--
CREATE TABLE `device_user_with_all` (
`device_id` varchar(256)
,`user_id` varchar(16)
,`name` varchar(256)
,`full_name` varchar(256)
,`title` varchar(64)
,`state` int(11)
,`photo` mediumblob
,`feature` varbinary(512)
);

-- --------------------------------------------------------

--
-- 替換檢視表以便查看 `device_user_with_name`
-- (請參考以下實際畫面)
--
CREATE TABLE `device_user_with_name` (
`device_id` varchar(256)
,`user_id` varchar(16)
,`name` varchar(256)
,`full_name` varchar(256)
);

-- --------------------------------------------------------

--
-- 資料表結構 `punch_log`
--

CREATE TABLE `punch_log` (
  `punch_log_id` int(11) NOT NULL,
  `user_id` varchar(16) NOT NULL,
  `device_id` varchar(256) NOT NULL,
  `time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 資料表結構 `punch_log_photo`
--

CREATE TABLE `punch_log_photo` (
  `punch_log_id` int(11) NOT NULL,
  `photo` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 替換檢視表以便查看 `punch_log_with_photo`
-- (請參考以下實際畫面)
--
CREATE TABLE `punch_log_with_photo` (
`punch_log_id` int(11)
,`user_id` varchar(16)
,`name` varchar(256)
,`device_id` varchar(256)
,`location` varchar(256)
,`time` datetime
,`photo` mediumblob
);

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE `user` (
  `user_id` varchar(16) NOT NULL,
  `name` varchar(256) NOT NULL,
  `full_name` varchar(256) DEFAULT NULL,
  `title` varchar(64) DEFAULT NULL,
  `department_id` varchar(256) NOT NULL,
  `state` int(11) NOT NULL DEFAULT 0,
  `rfid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 資料表結構 `user_face_feature_128`
--

CREATE TABLE `user_face_feature_128` (
  `user_face_feature_128_id` int(11) NOT NULL,
  `user_id` varchar(16) NOT NULL,
  `feature` varbinary(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 資料表結構 `user_photo`
--

CREATE TABLE `user_photo` (
  `user_photo_id` int(11) NOT NULL,
  `user_id` varchar(16) NOT NULL,
  `photo` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 替換檢視表以便查看 `user_with_department`
-- (請參考以下實際畫面)
--
CREATE TABLE `user_with_department` (
`user_id` varchar(16)
,`name` varchar(256)
,`full_name` varchar(256)
,`department_id` varchar(256)
,`department_name` varchar(256)
,`rfid` bigint(20)
);

-- --------------------------------------------------------

--
-- 替換檢視表以便查看 `user_with_photo`
-- (請參考以下實際畫面)
--
CREATE TABLE `user_with_photo` (
`user_id` varchar(16)
,`name` varchar(256)
,`full_name` varchar(256)
,`department_id` varchar(256)
,`department_name` varchar(256)
,`rfid` bigint(20)
,`photo` mediumblob
);

-- --------------------------------------------------------

--
-- 檢視表結構 `device_user_with_all`
--
DROP TABLE IF EXISTS `device_user_with_all`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `device_user_with_all`  AS SELECT `du`.`device_id` AS `device_id`, `du`.`user_id` AS `user_id`, `u`.`name` AS `name`, `u`.`full_name` AS `full_name`, `u`.`title` AS `title`, `u`.`state` AS `state`, `p`.`photo` AS `photo`, `f`.`feature` AS `feature` FROM (((`device_user` `du` left join `user` `u` on(`du`.`user_id` = `u`.`user_id`)) left join `user_photo` `p` on(`du`.`user_id` = `p`.`user_id`)) left join `user_face_feature_128` `f` on(`du`.`user_id` = `f`.`user_id`))  ;

-- --------------------------------------------------------

--
-- 檢視表結構 `device_user_with_name`
--
DROP TABLE IF EXISTS `device_user_with_name`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `device_user_with_name`  AS SELECT `du`.`device_id` AS `device_id`, `du`.`user_id` AS `user_id`, `u`.`name` AS `name`, `u`.`full_name` AS `full_name` FROM (`device_user` `du` left join `user` `u` on(`du`.`user_id` = `u`.`user_id`))  ;

-- --------------------------------------------------------

--
-- 檢視表結構 `punch_log_with_photo`
--
DROP TABLE IF EXISTS `punch_log_with_photo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `punch_log_with_photo`  AS SELECT `pl`.`punch_log_id` AS `punch_log_id`, `pl`.`user_id` AS `user_id`, `u`.`name` AS `name`, `pl`.`device_id` AS `device_id`, `d`.`location` AS `location`, `pl`.`time` AS `time`, `pp`.`photo` AS `photo` FROM (((`punch_log` `pl` left join `user` `u` on(`pl`.`user_id` = `u`.`user_id`)) left join `device` `d` on(`pl`.`device_id` = `d`.`device_id`)) left join `punch_log_photo` `pp` on(`pl`.`punch_log_id` = `pp`.`punch_log_id`))  ;

-- --------------------------------------------------------

--
-- 檢視表結構 `user_with_department`
--
DROP TABLE IF EXISTS `user_with_department`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_with_department`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`name` AS `name`, `u`.`full_name` AS `full_name`, `d`.`department_id` AS `department_id`, `d`.`name` AS `department_name`, `u`.`rfid` AS `rfid` FROM (`user` `u` left join `department` `d` on(`u`.`department_id` = `d`.`department_id`)) WHERE 11  ;

-- --------------------------------------------------------

--
-- 檢視表結構 `user_with_photo`
--
DROP TABLE IF EXISTS `user_with_photo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_with_photo`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`name` AS `name`, `u`.`full_name` AS `full_name`, `d`.`department_id` AS `department_id`, `d`.`name` AS `department_name`, `u`.`rfid` AS `rfid`, `p`.`photo` AS `photo` FROM ((`user` `u` left join `department` `d` on(`u`.`department_id` = `d`.`department_id`)) left join `user_photo` `p` on(`u`.`user_id` = `p`.`user_id`)) WHERE 11  ;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`department_id`);

--
-- 資料表索引 `device`
--
ALTER TABLE `device`
  ADD PRIMARY KEY (`device_id`);

--
-- 資料表索引 `device_user`
--
ALTER TABLE `device_user`
  ADD PRIMARY KEY (`device_user_id`),
  ADD KEY `fk_device_user_device` (`device_id`),
  ADD KEY `fk_device_user_user` (`user_id`);

--
-- 資料表索引 `punch_log`
--
ALTER TABLE `punch_log`
  ADD PRIMARY KEY (`punch_log_id`),
  ADD KEY `fk_punch_log_user` (`user_id`),
  ADD KEY `fk_punch_log_device` (`device_id`);

--
-- 資料表索引 `punch_log_photo`
--
ALTER TABLE `punch_log_photo`
  ADD PRIMARY KEY (`punch_log_id`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `fk_user_department` (`department_id`);

--
-- 資料表索引 `user_face_feature_128`
--
ALTER TABLE `user_face_feature_128`
  ADD PRIMARY KEY (`user_face_feature_128_id`),
  ADD KEY `user_id` (`user_id`);

--
-- 資料表索引 `user_photo`
--
ALTER TABLE `user_photo`
  ADD PRIMARY KEY (`user_photo_id`),
  ADD KEY `user_id` (`user_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `device_user`
--
ALTER TABLE `device_user`
  MODIFY `device_user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `punch_log`
--
ALTER TABLE `punch_log`
  MODIFY `punch_log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user_face_feature_128`
--
ALTER TABLE `user_face_feature_128`
  MODIFY `user_face_feature_128_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user_photo`
--
ALTER TABLE `user_photo`
  MODIFY `user_photo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `device_user`
--
ALTER TABLE `device_user`
  ADD CONSTRAINT `fk_device_user_device` FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`),
  ADD CONSTRAINT `fk_device_user_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- 資料表的限制式 `punch_log`
--
ALTER TABLE `punch_log`
  ADD CONSTRAINT `fk_punch_log_device` FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`),
  ADD CONSTRAINT `fk_punch_log_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- 資料表的限制式 `punch_log_photo`
--
ALTER TABLE `punch_log_photo`
  ADD CONSTRAINT `fk_punch_log_id` FOREIGN KEY (`punch_log_id`) REFERENCES `punch_log` (`punch_log_id`);

--
-- 資料表的限制式 `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_user_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`);

--
-- 資料表的限制式 `user_face_feature_128`
--
ALTER TABLE `user_face_feature_128`
  ADD CONSTRAINT `fk_user_feature_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `user_photo`
--
ALTER TABLE `user_photo`
  ADD CONSTRAINT `fk_user_photo_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
