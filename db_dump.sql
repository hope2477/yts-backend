-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 02, 2025 at 05:09 AM
-- Server version: 10.6.22-MariaDB-cll-lve-log
-- PHP Version: 8.3.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ytsejovs_yts`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phoneNumber` varchar(10) NOT NULL,
  `isSuperAdmin` bit(1) NOT NULL,
  `isActive` bit(1) NOT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdDate` datetime NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `firstName`, `lastName`, `userName`, `email`, `password_hash`, `phoneNumber`, `isSuperAdmin`, `isActive`, `createdBy`, `createdDate`, `updatedBy`, `updatedDate`) VALUES
(1, 'Ahmed', 'Ismal', 'ahmedi', 'ahmedhussainismail95@gmail.com', 'hashed_password_here', '0771472477', b'1', b'1', NULL, '2024-08-31 10:00:00', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `feature`
--

CREATE TABLE `feature` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `rentalId` int(11) NOT NULL,
  `isActive` bit(1) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feature`
--

INSERT INTO `feature` (`id`, `name`, `rentalId`, `isActive`, `createdBy`, `createdDate`, `updatedBy`, `updatedDate`) VALUES
(2, 'Garage', 2, b'1', 1, '2024-09-08 02:08:11', NULL, NULL),
(3, '24 Hour Security', 2, b'1', 1, '2024-09-08 02:08:11', NULL, NULL),
(4, 'Gym', 2, b'1', 1, '2024-09-08 02:08:11', NULL, NULL),
(5, 'Garbage Removal', 2, b'1', 1, '2024-09-08 02:08:11', NULL, NULL),
(6, 'Security Systems (ex- CCTV cameras, alarm systems)', 2, b'1', 1, '2024-09-08 02:08:11', NULL, NULL),
(7, 'Elevator/Lift Access', 2, b'1', 1, '2024-09-08 02:08:11', NULL, NULL),
(8, 'Balcony/Terrace', 2, b'1', 1, '2024-09-08 02:08:11', NULL, NULL),
(9, 'Backup Generator', 2, b'1', 1, '2024-09-08 02:08:11', NULL, NULL),
(10, 'A/C', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(11, 'Airbags', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(12, 'FM Radio', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(13, 'Bluetooth', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(14, 'Sound System', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(15, 'Reverse Camera', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(16, 'Front Camera', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(17, 'Key Start', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(18, 'Power Window', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(19, 'Power Mirror', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(20, 'Power Steering', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(21, 'Push Start', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(22, 'Dual A/C', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(23, 'Power Boot', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(24, 'Electric Seats', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(25, 'Panoramic Sunroof', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(26, 'DVD', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(27, 'TV', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(28, 'USB Port', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(29, 'Jumping Cable', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(30, 'Spare Wheel', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(31, 'Tool Kit', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(32, 'Boot Space', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(33, 'Air Pump', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(34, 'Android Sound System', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(35, 'Fog Lights', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL),
(36, 'Auto Door', 1, b'1', 1, '2024-09-29 17:29:53', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `inquiry`
--

CREATE TABLE `inquiry` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `contactNumber` varchar(10) NOT NULL,
  `message` varchar(500) NOT NULL,
  `status` varchar(25) NOT NULL,
  `remarks` varchar(100) DEFAULT NULL,
  `rentalTypeID` int(11) NOT NULL,
  `vehicleID` int(11) DEFAULT NULL,
  `holidayHomeID` int(11) DEFAULT NULL,
  `propertyID` int(11) DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inquiry`
--

INSERT INTO `inquiry` (`id`, `name`, `email`, `contactNumber`, `message`, `status`, `remarks`, `rentalTypeID`, `vehicleID`, `holidayHomeID`, `propertyID`, `updatedDate`, `updatedBy`, `startDate`, `endDate`) VALUES
(1, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'I need to rent this vehicles on the above dates to go to jaffna', 'Pending', NULL, 1, 25, NULL, NULL, '2025-01-25 02:39:22', 0, '2025-09-11', '2025-09-13'),
(2, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'I need to rent this vehicles on the above dates to go to jaffna', 'Pending', NULL, 1, 25, NULL, NULL, '2025-01-25 02:42:30', 0, '2025-09-11', '2025-09-13'),
(3, 'Yusuf Sadurdeen', 'yusufsadur@gmail.com', '0763493828', 'sdfgsfd', 'Pending', NULL, 3, NULL, 1, NULL, '2025-01-25 09:06:10', 0, '2025-01-25', '2025-01-25'),
(4, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'KDH details needed', 'Pending', NULL, 1, 22, NULL, NULL, '2025-01-25 09:57:20', 0, '2025-02-02', '2025-02-02'),
(5, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'KDH', 'Pending', NULL, 1, 22, NULL, NULL, '2025-01-25 09:59:02', 0, '2025-02-09', '2025-02-09'),
(6, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'Testing data ', 'Pending', NULL, 1, 16, NULL, NULL, '2025-01-25 10:05:02', 0, '2025-02-09', '2025-02-09'),
(7, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'Axio needed for nuwara eliya, is it in good condition?', 'Pending', NULL, 1, 16, NULL, NULL, '2025-01-25 10:06:52', 0, '2025-02-05', '2025-02-05'),
(8, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'avanza good condition?', 'Pending', NULL, 1, 13, NULL, NULL, '2025-01-25 10:09:18', 0, '2025-02-09', '2025-02-09'),
(9, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'is it in good condition', 'Pending', NULL, 1, 13, NULL, NULL, '2025-01-25 10:09:41', 0, '2025-02-09', '2025-02-16'),
(10, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'is KDH good condition?', 'Pending', NULL, 1, 22, NULL, NULL, '2025-01-25 10:10:07', 0, '2025-02-06', '2025-02-06'),
(11, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'twst', 'Pending', NULL, 3, NULL, 1, NULL, '2025-01-25 10:11:10', 0, '2025-02-09', '2025-02-09'),
(12, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'Test data', 'Pending', NULL, 3, NULL, 1, NULL, '2025-01-25 10:12:38', 0, '2025-03-23', '2025-03-23'),
(13, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'test avanza', 'Pending', NULL, 1, 13, NULL, NULL, '2025-01-25 10:15:35', 0, '2025-02-02', '2025-02-02'),
(14, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'test', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:16:20', 0, '2025-02-02', '2025-02-02'),
(15, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'test', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:18:18', 0, '2025-02-02', '2025-02-02'),
(16, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'test', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:18:25', 0, '2025-02-02', '2025-02-02'),
(17, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'test details', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:20:49', 0, '2025-02-09', '2025-02-09'),
(18, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'abhlkyjhvcwdghrjukyilk uikujtyhrefwqwg', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:22:19', 0, '2025-02-08', '2025-02-08'),
(19, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'need more info in regard to the vehicle', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:24:40', 0, '2025-02-23', '2025-02-23'),
(20, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'asasa', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:26:34', 0, '2025-02-08', '2025-02-08'),
(21, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'assa', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:29:17', 0, '2025-02-04', '2025-02-04'),
(22, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'assa', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:31:33', 0, '2025-02-04', '2025-02-04'),
(23, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'sa', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:36:50', 0, '2025-02-02', '2025-02-02'),
(24, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'as', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:38:49', 0, '2025-02-02', '2025-02-02'),
(25, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'fianlly', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:41:25', 0, '2025-02-01', '2025-02-01'),
(26, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'test one date', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:49:32', 0, '2025-02-23', '2025-02-23'),
(27, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'aa', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:53:40', 0, '2025-02-02', '2025-02-02'),
(28, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'bbb', 'Pending', NULL, 1, 7, NULL, NULL, '2025-01-25 10:54:03', 0, '2025-02-09', '2025-03-16'),
(29, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'avanza', 'Pending', NULL, 1, 13, NULL, NULL, '2025-01-25 10:55:48', 0, '2025-02-01', '2025-03-08'),
(30, 'Sarala Ekanayake', 'saralaekanayake46@gmail.com', '0782385355', 'second - from vehicle', 'Pending', NULL, 1, 13, NULL, NULL, '2025-01-25 11:09:42', 0, '2025-01-31', '2025-01-31'),
(31, 'Sarala Ekanayake', 'saralaekanayake46@gmail.com', '0782385355', 'homes page', 'Pending', NULL, 3, NULL, 1, NULL, '2025-01-25 11:20:37', 0, '2025-02-05', '2025-02-05'),
(32, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'Suzuki Wagon R (2017), is it in good condition?', 'Pending', NULL, 1, 24, NULL, NULL, '2025-01-25 15:45:38', 0, '2025-05-11', '2025-05-11'),
(33, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'test', 'Pending', NULL, 1, 24, NULL, NULL, '2025-01-25 15:48:52', 0, '2025-03-15', '2025-03-23'),
(34, 'Ahmed Ismail', 'ahmedhussainismail95@gmail.com', '0771472477', 'one day', 'Pending', NULL, 1, 24, NULL, NULL, '2025-01-25 15:49:36', 0, '2025-02-15', '2025-02-15'),
(35, 'Ravi', 'ravicsk83@gmail.com', '0768831811', 'I need a car ', 'Pending', NULL, 1, 12, NULL, NULL, '2025-05-10 22:02:32', 0, '2025-05-16', '2025-05-16');

-- --------------------------------------------------------

--
-- Table structure for table `property`
--

CREATE TABLE `property` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `propertyType` varchar(25) NOT NULL,
  `propertyClass` varchar(10) NOT NULL,
  `numOfBedrooms` int(11) NOT NULL,
  `numOfBathrooms` int(11) NOT NULL,
  `numOfVehicleParking` int(11) NOT NULL,
  `description` varchar(500) NOT NULL,
  `furnishDetails` varchar(15) NOT NULL,
  `floor` varchar(25) DEFAULT NULL,
  `dailyCharge` decimal(10,0) DEFAULT NULL,
  `weeklyCharge` decimal(10,0) DEFAULT NULL,
  `monthlyCharge` decimal(10,0) DEFAULT NULL,
  `isFeatured` bit(1) NOT NULL,
  `isActive` bit(1) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL,
  `rentalTypeID` int(11) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property`
--

INSERT INTO `property` (`id`, `name`, `address`, `propertyType`, `propertyClass`, `numOfBedrooms`, `numOfBathrooms`, `numOfVehicleParking`, `description`, `furnishDetails`, `floor`, `dailyCharge`, `weeklyCharge`, `monthlyCharge`, `isFeatured`, `isActive`, `createdBy`, `createdDate`, `updatedBy`, `updatedDate`, `rentalTypeID`, `image`) VALUES
(1, 'Span Tower 19', '209 Galvihara Rd Dehiwala', 'Apartment', 'Standard', 3, 2, 1, 'A cosy apartment ideal for comfortable living. ', 'Semi Furnished', NULL, NULL, NULL, NULL, b'0', b'0', 1, '2024-09-08 10:00:00', NULL, NULL, 2, 'https://ytsenterprise.com/images/vehiclesAndProperties/spanTower19-1.jpg'),
(2, 'Span Tower 24', 'Dharmarama Rd Colombo 6', 'Apartment', 'Standard', 3, 2, 1, 'A cosy apartment ideal for comfortable living. ', 'Unfurnished', NULL, NULL, NULL, NULL, b'0', b'0', 1, '2024-09-08 10:00:00', NULL, NULL, 2, 'https://ytsenterprise.com/images/vehiclesAndProperties/spanTower24-1.jpg'),
(3, '606 The Address', '606 The Address Colombo 3', 'Apartment', 'Luxury', 3, 3, 2, 'Located in the prime city of Colombo. With modern facilities and amenities.', 'Fully Furnished', '13', NULL, NULL, NULL, b'0', b'0', 1, '2024-10-23 19:26:42', NULL, NULL, 2, 'https://ytsenterprise.com/images/vehiclesAndProperties/606TheAddress-1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `propertyAvailability`
--

CREATE TABLE `propertyAvailability` (
  `id` int(11) NOT NULL,
  `propertyID` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `propertyAvailability`
--

INSERT INTO `propertyAvailability` (`id`, `propertyID`, `startDate`, `endDate`, `createdBy`, `createdDate`, `updatedBy`, `updatedDate`) VALUES
(1, 1, '2024-09-18', '2024-09-25', 1, '2024-09-16 11:29:30', NULL, NULL),
(2, 2, '2024-10-05', '2024-10-12', 1, '2024-09-16 11:29:30', NULL, NULL),
(3, 1, '2024-11-01', '2024-11-07', 1, '2024-09-16 11:29:30', NULL, NULL),
(4, 2, '2024-12-15', '2024-12-22', 1, '2024-09-16 11:29:30', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `propertyfeatures`
--

CREATE TABLE `propertyfeatures` (
  `id` int(11) NOT NULL,
  `propertyID` int(11) NOT NULL,
  `featureID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `propertyfeatures`
--

INSERT INTO `propertyfeatures` (`id`, `propertyID`, `featureID`) VALUES
(1, 1, 2),
(2, 1, 3),
(3, 1, 4),
(4, 1, 5),
(5, 1, 6),
(6, 1, 7),
(7, 1, 8),
(8, 2, 2),
(9, 2, 3),
(10, 2, 4),
(11, 2, 5),
(12, 2, 7),
(13, 2, 8),
(14, 2, 9);

-- --------------------------------------------------------

--
-- Table structure for table `propertyImages`
--

CREATE TABLE `propertyImages` (
  `numID` int(11) NOT NULL,
  `propertyID` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `propertyImages`
--

INSERT INTO `propertyImages` (`numID`, `propertyID`, `image`) VALUES
(1, 3, 'https://ytsenterprise.com/images/vehiclesAndProperties/606TheAddress-1.jpg'),
(2, 2, 'https://ytsenterprise.com/images/vehiclesAndProperties/spanTower24-1.jpg'),
(3, 1, 'https://ytsenterprise.com/images/vehiclesAndProperties/spanTower19-1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `rentalType`
--

CREATE TABLE `rentalType` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `isActive` bit(1) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rentalType`
--

INSERT INTO `rentalType` (`id`, `name`, `isActive`, `createdBy`, `createdDate`, `updatedBy`, `updatedDate`) VALUES
(1, 'Vehicle', b'1', 1, '2024-08-31 10:00:00', NULL, NULL),
(2, 'Property', b'1', 1, '2024-08-31 10:00:00', NULL, NULL),
(3, 'Holiday Home', b'1', 1, '2024-08-31 10:00:00', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`) VALUES
(1, 'Ahmed', 'ahmed@example.com'),
(2, 'Yusuf', 'yusuf@example.com'),
(3, 'Sakeena', 'sakeena@example.com');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle`
--

CREATE TABLE `vehicle` (
  `id` int(11) NOT NULL,
  `make` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `year` varchar(4) DEFAULT NULL,
  `fuelType` varchar(10) NOT NULL,
  `transmission` varchar(15) NOT NULL,
  `numOfPassengers` int(11) NOT NULL,
  `vehicleClass` varchar(50) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `color` varchar(25) NOT NULL,
  `bodyStyle` varchar(25) NOT NULL,
  `dailyCharge` decimal(10,2) NOT NULL,
  `weeklyCharge` decimal(10,2) NOT NULL,
  `monthlyCharge` decimal(10,2) NOT NULL,
  `isFeatured` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL,
  `rentalTypeId` int(11) NOT NULL,
  `NumberPlate` varchar(10) NOT NULL DEFAULT '',
  `image` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicle`
--

INSERT INTO `vehicle` (`id`, `make`, `model`, `year`, `fuelType`, `transmission`, `numOfPassengers`, `vehicleClass`, `description`, `color`, `bodyStyle`, `dailyCharge`, `weeklyCharge`, `monthlyCharge`, `isFeatured`, `isActive`, `createdBy`, `createdDate`, `updatedBy`, `updatedDate`, `rentalTypeId`, `NumberPlate`, `image`) VALUES
(2, 'Suzuki', 'Wagon R (2018)', '2018', 'Petrol 95', 'Automatic', 5, 'Economy', 'Ideal Car for urban driving with easy maneuverability and parking. Tall-boy design offers ample headroom and a comfortable cabin. Efficient engine delivers excellent fuel economy.', 'Blue', 'Hatchback', 7500.00, 75000.00, 125000.00, 0, 1, 1, '2024-09-29 16:52:29', NULL, NULL, 1, 'CBH 7053', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBH7053-1.jpg'),
(3, 'Suzuki', 'Wagon R (2017)', '2017', 'Petrol 95', 'Automatic', 5, 'Economy', 'Ideal for urban driving with easy maneuverability and parking. Tall-boy design offers ample headroom and a comfortable cabin. Efficient engine delivers excellent fuel economy.', 'Black', 'Hatchback', 7500.00, 75000.00, 125000.00, 0, 1, 1, '2024-09-29 16:52:29', NULL, NULL, 1, 'CBD 0787', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBD0787-1.jpg'),
(4, 'Suzuki', 'Wagon R (2017)', '2017', 'Petrol 95', 'Automatic', 5, 'Economy', 'Ideal for urban driving with easy maneuverability and parking. Tall-boy design offers ample headroom and a comfortable cabin. Efficient engine delivers excellent fuel economy.', 'White', 'Hatchback', 7500.00, 75000.00, 125000.00, 0, 1, 1, '2024-09-29 17:04:48', NULL, NULL, 1, 'CBD 1826', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBD1826-1.jpg'),
(6, 'Honda', 'N Wagon (2016)', '2016', 'Petrol 95', 'Automatic', 5, 'Economy', 'Engineered for excellent fuel efficiency, ideal for city driving. Flexible seating and cargo configurations to meet various needs. Perfect for daily commutes and weekend getaways, combining practicality with style.', 'Silver', 'Hatchback', 7500.00, 75000.00, 125000.00, 0, 1, 1, '2024-09-29 17:04:48', NULL, NULL, 1, 'CBI 2070', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBI2070-1.jpg'),
(7, 'Toyota', 'Vellfire (2014)', '2014', 'Petrol 95', 'Automatic', 7, 'Luxury', 'Distinctive design with a sleek, modern appearance. Equipped with a robust engine for smooth and responsive driving. Includes features like climate control, power-adjustable seats, and ample storage.', 'Purple', 'Minivan', 17500.00, 220000.00, 425000.00, 1, 1, 1, '2024-09-29 17:04:48', NULL, NULL, 1, 'CAQ 0009', 'https://ytsenterprise.com/images/vehiclesAndProperties/CAQ0009-1.jpg'),
(8, 'Suzuki', 'Stingray VXI0 (2016)', '2016', 'Petrol 95', 'Automatic', 5, 'Economy', 'Ideal for urban driving with easy maneuverability and parking. Tall-boy design offers ample headroom and a comfortable cabin. Efficient engine delivers excellent fuel economy.', 'Red', 'Hatchback', 7500.00, 75000.00, 125000.00, 0, 1, 1, '2024-09-29 17:04:48', NULL, NULL, 1, 'CAV 2940', 'https://ytsenterprise.com/images/vehiclesAndProperties/CAV2940-1.jpg'),
(9, 'Suzuki', 'Wagon R (2017)', '2017', 'Petrol 95', 'Automatic', 5, 'Economy', 'Ideal for urban driving with easy maneuverability and parking. Tall-boy design offers ample headroom and a comfortable cabin. Efficient engine delivers excellent fuel economy.', 'Gold', 'Hatchback', 7500.00, 75000.00, 125000.00, 0, 1, 1, '2024-09-29 17:04:48', NULL, NULL, 1, 'CAW 2732', 'https://ytsenterprise.com/images/vehiclesAndProperties/CAW2732-1.jpg'),
(10, 'Hyundai', 'Grand i10 (2023)', '2023', 'Petrol 95', 'Automatic', 5, 'Economy', 'Modern design perfect for urban driving. Economical engine offering excellent fuel economy. Clever use of space provides a comfortable cabin for passengers.', 'White', 'Hatchback', 8500.00, 120000.00, 225000.00, 0, 1, 1, '2024-09-29 17:04:48', NULL, NULL, 1, 'CBM 3556', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3556-1.jpg'),
(11, 'Hyundai', 'Grand i10 (2023)', '2023', 'Petrol 95', 'Automatic', 5, 'Economy', 'Modern design perfect for urban driving. Economical engine offering excellent fuel economy. Clever use of space provides a comfortable cabin for passengers.', 'White', 'Hatchback', 8500.00, 120000.00, 225000.00, 0, 1, 1, '2024-09-29 17:09:44', NULL, NULL, 1, 'CBM 3557', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3557-1.jpg'),
(12, 'Hyundai', 'Grand i10 (2023)', '2023', 'Petrol 95', 'Automatic', 5, 'Economy', 'Modern design perfect for urban driving. Economical engine offering excellent fuel economy. Clever use of space provides a comfortable cabin for passengers.', 'Red', 'Hatchback', 8500.00, 120000.00, 225000.00, 0, 1, 1, '2024-09-29 17:09:44', NULL, NULL, 1, 'CBM 3558', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3558-1.jpg'),
(13, 'Toyota', 'Avanza (2016)', '2016', 'Petrol 95', 'Automatic', 7, 'Economy', 'Offers ample room for passengers and cargo with versatile seating configurations. Ideal for family trips, daily commutes, and various transportation needs, combining practicality with reliability.', 'White', 'Hatchback', 10500.00, 150000.00, 280000.00, 1, 1, 1, '2024-09-29 17:09:44', NULL, NULL, 1, 'CAP 4898', 'https://ytsenterprise.com/images/vehiclesAndProperties/CAP4898-1.jpg'),
(14, 'MG', 'ZS (2019)', '2019', 'Petrol 95', 'Automatic', 5, 'Economy', 'Ideal for family outings, daily commuting, and diverse transportation needs, combining practicality with reliability for an enjoyable driving experience.', 'Black', 'SUV', 10500.00, 162000.00, 300000.00, 0, 1, 1, '2024-09-29 17:09:44', NULL, NULL, 1, 'CBG 0932', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBG0932-1.jpg'),
(15, 'Honda', 'Fit GP5 (2015)', '2015', 'Petrol 95', 'Automatic', 5, 'Economy', 'Exceptional fuel efficiency due to hybrid powertrain, reducing fuel costs and environmental impact. Smooth and responsive handling, perfect for both city driving and longer journeys.', 'Blue', 'Hatchback', 7500.00, 75000.00, 135000.00, 0, 1, 1, '2024-09-29 17:09:44', NULL, NULL, 1, 'CAE 5685', 'https://ytsenterprise.com/images/vehiclesAndProperties/CAE5685-1.jpg'),
(16, 'Toyota', 'Axio (2018)', '2018', 'Petrol 95', 'Automatic', 5, 'Economy', 'Known for excellent fuel economy, making it cost-effective for daily use. Offers a comfortable and spacious interior, suitable for both driver and passengers.', 'Black', 'Sedan', 10000.00, 150000.00, 290000.00, 1, 1, 1, '2024-09-29 17:09:44', NULL, NULL, 1, 'CBJ 8653', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBJ8653-1.jpg'),
(17, 'Honda', 'N Box (2017)', '2017', 'Petrol 95', 'Automatic', 5, 'Economy', 'Tall-boy design provides generous headroom and a roomy cabin. Engine offers excellent fuel economy, ideal for city commutes. Blends practicality with a sleek, modern look, suitable for daily use and family outings.', 'White', 'Hatchback', 7500.00, 75000.00, 125000.00, 0, 1, 1, '2024-09-29 17:13:59', NULL, NULL, 1, 'CBK 7998', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBK7998-1.jpg'),
(18, 'Honda', 'N Box (2017)', '2017', 'Petrol 95', 'Automatic', 5, 'Economy', 'Tall-boy design provides generous headroom and a roomy cabin. Engine offers excellent fuel economy, ideal for city commutes. Blends practicality with a sleek, modern look, suitable for daily use and family outings.', 'Black', 'Hatchback', 7500.00, 75000.00, 125000.00, 0, 1, 1, '2024-09-29 17:13:59', NULL, NULL, 1, 'CBL 0749', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBL0749-1.jpg'),
(19, 'Honda', 'N Wagon (2016)', '2016', 'Petrol 95', 'Automatic', 5, 'Economy', 'Engineered for excellent fuel efficiency, ideal for city driving. Flexible seating and cargo configurations to meet various needs. Perfect for daily commutes and weekend getaways, combining practicality with style.', 'Purple', 'Hatchback', 7500.00, 75000.00, 125000.00, 0, 1, 1, '2024-09-29 17:13:59', NULL, NULL, 1, 'CBF 2869', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBF2869-1.jpg'),
(21, 'Suzuki', 'Wagon R (2017)', '2017', 'Petrol 95', 'Automatic', 5, 'Economy', 'Ideal for urban driving with easy maneuverability and parking. Tall-boy design offers ample headroom and a comfortable cabin. Efficient engine delivers excellent fuel economy.', 'Green', 'Hatchback', 7500.00, 75000.00, 125000.00, 0, 1, 1, '2024-09-29 17:13:59', NULL, NULL, 1, 'CBA 6203', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBA6203-1.jpg'),
(22, 'Toyota', 'Hiace (2018)', '2018', 'Petrol 95', 'Automatic', 10, 'Economy', 'Designed to accommodate multiple passengers or large cargo loads.', 'White', 'Van', 15000.00, 0.00, 0.00, 1, 1, 1, '2024-09-29 17:15:15', NULL, NULL, 1, 'PJ 7828', 'https://ytsenterprise.com/images/vehiclesAndProperties/PJ7828-1.jpg'),
(23, 'Honda', 'Fit GP5', NULL, 'Petrol 95', 'Automatic', 5, 'Economy', 'Exceptional fuel efficiency due to hybrid powertrain, reducing fuel costs and environmental impact. Smooth and responsive handling, perfect for both city driving and longer journeys.', 'Gold', 'Hatchback', 7500.00, 75000.00, 135000.00, 0, 1, 1, '2024-10-06 00:26:28', NULL, NULL, 1, 'CAG 2231', 'https://ytsenterprise.com/images/vehiclesAndProperties/CAG2231-1.jpg'),
(24, 'Suzuki', 'Wagon R (2017)', '2017', 'Petrol 95', 'Automatic', 5, 'Economy', 'Ideal Car for urban driving with easy maneuverability and parking. Tall-boy design offers ample headroom and a comfortable cabin. Efficient engine delivers excellent fuel economy.\r\n\r\n', 'Grey', 'Hatchback', 7500.00, 75000.00, 125000.00, 0, 1, 1, '2024-12-14 13:03:08', NULL, NULL, 1, 'CAV 0987', 'https://ytsenterprise.com/images/vehiclesAndProperties/CAV0987-1.jpg'),
(25, 'Nissan', 'Dayz (2017)', '2017', 'Petrol 95', 'Automatic', 5, 'Economy ', 'Ideal Car for urban driving with easy maneuverability and parking. Tall-boy design offers ample headroom and a comfortable cabin.\r\nEfficient engine delivers excellent fuel economy.\r\n', 'Orange', 'Hatchback', 7500.00, 75000.00, 125000.00, 0, 1, 1, '2024-12-14 13:07:34', NULL, NULL, 1, 'CBE 8986', 'https://ytsenterprise.com/images/vehiclesAndProperties/CBE8986-1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `vehicleAvailability`
--

CREATE TABLE `vehicleAvailability` (
  `id` int(11) NOT NULL,
  `vehicleId` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicleAvailability`
--

INSERT INTO `vehicleAvailability` (`id`, `vehicleId`, `startDate`, `endDate`, `createdBy`, `createdDate`, `updatedBy`, `updatedDate`) VALUES
(36, 12, '2025-01-01', '2025-02-15', 1, '2025-01-19 16:52:29', NULL, NULL),
(37, 24, '2025-01-01', '2025-02-12', 1, '2025-01-19 16:52:29', NULL, NULL),
(38, 8, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(39, 2, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(40, 3, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(41, 4, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(42, 9, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(43, 14, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(44, 6, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(45, 10, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(46, 11, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(47, 15, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(48, 17, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(49, 18, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(50, 19, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(51, 21, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(52, 23, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL),
(53, 25, '2025-01-01', '2025-08-31', 1, '2025-01-19 16:52:29', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vehicleFeature`
--

CREATE TABLE `vehicleFeature` (
  `id` int(11) NOT NULL,
  `vehicleId` int(11) NOT NULL,
  `featureId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicleFeature`
--

INSERT INTO `vehicleFeature` (`id`, `vehicleId`, `featureId`) VALUES
(2, 2, 10),
(3, 2, 11),
(4, 2, 12),
(5, 2, 13),
(6, 2, 14),
(7, 2, 15),
(8, 2, 16),
(9, 2, 17),
(10, 2, 18),
(11, 2, 19),
(12, 2, 20),
(13, 3, 10),
(14, 3, 11),
(15, 3, 12),
(16, 3, 13),
(17, 3, 14),
(18, 3, 15),
(19, 3, 21),
(20, 3, 18),
(21, 3, 19),
(22, 3, 20),
(23, 4, 10),
(24, 4, 11),
(25, 4, 12),
(26, 4, 13),
(27, 4, 14),
(28, 4, 15),
(29, 4, 21),
(30, 4, 18),
(31, 4, 19),
(32, 4, 20),
(42, 6, 10),
(43, 6, 14),
(44, 6, 11),
(45, 6, 12),
(46, 6, 15),
(47, 6, 21),
(48, 6, 18),
(49, 6, 19),
(50, 6, 20),
(51, 7, 22),
(52, 7, 23),
(53, 7, 24),
(54, 7, 25),
(55, 7, 26),
(56, 7, 27),
(57, 7, 11),
(58, 7, 12),
(59, 7, 13),
(60, 7, 15),
(61, 7, 18),
(62, 7, 28),
(63, 7, 29),
(64, 7, 30),
(65, 7, 31),
(66, 8, 10),
(67, 8, 14),
(68, 8, 11),
(69, 8, 12),
(70, 8, 15),
(71, 8, 21),
(72, 8, 18),
(73, 8, 19),
(74, 8, 20),
(75, 9, 10),
(76, 9, 14),
(77, 9, 11),
(78, 9, 12),
(79, 9, 15),
(80, 9, 21),
(81, 9, 18),
(82, 9, 19),
(83, 9, 20),
(84, 10, 10),
(85, 10, 14),
(86, 10, 11),
(87, 10, 12),
(88, 10, 15),
(89, 10, 21),
(90, 10, 28),
(91, 10, 30),
(92, 10, 31),
(93, 10, 18),
(94, 10, 19),
(95, 10, 20),
(96, 11, 10),
(97, 11, 14),
(98, 11, 11),
(99, 11, 12),
(100, 11, 15),
(101, 11, 21),
(102, 11, 28),
(103, 11, 30),
(104, 11, 31),
(105, 11, 18),
(106, 11, 19),
(107, 11, 20),
(108, 12, 10),
(109, 12, 14),
(110, 12, 11),
(111, 12, 12),
(112, 12, 15),
(113, 12, 21),
(114, 12, 28),
(115, 12, 31),
(116, 12, 18),
(117, 12, 19),
(118, 12, 20),
(159, 13, 22),
(160, 13, 34),
(161, 13, 11),
(162, 13, 32),
(163, 13, 33),
(164, 13, 35),
(165, 13, 36),
(166, 14, 10),
(167, 14, 34),
(168, 14, 11),
(169, 14, 12),
(170, 14, 13),
(171, 14, 15),
(172, 14, 21),
(173, 14, 28),
(174, 14, 32),
(175, 14, 30),
(176, 14, 31),
(177, 14, 18),
(178, 14, 19),
(179, 14, 20),
(180, 15, 10),
(181, 15, 34),
(182, 15, 11),
(183, 15, 12),
(184, 15, 13),
(185, 15, 15),
(186, 15, 21),
(187, 15, 28),
(188, 15, 32),
(189, 15, 10),
(190, 15, 30),
(191, 15, 31),
(192, 15, 18),
(193, 15, 19),
(194, 15, 20),
(210, 16, 10),
(211, 16, 34),
(212, 16, 11),
(213, 16, 12),
(214, 16, 13),
(215, 16, 15),
(216, 16, 21),
(217, 16, 28),
(218, 16, 32),
(219, 16, 30),
(220, 16, 31),
(221, 16, 18),
(222, 16, 19),
(223, 16, 25),
(224, 16, 20),
(225, 17, 10),
(226, 17, 34),
(227, 17, 11),
(228, 17, 12),
(229, 17, 13),
(230, 17, 15),
(231, 17, 21),
(232, 17, 28),
(233, 17, 32),
(234, 17, 18),
(235, 17, 19),
(236, 17, 33),
(237, 17, 20),
(238, 17, 10),
(239, 17, 34),
(240, 17, 11),
(241, 17, 12),
(242, 17, 13),
(243, 17, 15),
(244, 17, 21),
(245, 17, 28),
(246, 17, 32),
(247, 17, 18),
(248, 17, 19),
(249, 17, 33),
(250, 17, 20),
(251, 18, 10),
(252, 18, 34),
(253, 18, 11),
(254, 18, 12),
(255, 18, 13),
(256, 18, 15),
(257, 18, 21),
(258, 18, 28),
(259, 18, 32),
(260, 18, 18),
(261, 18, 19),
(262, 18, 33),
(263, 18, 20),
(264, 19, 10),
(265, 19, 34),
(266, 19, 11),
(267, 19, 12),
(268, 19, 13),
(269, 19, 15),
(270, 19, 21),
(271, 19, 28),
(272, 19, 32),
(273, 19, 18),
(274, 19, 19),
(275, 19, 33),
(276, 19, 20),
(292, 21, 10),
(293, 21, 14),
(294, 21, 11),
(295, 21, 12),
(296, 21, 13),
(297, 21, 15),
(298, 21, 21),
(299, 21, 18),
(300, 21, 19),
(301, 21, 20),
(302, 22, 10),
(303, 22, 14),
(304, 22, 11),
(305, 22, 12),
(306, 22, 13),
(307, 22, 15),
(308, 22, 21),
(309, 22, 18),
(310, 22, 19),
(311, 22, 20),
(312, 23, 10),
(313, 23, 34),
(314, 23, 11),
(315, 23, 12),
(316, 23, 13),
(317, 23, 15),
(318, 23, 21),
(319, 23, 28),
(320, 23, 32),
(321, 23, 30),
(322, 23, 31),
(323, 23, 18),
(324, 23, 19),
(325, 23, 20),
(326, 25, 10),
(327, 25, 11),
(328, 25, 12),
(329, 25, 13),
(330, 25, 14),
(331, 25, 15),
(332, 25, 16),
(333, 25, 17),
(334, 25, 18),
(335, 25, 19),
(336, 25, 20),
(337, 24, 10),
(338, 24, 11),
(339, 24, 12),
(340, 24, 13),
(341, 24, 14),
(342, 24, 15),
(343, 24, 16),
(344, 24, 17),
(345, 24, 18),
(346, 24, 19),
(347, 24, 20);

-- --------------------------------------------------------

--
-- Table structure for table `vehicleImages`
--

CREATE TABLE `vehicleImages` (
  `numID` int(11) NOT NULL,
  `vehicleID` int(11) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicleImages`
--

INSERT INTO `vehicleImages` (`numID`, `vehicleID`, `image`) VALUES
(1, 22, 'https://ytsenterprise.com/images/vehiclesAndProperties/PJ7828-1.jpg'),
(2, 22, 'https://ytsenterprise.com/images/vehiclesAndProperties/PJ7828-2.jpg'),
(3, 22, 'https://ytsenterprise.com/images/vehiclesAndProperties/PJ7828-3.jpg'),
(4, 22, 'https://ytsenterprise.com/images/vehiclesAndProperties/PJ7828-4.jpg'),
(5, 22, 'https://ytsenterprise.com/images/vehiclesAndProperties/PJ7828-5.jpg'),
(10, 12, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3558-1.jpg'),
(11, 12, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3558-2.jpg'),
(12, 12, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3558-3.jpg'),
(13, 12, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3558-4.jpg'),
(14, 11, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3557-1.jpg'),
(15, 11, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3557-2.jpg'),
(16, 11, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3557-3.jpg'),
(17, 17, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBK7998-1.jpg'),
(18, 17, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBK7998-2.jpg'),
(19, 17, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBK7998-3.jpg'),
(20, 14, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBG0932-1.jpg'),
(21, 14, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBG0932-2.jpg'),
(22, 14, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBG0932-3.jpg'),
(23, 14, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBG0932-4.jpg'),
(24, 19, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBF2869-1.jpg'),
(25, 19, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBF2869-2.jpg'),
(26, 19, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBF2869-3.jpg'),
(27, 19, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBF2869-4.jpg'),
(28, 4, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBD1826-1.jpg'),
(29, 4, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBD1826-2.jpg'),
(30, 4, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBD1826-3.jpg'),
(31, 4, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBD1826-4.jpg'),
(32, 4, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBD1826-5.jpg'),
(33, 3, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBD0787-1.jpg'),
(34, 3, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBD0787-2.jpg'),
(35, 3, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBD0787-3.jpg'),
(36, 3, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBD0787-4.jpg'),
(37, 3, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBD0787-5.jpg'),
(43, 21, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBA6203-1.jpg'),
(44, 21, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBA6203-2.jpg'),
(45, 21, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBA6203-3.jpg'),
(46, 21, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBA6203-4.jpg'),
(47, 21, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBA6203-5.jpg'),
(48, 8, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAV2940-1.jpg'),
(49, 8, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAV2940-2.jpg'),
(50, 8, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAV2940-3.jpg'),
(51, 8, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAV2940-4.jpg'),
(52, 7, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAQ0009-1.jpg'),
(53, 7, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAQ0009-2.jpg'),
(54, 7, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAQ0009-3.jpg'),
(55, 7, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAQ0009-4.jpg'),
(56, 7, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAQ0009-5.jpg'),
(57, 13, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAP4898-1.jpg'),
(58, 13, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAP4898-2.jpg'),
(59, 13, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAP4898-3.jpg'),
(60, 13, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAP4898-4.jpg'),
(61, 15, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAE5685-1.jpg'),
(62, 15, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAE5685-2.jpg'),
(63, 15, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAE5685-3.jpg'),
(64, 9, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAW2732-1.jpg'),
(65, 9, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAW2732-2.jpg'),
(66, 9, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAW2732-3.jpg'),
(67, 9, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAW2732-4.jpg'),
(72, 23, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAG2231-1.jpg'),
(73, 23, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAG2231-2.jpg'),
(74, 23, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAG2231-3.jpg'),
(75, 23, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAG2231-4.jpg'),
(76, 23, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAG2231-5.jpg'),
(77, 18, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBL0749-1.jpg'),
(78, 18, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBL0749-2.jpg'),
(79, 18, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBL0749-3.jpg'),
(80, 18, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBL0749-4.jpg'),
(81, 18, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBL0749-5.jpg'),
(82, 6, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBI2070-1.jpg'),
(83, 6, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBI2070-2.jpg'),
(84, 6, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBI2070-3.jpg'),
(85, 6, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBI2070-4.jpg'),
(86, 2, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBH7053-1.jpg'),
(90, 2, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBH7053-2.jpg'),
(91, 2, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBH7053-3.jpg'),
(92, 2, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBH7053-4.jpg'),
(93, 24, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAV0987-1.jpg'),
(94, 24, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAV0987-2.jpg'),
(95, 24, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAV0987-3.jpg'),
(96, 24, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAV0987-4.jpg'),
(97, 24, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAV0987-5.jpg'),
(98, 24, 'https://ytsenterprise.com/images/vehiclesAndProperties/CAV0987-6.jpg'),
(99, 25, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBE8986-1.jpg'),
(100, 25, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBE8986-2.jpg'),
(101, 25, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBE8986-3.jpg'),
(102, 25, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBE8986-4.jpg'),
(103, 25, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBE8986-5.jpg'),
(104, 25, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBE8986-6.jpg'),
(105, 16, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBJ8653-1.jpg'),
(106, 16, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBJ8653-2.jpg'),
(107, 16, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBJ8653-3.jpg'),
(108, 16, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBJ8653-4.jpg'),
(109, 16, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBJ8653-5.jpg'),
(110, 10, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3556-1.jpg'),
(111, 10, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3556-2.jpg'),
(112, 10, 'https://ytsenterprise.com/images/vehiclesAndProperties/CBM3556-3.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feature`
--
ALTER TABLE `feature`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_Feature_RentalType` (`rentalId`);

--
-- Indexes for table `inquiry`
--
ALTER TABLE `inquiry`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rentalTypeID` (`rentalTypeID`),
  ADD KEY `vehicleID` (`vehicleID`),
  ADD KEY `fk_propertyID` (`propertyID`);

--
-- Indexes for table `property`
--
ALTER TABLE `property`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rentalTypeID` (`rentalTypeID`);

--
-- Indexes for table `propertyAvailability`
--
ALTER TABLE `propertyAvailability`
  ADD PRIMARY KEY (`id`),
  ADD KEY `propertyID` (`propertyID`);

--
-- Indexes for table `propertyfeatures`
--
ALTER TABLE `propertyfeatures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `propertyID` (`propertyID`),
  ADD KEY `featureID` (`featureID`);

--
-- Indexes for table `propertyImages`
--
ALTER TABLE `propertyImages`
  ADD PRIMARY KEY (`numID`),
  ADD KEY `propertyID` (`propertyID`);

--
-- Indexes for table `rentalType`
--
ALTER TABLE `rentalType`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_Vehicle_RentalType` (`rentalTypeId`);

--
-- Indexes for table `vehicleAvailability`
--
ALTER TABLE `vehicleAvailability`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_VehicleAvailability_Vehicle` (`vehicleId`);

--
-- Indexes for table `vehicleFeature`
--
ALTER TABLE `vehicleFeature`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_VehicleFeature_Vehicle` (`vehicleId`),
  ADD KEY `FK_VehicleFeature_Feature` (`featureId`);

--
-- Indexes for table `vehicleImages`
--
ALTER TABLE `vehicleImages`
  ADD PRIMARY KEY (`numID`),
  ADD KEY `vehicleID` (`vehicleID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `feature`
--
ALTER TABLE `feature`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `inquiry`
--
ALTER TABLE `inquiry`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `property`
--
ALTER TABLE `property`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `propertyAvailability`
--
ALTER TABLE `propertyAvailability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `propertyfeatures`
--
ALTER TABLE `propertyfeatures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `propertyImages`
--
ALTER TABLE `propertyImages`
  MODIFY `numID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rentalType`
--
ALTER TABLE `rentalType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `vehicleAvailability`
--
ALTER TABLE `vehicleAvailability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `vehicleFeature`
--
ALTER TABLE `vehicleFeature`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=348;

--
-- AUTO_INCREMENT for table `vehicleImages`
--
ALTER TABLE `vehicleImages`
  MODIFY `numID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `feature`
--
ALTER TABLE `feature`
  ADD CONSTRAINT `FK_Feature_RentalType` FOREIGN KEY (`rentalId`) REFERENCES `rentalType` (`id`);

--
-- Constraints for table `inquiry`
--
ALTER TABLE `inquiry`
  ADD CONSTRAINT `fk_propertyID` FOREIGN KEY (`propertyID`) REFERENCES `property` (`id`),
  ADD CONSTRAINT `inquiry_ibfk_1` FOREIGN KEY (`rentalTypeID`) REFERENCES `rentalType` (`id`),
  ADD CONSTRAINT `inquiry_ibfk_2` FOREIGN KEY (`vehicleID`) REFERENCES `vehicle` (`id`);

--
-- Constraints for table `property`
--
ALTER TABLE `property`
  ADD CONSTRAINT `property_ibfk_1` FOREIGN KEY (`rentalTypeID`) REFERENCES `rentalType` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `propertyAvailability`
--
ALTER TABLE `propertyAvailability`
  ADD CONSTRAINT `propertyAvailability_ibfk_1` FOREIGN KEY (`propertyID`) REFERENCES `property` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `propertyfeatures`
--
ALTER TABLE `propertyfeatures`
  ADD CONSTRAINT `propertyfeatures_ibfk_1` FOREIGN KEY (`propertyID`) REFERENCES `property` (`id`),
  ADD CONSTRAINT `propertyfeatures_ibfk_2` FOREIGN KEY (`featureID`) REFERENCES `feature` (`id`);

--
-- Constraints for table `propertyImages`
--
ALTER TABLE `propertyImages`
  ADD CONSTRAINT `propertyImages_ibfk_1` FOREIGN KEY (`propertyID`) REFERENCES `property` (`id`);

--
-- Constraints for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD CONSTRAINT `FK_Vehicle_RentalType` FOREIGN KEY (`rentalTypeId`) REFERENCES `rentalType` (`id`);

--
-- Constraints for table `vehicleAvailability`
--
ALTER TABLE `vehicleAvailability`
  ADD CONSTRAINT `FK_VehicleAvailability_Vehicle` FOREIGN KEY (`vehicleId`) REFERENCES `vehicle` (`id`);

--
-- Constraints for table `vehicleFeature`
--
ALTER TABLE `vehicleFeature`
  ADD CONSTRAINT `FK_VehicleFeature_Feature` FOREIGN KEY (`featureId`) REFERENCES `feature` (`id`),
  ADD CONSTRAINT `FK_VehicleFeature_Vehicle` FOREIGN KEY (`vehicleId`) REFERENCES `vehicle` (`id`);

--
-- Constraints for table `vehicleImages`
--
ALTER TABLE `vehicleImages`
  ADD CONSTRAINT `vehicleImages_ibfk_1` FOREIGN KEY (`vehicleID`) REFERENCES `vehicle` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
