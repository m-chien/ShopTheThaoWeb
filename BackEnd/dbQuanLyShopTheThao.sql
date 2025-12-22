-- 1. Chuyển sang master và xóa database nếu tồn tại
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'dbQuanLyShopTheThao')
BEGIN
	USE MASTER
    -- Chuyển sang master trong batch riêng
    ALTER DATABASE dbQuanLyShopTheThao SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE dbQuanLyShopTheThao;
END
GO  -- kết thúc batch, bắt buộc

-- 2. Tạo database mới
CREATE DATABASE dbQuanLyShopTheThao;
GO

-- 3. Chọn database vừa tạo để tạo các bảng
USE dbQuanLyShopTheThao;
GO
-- Bảng Category (DanhMucSP)
CREATE TABLE Category (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính, tự tăng, định danh duy nhất cho danh mục
    Name NVARCHAR(100) NOT NULL,               -- Tên danh mục sản phẩm
    Description NVARCHAR(500),                 -- Mô tả chi tiết về danh mục
    CreatedAt DATETIME DEFAULT GETDATE(),	   -- Ngày tạo danh mục, mặc định là ngày hiện tại
	image NVARCHAR(200) 
);


-- Bảng Brand (Thương hiệu)
CREATE TABLE Brand (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính, tự tăng
    Name NVARCHAR(100) NOT NULL,               -- Tên thương hiệu
    Logo NVARCHAR(200)                         -- Đường dẫn hoặc URL logo
);


-- Bảng Product (Sản phẩm)
CREATE TABLE Product (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    CategoryID INT NOT NULL,                   -- FK liên kết tới Category(ID)
    BrandID INT NOT NULL,                      -- FK liên kết tới Brand(ID)
    Name NVARCHAR(100) NOT NULL,               -- Tên sản phẩm
    Description NVARCHAR(500),                 -- Mô tả sản phẩm
    CreatedAt DATETIME DEFAULT GETDATE(),      -- Ngày tạo sản phẩm
    Status BIT DEFAULT 1,                      -- Trạng thái sản phẩm (1: active, 0: inactive)
    CONSTRAINT FK_Product_Category FOREIGN KEY (CategoryID) REFERENCES Category(ID),
    CONSTRAINT FK_Product_Brand FOREIGN KEY (BrandID) REFERENCES Brand(ID)
);


-- Bảng Size
CREATE TABLE Size (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    Name NVARCHAR(50) NOT NULL,                -- Tên size (S, M, L…)
    Length DECIMAL(10,2),                      -- Chiều dài
    Width DECIMAL(10,2),                       -- Chiều rộng
    Weight DECIMAL(10,2),                      -- Trọng lượng
    Height DECIMAL(10,2)                       -- Chiều cao
);


-- Bảng Color
CREATE TABLE Color (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    Name NVARCHAR(50) NOT NULL,                -- Tên màu
	colorCode varchar(10)
);


-- Bảng ProductVariant (Biến thể sản phẩm)
CREATE TABLE ProductVariant (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    ProductID INT NOT NULL,                     -- FK tới Product(ID)
    SizeID INT NOT NULL,                        -- FK tới Size(ID)
    ColorID INT NOT NULL,                       -- FK tới Color(ID)
    StockQuantity INT DEFAULT 0,                -- Số lượng tồn kho
    Price DECIMAL(18,2) NOT NULL,              -- Giá bán
	Image NVARCHAR(200),                       -- Đường dẫn hoặc URL hình ảnh
	NgayNhap DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_ProductVariant_Product FOREIGN KEY (ProductID) REFERENCES Product(ID),
    CONSTRAINT FK_ProductVariant_Size FOREIGN KEY (SizeID) REFERENCES Size(ID),
    CONSTRAINT FK_ProductVariant_Color FOREIGN KEY (ColorID) REFERENCES Color(ID)
);


CREATE TABLE [User] (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    UserName NVARCHAR(100) NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255),
    FullName NVARCHAR(255),

    -- Thuộc tính mới
    PhoneNumber NVARCHAR(20),
    AvatarUrl NVARCHAR(500),
    Address NVARCHAR(255),

    RefreshToken NVARCHAR(MAX),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);


-- Bảng Role
CREATE TABLE Role (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(200)
);

-- Bảng UserRole
CREATE TABLE UserRole (
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    AssignedDate DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (UserId, RoleId),
    CONSTRAINT FK_UserRole_User FOREIGN KEY (UserId) REFERENCES [User](UserId) ON DELETE CASCADE,
    CONSTRAINT FK_UserRole_Role FOREIGN KEY (RoleId) REFERENCES Role(RoleId) ON DELETE CASCADE
);


-- Bảng Cart (Giỏ hàng)
CREATE TABLE Cart (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    UserID INT NOT NULL,                        -- FK tới User(ID)
    CONSTRAINT FK_Cart_User FOREIGN KEY (UserID) REFERENCES [User](UserId)
);


-- Bảng CartDetail (Chi tiết giỏ hàng)
CREATE TABLE CartDetail (
    CartID INT NOT NULL,                        -- FK tới Cart(ID)
    ProductVariantID INT NOT NULL,              -- FK tới ProductVariant(ID)
    Quantity INT NOT NULL DEFAULT 1,            -- Số lượng
    PRIMARY KEY (CartID, ProductVariantID),
    CONSTRAINT FK_CartDetail_Cart FOREIGN KEY (CartID) REFERENCES Cart(ID) ON DELETE CASCADE,
    CONSTRAINT FK_CartDetail_ProductVariant FOREIGN KEY (ProductVariantID) REFERENCES ProductVariant(ID)
);


-- Bảng Voucher
CREATE TABLE Voucher (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    Name NVARCHAR(100) NOT NULL,               -- Tên voucher
    DiscountPercent DECIMAL(5,2),              -- % giảm giá
    Description NVARCHAR(500),                 -- Nội dung mô tả
    StartDate DATE,                             -- Ngày bắt đầu
    EndDate DATE,                               -- Ngày kết thúc
    Type NVARCHAR(50)                           -- Loại voucher
);


-- Bảng Voucher_User
CREATE TABLE Voucher_User (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    UserID INT NOT NULL,                        -- FK tới User(ID)
    VoucherID INT NOT NULL,                     -- FK tới Voucher(ID)
    ReceivedDate DATE DEFAULT GETDATE(),        -- Ngày nhận voucher
    CONSTRAINT FK_VoucherUser_User FOREIGN KEY (UserID) REFERENCES [User](UserId),
    CONSTRAINT FK_VoucherUser_Voucher FOREIGN KEY (VoucherID) REFERENCES Voucher(ID)
);

-- Bảng Order (Hóa đơn)
CREATE TABLE [Order] (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    UserID INT NOT NULL,                        -- FK tới User(ID)
    VoucherID INT NULL,                          -- FK tới Voucher(ID) nếu có
    Status NVARCHAR(50) DEFAULT N'Đang xử lý',      -- Trạng thái đơn hàng
    TotalAmount DECIMAL(18,2),                  -- Tổng tiền
    DeliveryAddress NVARCHAR(200),              -- Địa chỉ nhận hàng
    Phone NVARCHAR(20),                          -- Số điện thoại liên hệ
    OrderDate DATETIME DEFAULT GETDATE(),       -- Ngày tạo đơn
    CONSTRAINT FK_Order_User FOREIGN KEY (UserID) REFERENCES [User](UserId),
    CONSTRAINT FK_Order_Voucher FOREIGN KEY (VoucherID) REFERENCES Voucher(ID)
);


-- Bảng OrderDetail (Chi tiết hóa đơn)
CREATE TABLE OrderDetail (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    OrderID INT NOT NULL,                        -- FK tới Order(ID)
    ProductVariantID INT NOT NULL,               -- FK tới ProductVariant(ID)
    Quantity INT NOT NULL DEFAULT 1,             -- Số lượng
    UnitPrice DECIMAL(18,2),                     -- Giá đơn vị tại thời điểm mua
    CONSTRAINT FK_OrderDetail_Order FOREIGN KEY (OrderID) REFERENCES [Order](ID) ON DELETE CASCADE,
    CONSTRAINT FK_OrderDetail_ProductVariant FOREIGN KEY (ProductVariantID) REFERENCES ProductVariant(ID)
);

-- Bảng Payment (Thanh toán)
CREATE TABLE Payment (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    OrderID INT NOT NULL,                        -- FK tới Order(ID)
    Method NVARCHAR(50),                         -- Phương thức thanh toán
    Amount DECIMAL(18,2),                        -- Số tiền thanh toán
    Status NVARCHAR(50),                          -- Trạng thái thanh toán
    PaymentDate DATETIME DEFAULT GETDATE(),       -- Ngày thanh toán
    CONSTRAINT FK_Payment_Order FOREIGN KEY (OrderID) REFERENCES [Order](ID)
);
GO
-- ========================
-- Thêm dữ liệu cho Category
-- ========================
INSERT INTO Category (Name, Description, image) VALUES
(N'Giày Chạy Bộ', NULL, N'GiayChayBo.png'),
(N'Giày Thời Trang', NULL, N'GiayThoiTrang.png'),
(N'Áo Thun', NULL, N'AoThun.png'),
(N'Áo Khoác', NULL, N'AoKhoac.png'),
(N'Giày Luyện Tập', NULL, N'GiayLuyenTap.png'),
(N'Xăng Đan & Dép', NULL, N'XangDan.png'),
(N'Quần Ngắn', NULL, N'QuanNgan.png'),
(N'Quần Dài', NULL, N'QuanDai.png'),
(N'Đồ Bơi', NULL, N'DoBoi.png'),
(N'Ba Lô', NULL, N'BaLo.png');

-- ========================
-- Thêm dữ liệu cho Brand
-- ========================
INSERT INTO Brand (Name, Logo) VALUES
('Nike', 'nike_logo.png'),
('Adidas', 'adidas_logo.png'),
('Puma', 'puma_logo.png'),
('Asics', 'asics_logo.png'),
('Columbia', 'columbia_logo.png'),
('Crocs', 'crocs_logo.png'),
('Hoka', 'hoka_logo.png'),
('On', 'on_logo.png'),
('Speedo', 'speedo_logo.png'),
('Teva', 'teva_logo.png');

-- ========================
-- Thêm dữ liệu cho Size
-- ========================
INSERT INTO Size (Name, Length, Width, Weight, Height) VALUES
('S', 25.0, 10.0, 0.3, 5.0),
('M', 26.0, 10.5, 0.35, 5.2),
('L', 27.0, 11.0, 0.4, 5.5);

-- ========================
-- Thêm dữ liệu cho Color
-- ========================
INSERT INTO Color (Name, colorCode) VALUES
(N'Đỏ', '#FF0000'),
(N'Xanh Dương', '#6CABDD'),
(N'Đen', '#000000'),
(N'Trắng', '#FFFFFF'),
(N'Vàng', '#FFFF00'),
(N'Xanh lá', '#008000'),
(N'Xám', '#808080'),
(N'Nâu', '#6E1C1C');

-- ========================
-- Thêm dữ liệu cho Product
-- ========================
INSERT INTO Product (CategoryID, BrandID, Name, Description, Status) VALUES
(1, 1, 'Nike Air Max', N'Giày chạy bộ Nike Air Max', 1),
(1, 2, 'Adidas Ultraboost', N'Giày chạy bộ Adidas Ultraboost', 1),
(2, 3, N'Puma Giày Jogger', N'Giày thể thao Puma Jogger', 1),
(1, 1, 'Nike Revolution 6', N'Giày chạy bộ Nike Revolution 6', 1),
(2, 2, 'Adidas Tiro 23', N'Quần short thể thao Adidas', 1),
(1, 3, 'Puma Suede Classic', N'Giày thể thao thời trang Puma', 1),
(2, 1, 'Nike Sportswear Club', N'Áo T-shirt Nike nam', 1),
(1, 2, 'Adidas Stan Smith', N'Giày sneaker Adidas Stan Smith', 1),
(2, 3, 'PUMA x REPRESENT', N'Áo thun họa tiết PUMA x REPRESENT dành cho nam', 1),
(1, 1, 'Nike Air Jordan 1', N'Giày bóng rổ Nike Air Jordan 1', 1),
(2, 2, 'PumaWARDROBE', N'Quần short nam rộng rãi vải sọc nhăn WARDROBE ESS 6"', 1),
(2, 1, 'BMW Polo', N'Áo polo nam BMW M Motorsport', 1),
(1, 3, 'Puma RS-X', N'Giày sneaker Puma RS-X', 1),
(3, 3, 'Manchester City shirt', N'Áo Thi Đấu Manchester City 25/26 Nam', 1),
(5, 3, 'Manchester City Hat', N'Mũ Lưỡi Trai Manchester City Essentials', 1),
(1, 1, 'Nike Pegasus 41', N'Giày chạy bộ Nike Pegasus 41', 1),
(1, 2, 'Adidas Runfalcon 3.0', N'Giày chạy bộ Adidas Runfalcon 3.0', 1),
(2, 3, 'Puma Street Rider', N'Giày sneaker Puma Street Rider', 1),
(3, 1, 'Nike Dri-FIT Tee', N'Áo thun Nike Dri-FIT nam', 1),
(3, 2, 'Adidas Essentials Tee', N'Áo thun Adidas Essentials', 1),
(4, 1, 'Nike Windrunner Jacket', N'Áo khoác gió Nike Windrunner', 1),
(4, 2, 'Adidas 3-Stripes Jacket', N'Áo khoác Adidas 3-Stripes', 1),
(7, 3, 'Puma Training Shorts', N'Quần short tập luyện Puma', 1),
(8, 2, 'Adidas Tiro Track Pants', N'Quần dài thể thao Adidas Tiro', 1),
(10, 1, 'Nike Training Backpack', N'Ba lô tập luyện Nike', 1),
(6, 2, 'Adidas Adilette Slides', N'Dép Adidas Adilette', 1),
(6, 3, 'Puma Comfort Sandals', N'Dép Puma Comfort', 1),
(9, 1, 'Nike Swim Trunks', N'Quần bơi Nike nam', 1),
(9, 2, 'Adidas 3-Stripes Swim Shorts', N'Quần bơi Adidas 3-Stripes', 1),
(3, 3, 'Puma Graphic Tee', N'Áo thun Puma Graphic', 1);

-- ========================
-- Thêm dữ liệu cho ProductVariant
-- ========================
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(1, 1, 1, 10, 2500000, 'nike_red.png', '2025-10-01 09:00:00'),
(1, 2, 2, 15, 2600000, 'nike_blue.png', '2025-10-01 09:00:00'),
(2, 2, 3, 8, 2800000, 'AdidasUltraboost.png', '2025-10-02 14:30:00'),
(3, 1, 4, 20, 500000, 'puma_jogger_white.png', '2025-10-03 10:15:00'),
(3, 3, 5, 10, 550000, 'puma_jogger_yellow.png', '2025-10-03 10:15:00'),
(4, 2, 3, 20, 1800000, 'NikeRevolution_black.png', '2025-10-05 08:20:00'),
(4, 3, 6, 15, 1800000, 'NikeRevolution_green.png', '2025-10-05 08:20:00'),
(6, 1, 3, 12, 2200000, 'PumaSuedeClassic.png', '2025-10-07 16:45:00'),
(5, 2, 3, 30, 850000, 'Quan_Adidas.png', '2025-10-06 11:00:00'),
(7, 3, 4, 25, 1500000, 'NikeSportswearClub_White.png', '2025-10-10 09:30:00'),
(7, 3, 2, 10, 1550000, 'NikeSportswearClub_blue.png', '2025-10-10 09:30:00'),
(8, 2, 4, 18, 2400000, 'AdidasStanSmith.png', '2025-10-11 13:00:00'),
(9, 1, 4, 50, 450000, 'PUMAREPRESENT_white.png', '2025-10-12 10:00:00'),
(9, 2, 2, 40, 450000, 'PUMAREPRESENT_blue.png', '2025-10-12 10:00:00'),
(9, 3, 3, 30, 450000, 'PUMAREPRESENT_black.png', '2025-10-12 10:00:00'),
(10, 3, 3, 5, 5500000, 'jordan1_red.png', '2025-10-15 17:00:00'),
(11, 2, 3, 22, 900000, 'PumaWARDROBE.png', '2025-10-18 09:15:00'),
(12, 3, 8, 15, 1200000, 'PoloBMW_Brown.png', '2025-10-20 11:30:00'),
(12, 2, 4, 15, 1200000, 'PoloBMW_white.png', '2025-10-20 11:30:00'),
(13, 1, 6, 10, 3100000, 'sneakerHeritage.png', '2025-10-21 14:00:00'),
(14, 3, 2, 15, 1200000, 'ManchesterCityHome.png', '2025-10-20 11:30:00'),
(14, 2, 3, 15, 1200000, 'ManchesterCityAway.png', '2025-10-20 11:30:00'),
(15, 1, 2, 10, 1100000, 'ManchesterCityHat.png', '2025-10-21 14:00:00');
-- ========================
-- Thêm thêm dữ liệu cho ProductVariant cho các sản phẩm mới
-- ========================
-- Nike Pegasus 41 (giả sử ProductID = 16)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(16, 1, 2, 20, 2600000, 'Pegasus41_blue.png',   '2025-11-01 09:00:00'),
(16, 2, 1, 15, 2600000, 'Pegasus41_red.png',    '2025-11-01 09:00:00'),
(16, 3, 3, 10, 2700000, 'Pegasus41_black.png',  '2025-11-01 09:00:00');

-- Adidas Runfalcon 3.0 (ProductID = 17)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(17, 1, 4, 18, 1900000, 'Runfalcon_white.png',  '2025-11-02 10:30:00'),
(17, 2, 2, 20, 1950000, 'Runfalcon_blue.png',   '2025-11-02 10:30:00'),
(17, 3, 3, 12, 1950000, 'Runfalcon_black.png',  '2025-11-02 10:30:00');

-- Puma Street Rider (ProductID = 18)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(18, 1, 7, 25, 2100000, 'StreetRider_grey.png', '2025-11-03 14:20:00'),
(18, 2, 3, 20, 2200000, 'StreetRider_black.png','2025-11-03 14:20:00');

-- Nike Dri-FIT Tee (ProductID = 19)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(19, 1, 4, 40, 550000,  'Nike_DriFit_white.png','2025-11-04 09:10:00'),
(19, 2, 3, 35, 550000,  'Nike_DriFit_black.png','2025-11-04 09:10:00'),
(19, 3, 5, 30, 580000,  'Nike_DriFit_yellow.png','2025-11-04 09:10:00');

-- Adidas Essentials Tee (ProductID = 20)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(20, 1, 4, 30, 500000,  'Adidas_Essentials_white.png','2025-11-05 11:00:00'),
(20, 2, 2, 25, 520000,  'Adidas_Essentials_blue.png', '2025-11-05 11:00:00'),
(20, 3, 3, 20, 520000,  'Adidas_Essentials_black.png','2025-11-05 11:00:00');

-- Nike Windrunner Jacket (ProductID = 21)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(21, 2, 3, 15, 2100000, 'Windrunner_black.png', '2025-11-06 08:45:00'),
(21, 3, 2, 10, 2150000, 'Windrunner_blue.png',  '2025-11-06 08:45:00');

-- Adidas 3-Stripes Jacket (ProductID = 22)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(22, 2, 3, 18, 2000000, 'Adidas3S_black.png',   '2025-11-07 13:25:00'),
(22, 3, 4, 12, 2050000, 'Adidas3S_white.png',   '2025-11-07 13:25:00');

-- Puma Training Shorts (ProductID = 23)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(23, 1, 3, 30, 450000,  'PumaShorts_black.png', '2025-11-08 09:40:00'),
(23, 2, 7, 25, 450000,  'PumaShorts_grey.png',  '2025-11-08 09:40:00');

-- Adidas Tiro Track Pants (ProductID = 24)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(24, 2, 3, 20, 900000,  'TiroPants_black.png',  '2025-11-09 15:00:00'),
(24, 3, 2, 15, 950000,  'TiroPants_blue.png',   '2025-11-09 15:00:00');

-- Nike Training Backpack (ProductID = 25)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(25, 2, 3, 40, 1100000, 'NikeBackpack_black.png', '2025-11-10 10:20:00'),
(25, 2, 2, 35, 1150000, 'NikeBackpack_blue.png',  '2025-11-10 10:20:00');

-- Adidas Adilette Slides (ProductID = 26)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(26, 1, 4, 50, 400000,  'Adilette_white.png',   '2025-11-11 16:00:00'),
(26, 2, 3, 45, 420000,  'Adilette_black.png',   '2025-11-11 16:00:00'),
(26, 3, 2, 30, 420000,  'Adilette_blue.png',    '2025-11-11 16:00:00');

-- Puma Comfort Sandals (ProductID = 27)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(27, 1, 5, 40, 380000,  'PumaSandal_yellow.png','2025-11-12 09:15:00'),
(27, 2, 3, 35, 380000,  'PumaSandal_black.png', '2025-11-12 09:15:00');

-- Nike Swim Trunks (ProductID = 28)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(28, 1, 2, 25, 550000,  'NikeSwim_blue.png',    '2025-11-13 11:30:00'),
(28, 2, 3, 20, 550000,  'NikeSwim_black.png',   '2025-11-13 11:30:00');

-- Adidas 3-Stripes Swim Shorts (ProductID = 29)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(29, 1, 4, 22, 500000,  'AdidasSwim_white.png', '2025-11-14 14:10:00'),
(29, 2, 2, 18, 520000,  'AdidasSwim_blue.png',  '2025-11-14 14:10:00');

-- Puma Graphic Tee (ProductID = 30)
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image, NgayNhap) VALUES
(30, 1, 4, 35, 480000,  'PumaGraphic_white.png','2025-11-15 09:50:00'),
(30, 2, 1, 30, 480000,  'PumaGraphic_red.png',  '2025-11-15 09:50:00'),
(30, 3, 3, 25, 500000,  'PumaGraphic_black.png','2025-11-15 09:50:00');

-- ========================
-- Thêm dữ liệu cho User
-- ========================
INSERT INTO [User] 
(UserName, Password, Email, FullName, PhoneNumber, AvatarUrl, Address, RefreshToken, IsActive, CreatedDate)
VALUES
('tuan_khanh', '123456', 'khanh@example.com', N'Trần Đăng Tuấn Khanh', '0900000001', NULL, N'Đà Nẵng', NULL, 1, SYSUTCDATETIME()),
('admin01', '$2a$11$gsPivpi2QoNvhxaCJfHaKuyzDExHw4j5aKdWAAgFPa3hz9t09vP4e', 'admin@example.com', N'Quản trị viên', '0900000002', NULL, N'Hồ Chí Minh', NULL, 1, SYSUTCDATETIME());


-- Role
INSERT INTO Role (RoleName, Description) VALUES
('Admin', N'Quản trị hệ thống'),
('Customer', N'Khách hàng bình thường');

-- UserRole
INSERT INTO UserRole (UserId, RoleId) VALUES
(1, 1),
(2, 2);

-- ========================
-- Thêm dữ liệu cho Cart
-- ========================
INSERT INTO Cart (UserID) VALUES
(1),
(2);

-- ========================
-- Thêm dữ liệu cho CartDetail
-- ========================
INSERT INTO CartDetail (CartID, ProductVariantID, Quantity) VALUES
(1, 1, 2),
(1, 4, 1),
(2, 3, 1);

-- ========================
-- Thêm dữ liệu cho Voucher
-- ========================
INSERT INTO Voucher (Name, DiscountPercent, Description, StartDate, EndDate, Type) VALUES
('NEWYEAR2026', 10, N'Giảm 10% cho đơn hàng đầu năm', '2025-12-31', '2026-01-31', 'Giảm giá'),
('SUMMER2026', 15, N'Giảm 15% cho mùa hè', '2026-06-01', '2026-06-30', 'Giảm giá');

-- ========================
-- Thêm dữ liệu cho Voucher_User
-- ========================
INSERT INTO Voucher_User (UserID, VoucherID) VALUES
(1, 1),
(2, 2);

-- ========================
-- Thêm dữ liệu cho Order
-- ========================
INSERT INTO [Order] (UserID, VoucherID, Status, TotalAmount, DeliveryAddress, Phone) VALUES
(1, 1, N'Đang xử lý', 5000000, N'Hà Nội', '0912345678'),
(2, 2, N'Đang xử lý', 2800000, N'Hồ Chí Minh', '0987654321');

-- ========================
-- Thêm dữ liệu cho OrderDetail
-- ========================
INSERT INTO OrderDetail (OrderID, ProductVariantID, Quantity, UnitPrice) VALUES
(1, 1, 2, 2500000),
(1, 4, 1, 500000),
(2, 3, 1, 2800000);

-- ========================
-- Thêm dữ liệu cho Payment
-- ========================
INSERT INTO Payment (OrderID, Method, Amount, Status) VALUES
(1, 'Credit Card', 5000000, N'Đã thanh toán'),
(2, 'Cash', 2800000, N'Đang chờ thanh toán');

GO
-- 1. Category
SELECT * FROM Category;

-- 2. Brand
SELECT * FROM Brand;

-- 3. Product
SELECT * FROM Product where Description = N'Giày chạy bộ Adidas Ultraboost';

-- 4. Size
SELECT * FROM Size;

-- 5. Color
SELECT * FROM Color;

-- 6. ProductVariant
SELECT * FROM ProductVariant where ProductID = 2;

-- 7. User
SELECT * FROM [User];

-- 8. Role
SELECT * FROM Role;

-- 9. UserRole
SELECT * FROM UserRole;

-- 10. Cart
SELECT * FROM Cart;

-- 11. CartDetail
SELECT * FROM CartDetail;

-- 12. Voucher
SELECT * FROM Voucher;

-- 13. Voucher_User
SELECT * FROM Voucher_User;

-- 14. Order
SELECT * FROM [Order];

-- 15. OrderDetail
SELECT * FROM OrderDetail;

-- 16. Payment
SELECT * FROM Payment;
--lấy thông tin tất cả sản phảm
select distinct pv.ProductID,  p.name, p.Description,pv.ColorID,c.Name, pv.Image, MIN(pv.Price) as price
from ProductVariant pv 
	join Product p on p.ID = pv.ProductID
	join Color c on c.ID = pv.ColorID
GROUP BY pv.ProductID, p.Name, p.Description,pv.ColorID,c.Name, pv.Image;
--
select * from Product

--lấy thông tin chi tiết sản phẩm
select *
from ProductVariant pv 
	join Product p on p.ID = pv.ProductID
	join Size s on s.ID = pv.SizeID
	join Color c on c.ID = pv.ColorID
where pv.ProductID = 1

select * from Color
select * from [User]
GO

--Đây là thủ tục để lấy Top 3 sản phẩm bán chạy
IF OBJECT_ID('dbo.sp_GetTop3ProductVariants', 'P') IS NOT NULL
    DROP PROC dbo.sp_GetTop3ProductVariants;
GO
CREATE PROC dbo.sp_GetTop3ProductVariants
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 3
        pv.ID                  AS ProductVariantID,
        p.ID                   AS ProductID,
        p.Name                 AS ProductName,
        c.ID                   AS ColorID,
        c.Name                 AS ColorName,
        s.ID                   AS SizeID,
        s.Name                 AS SizeName,
        pv.Price,
        pv.Image,
        SUM(od.Quantity)       AS TotalSold,
        SUM(od.Quantity * od.UnitPrice) AS TotalRevenue
    FROM OrderDetail od
    JOIN [Order] o
        ON od.OrderID = o.ID
    JOIN ProductVariant pv
        ON od.ProductVariantID = pv.ID
    JOIN Product p
        ON pv.ProductID = p.ID
    JOIN Color c
        ON pv.ColorID = c.ID
    JOIN Size s
        ON pv.SizeID = s.ID
    LEFT JOIN Payment pay
        ON pay.OrderID = o.ID
    WHERE 
        -- Chỉ tính đơn đã thanh toán hoặc đã hoàn tất
        (o.Status = 'Completed' OR pay.Status = 'Paid')
    GROUP BY 
        pv.ID, p.ID, p.Name,
        c.ID, c.Name,
        s.ID, s.Name,
        pv.Price, pv.Image
    ORDER BY 
        TotalSold DESC,
        TotalRevenue DESC;
END;
GO
EXEC dbo.sp_GetTop3ProductVariants;


--Đây là thủ tục để lọc sản phẩm
GO
-- 1. Xóa thủ tục cũ nếu tồn tại
IF OBJECT_ID('dbo.sp_FilterProductVariants', 'P') IS NOT NULL
    DROP PROC dbo.sp_FilterProductVariants;
GO

-- 2. Tạo thủ tục mới
CREATE PROC dbo.sp_FilterProductVariants
    @BrandIds   NVARCHAR(MAX) = NULL,
    @SizeIds    NVARCHAR(MAX) = NULL,
    @ColorIds   NVARCHAR(MAX) = NULL,
    @MinPrice   DECIMAL(18,2) = 0,    -- Mặc định Min là 0
    @MaxPrice   DECIMAL(18,2) = NULL, -- Mặc định Max là NULL (vô cực)
    @Keyword    NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- CTE: Tách chuỗi ID thành bảng tạm (Chỉ tách khi có dữ liệu)
    ;WITH BrandFilter AS (
        SELECT CAST(value AS INT) AS BrandId 
        FROM STRING_SPLIT(@BrandIds, ',') 
        WHERE ISNULL(@BrandIds, '') <> '' AND value <> ''
    ),
    SizeFilter AS (
        SELECT CAST(value AS INT) AS SizeId 
        FROM STRING_SPLIT(@SizeIds, ',') 
        WHERE ISNULL(@SizeIds, '') <> '' AND value <> ''
    ),
    ColorFilter AS (
        SELECT CAST(value AS INT) AS ColorId 
        FROM STRING_SPLIT(@ColorIds, ',') 
        WHERE ISNULL(@ColorIds, '') <> '' AND value <> ''
    )

    -- SELECT CHÍNH: Lấy đầy đủ cột cho Backend Group
    SELECT
        pv.ID          AS ProductVariantID,
        p.ID           AS ProductID,
        p.Name         AS ProductName,
        p.Description  AS ProductDescription, -- [MỚI] Để hiển thị mô tả
        b.ID           AS BrandID,
        b.Name         AS BrandName,
        s.ID           AS SizeID,
        s.Name         AS SizeName,
        c.ID           AS ColorID,
        c.Name         AS ColorName,
        c.ColorCode    AS ColorCode,          -- [MỚI] Để hiển thị màu sắc
        pv.Price,
        pv.Image,
        pv.StockQuantity,
        pv.NgayNhap
    FROM ProductVariant pv
        JOIN Product p ON pv.ProductID = p.ID
        JOIN Brand   b ON p.BrandID    = b.ID
        JOIN Size    s ON pv.SizeID    = s.ID
        JOIN Color   c ON pv.ColorID   = c.ID
    WHERE
        -- 1. Brand Filter (Nếu rỗng hoặc null thì bỏ qua)
        (
            ISNULL(@BrandIds, '') = '' 
            OR p.BrandID IN (SELECT BrandId FROM BrandFilter)
        )
        -- 2. Size Filter
        AND (
            ISNULL(@SizeIds, '') = '' 
            OR pv.SizeID IN (SELECT SizeId FROM SizeFilter)
        )
        -- 3. Color Filter
        AND (
            ISNULL(@ColorIds, '') = '' 
            OR pv.ColorID IN (SELECT ColorId FROM ColorFilter)
        )
        -- 4. Price Filter
        AND (
            pv.Price >= @MinPrice
        )
        AND (
            @MaxPrice IS NULL 
            OR @MaxPrice = 0 
            OR pv.Price <= @MaxPrice
        )
        -- 5. Keyword Filter (Tìm theo tên SP hoặc tên Brand)
        AND (
            ISNULL(@Keyword, '') = '' 
            OR p.Name  LIKE N'%' + @Keyword + N'%'
            OR b.Name  LIKE N'%' + @Keyword + N'%'
        )
    ORDER BY
        p.Name, pv.Price;
END;
GO
EXEC sp_FilterProductVariants
    @BrandIds = '1,2',
    @SizeIds  = '1,2',
    @ColorIds = '2,5',
    @MinPrice = 500000,
    @MaxPrice = 1500000,
    @Keyword  = 'Nike';

go
SELECT 
    -- Thông tin sản phẩm cha
    p.ID AS ProductID,
    p.Name AS TenSanPham,
    cat.Name AS DanhMuc,
    b.Name AS ThuongHieu,

    -- Thông tin biến thể con
    pv.ID AS VariantID,
    s.Name AS Size,
    c.Name AS MauSac,
    FORMAT(pv.Price, '#,###') AS GiaTien, -- Format số cho dễ nhìn
    pv.StockQuantity AS TonKho,
    pv.Image AS AnhBienThe

FROM ProductVariant pv
JOIN Product p ON pv.ProductID = p.ID
LEFT JOIN Category cat ON p.CategoryID = cat.ID
LEFT JOIN Brand b ON p.BrandID = b.ID
LEFT JOIN Size s ON pv.SizeID = s.ID
LEFT JOIN Color c ON pv.ColorID = c.ID

-- Sắp xếp: Sản phẩm mới nhất lên đầu, sau đó gom nhóm theo Size
ORDER BY p.ID ASC, s.Name ASC;
GO

CREATE PROC dbo.sp_GetOrdersByUserId
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF OBJECT_ID('tempdb..#Orders') IS NOT NULL DROP TABLE #Orders;

    -- #Orders: danh sách hóa đơn theo user
    SELECT
        o.ID           AS OrderID,
        o.UserID,
        o.Status,
        o.TotalAmount,
        o.DeliveryAddress,
        o.Phone,
        o.OrderDate,
        o.VoucherID
    INTO #Orders
    FROM [Order] o
    WHERE o.UserID = @UserId;

    /* =========================
       RS1: Orders
       ========================= */
    SELECT *
    FROM #Orders
    ORDER BY OrderDate DESC, OrderID DESC;

    /* =========================
       RS2: OrderDetails
       ========================= */
    SELECT
        od.ID          AS OrderDetailID,
        od.OrderID,
        od.ProductVariantID,
        od.Quantity,
        od.UnitPrice,
        od.Quantity * od.UnitPrice AS LineTotal
    FROM OrderDetail od
    JOIN #Orders o ON o.OrderID = od.OrderID
    ORDER BY od.OrderID, od.ID;

    /* =========================
       RS3: Products in Orders
       ========================= */
    SELECT DISTINCT
        o.OrderID,

        p.ID           AS ProductID,
        p.Name         AS ProductName,

        pv.ID          AS ProductVariantID,
        pv.Image,
        pv.Price,

        b.Name         AS BrandName,
        cat.Name       AS CategoryName,
        s.Name         AS SizeName,
        c.Name         AS ColorName,
        c.colorCode    AS ColorCode   -- đúng theo DB bạn tạo (colorCode)
    FROM #Orders o
    JOIN OrderDetail od      ON od.OrderID = o.OrderID
    JOIN ProductVariant pv   ON pv.ID = od.ProductVariantID
    JOIN Product p           ON p.ID = pv.ProductID
    LEFT JOIN Brand b        ON b.ID = p.BrandID
    LEFT JOIN Category cat   ON cat.ID = p.CategoryID
    LEFT JOIN Size s         ON s.ID = pv.SizeID
    LEFT JOIN Color c        ON c.ID = pv.ColorID
    ORDER BY o.OrderID DESC, p.ID, pv.ID;

    /* =========================
       RS4: Payments of Orders
       ========================= */
    SELECT
        pay.ID,
        pay.OrderID,
        pay.Method,
        pay.Amount,
        pay.Status,
        pay.PaymentDate
    FROM Payment pay
    JOIN #Orders o ON o.OrderID = pay.OrderID
    ORDER BY pay.PaymentDate DESC, pay.ID DESC;
END;
GO

-- Test
EXEC dbo.sp_GetOrdersByUserId @UserId = 1;
/*
-- Trigger giảm số lượng sản phẩm khi khách hàng đặt hàng
SELECT * FROM [Order];
IF OBJECT_ID('dbo.trg_OrderDetail_DecreaseStock', 'TR') IS NOT NULL
    DROP TRIGGER dbo.trg_OrderDetail_DecreaseStock;
GO

CREATE TRIGGER dbo.trg_OrderDetail_DecreaseStock
ON dbo.OrderDetail
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        -- 1) Quantity hợp lệ
        IF EXISTS (SELECT 1 FROM inserted WHERE Quantity IS NULL OR Quantity <= 0)
        BEGIN
            RAISERROR (N'Quantity phải > 0.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 2) Gom số lượng theo ProductVariantID
        DECLARE @req TABLE (
            ProductVariantID INT PRIMARY KEY,
            TotalQty INT NOT NULL
        );

        INSERT INTO @req(ProductVariantID, TotalQty)
        SELECT ProductVariantID, SUM(Quantity)
        FROM inserted
        GROUP BY ProductVariantID;

        -- 3) Check ProductVariantID tồn tại
        IF EXISTS (
            SELECT 1
            FROM @req r
            LEFT JOIN dbo.ProductVariant pv ON pv.ID = r.ProductVariantID
            WHERE pv.ID IS NULL
        )
        BEGIN
            RAISERROR (N'ProductVariantID không tồn tại.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 4) Check tồn kho đủ
        IF EXISTS (
            SELECT 1
            FROM @req r
            JOIN dbo.ProductVariant pv ON pv.ID = r.ProductVariantID
            WHERE ISNULL(pv.StockQuantity, 0) < r.TotalQty
        )
        BEGIN
            RAISERROR (N'Không đủ tồn kho cho một hoặc nhiều biến thể.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 5) Trừ tồn kho
        UPDATE pv
        SET pv.StockQuantity = pv.StockQuantity - r.TotalQty
        FROM dbo.ProductVariant pv
        JOIN @req r ON r.ProductVariantID = pv.ID;

    END TRY
    BEGIN CATCH
        DECLARE @msg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR (N'Trigger giảm tồn kho lỗi: %s', 16, 1, @msg);
        ROLLBACK TRANSACTION;
        RETURN;
    END CATCH
END
GO
*/
