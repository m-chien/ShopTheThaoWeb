-- 1. Xóa database nếu tồn tại
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'dbQuanLyShopTheThao')
BEGIN
	USE MASTER;
    ALTER DATABASE dbQuanLyShopTheThao SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE dbQuanLyShopTheThao;
END
GO

-- 2. Tạo database mới
CREATE DATABASE dbQuanLyShopTheThao;
GO

-- 3. Chọn database
USE dbQuanLyShopTheThao;
GO


-- Bảng Category
CREATE TABLE Category (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Bảng Brand
CREATE TABLE Brand (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Logo NVARCHAR(200)
);

-- Bảng Product
CREATE TABLE Product (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryID INT NOT NULL,
    BrandID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),
    Status BIT DEFAULT 1,
    CONSTRAINT FK_Product_Category FOREIGN KEY (CategoryID) REFERENCES Category(ID),
    CONSTRAINT FK_Product_Brand FOREIGN KEY (BrandID) REFERENCES Brand(ID)
);

-- Bảng Size
CREATE TABLE Size (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    Length DECIMAL(10,2),
    Width DECIMAL(10,2),
    Weight DECIMAL(10,2),
    Height DECIMAL(10,2)
);

-- Bảng Color
CREATE TABLE Color (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL
);

-- Bảng ProductVariant
CREATE TABLE ProductVariant (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    SizeID INT NOT NULL,
    ColorID INT NOT NULL,
    StockQuantity INT DEFAULT 0,
    Price DECIMAL(18,2) NOT NULL,
    Image NVARCHAR(200),
    CONSTRAINT FK_ProductVariant_Product FOREIGN KEY (ProductID) REFERENCES Product(ID),
    CONSTRAINT FK_ProductVariant_Size FOREIGN KEY (SizeID) REFERENCES Size(ID),
    CONSTRAINT FK_ProductVariant_Color FOREIGN KEY (ColorID) REFERENCES Color(ID)
);

-- Bảng User
CREATE TABLE [User] (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    UserName NVARCHAR(100) NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255),
    FullName NVARCHAR(255),
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

-- Bảng Cart
CREATE TABLE Cart (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    CONSTRAINT FK_Cart_User FOREIGN KEY (UserID) REFERENCES [User](UserId)
);

-- Bảng CartDetail
CREATE TABLE CartDetail (
    CartID INT NOT NULL,
    ProductVariantID INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (CartID, ProductVariantID),
    CONSTRAINT FK_CartDetail_Cart FOREIGN KEY (CartID) REFERENCES Cart(ID) ON DELETE CASCADE,
    CONSTRAINT FK_CartDetail_ProductVariant FOREIGN KEY (ProductVariantID) REFERENCES ProductVariant(ID)
);

-- Bảng Voucher
CREATE TABLE Voucher (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    DiscountPercent DECIMAL(5,2),
    Description NVARCHAR(500),
    StartDate DATE,
    EndDate DATE,
    Type NVARCHAR(50)
);

-- Bảng Voucher_User
CREATE TABLE Voucher_User (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    VoucherID INT NOT NULL,
    ReceivedDate DATE DEFAULT GETDATE(),
    CONSTRAINT FK_VoucherUser_User FOREIGN KEY (UserID) REFERENCES [User](UserId),
    CONSTRAINT FK_VoucherUser_Voucher FOREIGN KEY (VoucherID) REFERENCES Voucher(ID)
);

-- Bảng Order
CREATE TABLE [Order] (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    VoucherID INT NULL,
    Status NVARCHAR(50) DEFAULT 'Pending',
    TotalAmount DECIMAL(18,2),
    DeliveryAddress NVARCHAR(200),
    Phone NVARCHAR(20),
    OrderDate DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Order_User FOREIGN KEY (UserID) REFERENCES [User](UserId),
    CONSTRAINT FK_Order_Voucher FOREIGN KEY (VoucherID) REFERENCES Voucher(ID)
);

-- Bảng OrderDetail
CREATE TABLE OrderDetail (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    ProductVariantID INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    UnitPrice DECIMAL(18,2),
    Status NVARCHAR(50) DEFAULT 'Pending',
    CONSTRAINT FK_OrderDetail_Order FOREIGN KEY (OrderID) REFERENCES [Order](ID) ON DELETE CASCADE,
    CONSTRAINT FK_OrderDetail_ProductVariant FOREIGN KEY (ProductVariantID) REFERENCES ProductVariant(ID)
);

-- Bảng Payment
CREATE TABLE Payment (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    Method NVARCHAR(50),
    Amount DECIMAL(18,2),
    Status NVARCHAR(50),
    PaymentDate DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Payment_Order FOREIGN KEY (OrderID) REFERENCES [Order](ID)
);


--------------------------------------------------
-- THÊM DỮ LIỆU MẪU
--------------------------------------------------

-- Category
INSERT INTO Category (Name, Description) VALUES
(N'Giày Thể Thao', N'Các loại giày cho thể thao và đi chơi'),
(N'Quần Áo Thể Thao', N'Trang phục tập luyện và thể thao'),
(N'Phụ Kiện Thể Thao', N'Tất, balo, mũ thể thao');

-- Brand
INSERT INTO Brand (Name, Logo) VALUES
('Nike', 'nike_logo.png'),
('Adidas', 'adidas_logo.png'),
('Puma', 'puma_logo.png');

-- Size
INSERT INTO Size (Name, Length, Width, Weight, Height) VALUES
('S', 25.0, 10.0, 0.3, 5.0),
('M', 26.0, 10.5, 0.35, 5.2),
('L', 27.0, 11.0, 0.4, 5.5);

-- Color
INSERT INTO Color (Name) VALUES 
(N'Đỏ'), 
(N'Xanh Dương'), 
(N'Đen');

-- Product
INSERT INTO Product (CategoryID, BrandID, Name, Description, Status) VALUES
(1, 1, 'Nike Air Max', N'Giày chạy bộ Nike Air Max', 1),
(1, 2, 'Adidas Ultraboost', N'Giày chạy bộ Adidas Ultraboost', 1),
(2, 3, N'Puma Quần Jogger', N'Quần thể thao Puma Jogger', 1);

-- ProductVariant
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image) VALUES
(1, 1, 1, 10, 2500000, 'nike_airmax_red.png'),
(1, 2, 2, 15, 2600000, 'nike_airmax_blue.png'),
(2, 2, 3, 8, 2800000, 'adidas_ultra_black.png'),
(3, 1, 1, 20, 500000, 'puma_jogger_red.png'),
(3, 3, 2, 10, 550000, 'puma_jogger_blue.png');

-- User
INSERT INTO [User] (UserName, Password, Email, FullName, RefreshToken, IsActive, CreatedDate)
VALUES
('tuan_khanh', '123456', 'khanh@example.com', N'Trần Đăng Tuấn Khanh', NULL, 1, SYSUTCDATETIME()),
('admin01', 'admin123', 'admin@example.com', N'Quản trị viên', NULL, 1, SYSUTCDATETIME());

-- Role
INSERT INTO Role (RoleName, Description) VALUES
('Admin', N'Quản trị hệ thống'),
('Customer', N'Khách hàng bình thường');

-- UserRole
INSERT INTO UserRole (UserId, RoleId) VALUES
(1, 1),
(2, 2);

-- Cart
INSERT INTO Cart (UserID) VALUES (1), (2);

-- CartDetail
INSERT INTO CartDetail (CartID, ProductVariantID, Quantity) VALUES
(1, 1, 2),
(1, 4, 1),
(2, 3, 1);

-- Voucher
INSERT INTO Voucher (Name, DiscountPercent, Description, StartDate, EndDate, Type) VALUES
('NEWYEAR2026', 10, N'Giảm 10% cho đơn hàng đầu năm', '2025-12-31', '2026-01-31', 'Giảm giá'),
('SUMMER2026', 15, N'Giảm 15% cho mùa hè', '2026-06-01', '2026-06-30', 'Giảm giá');

-- Voucher_User
INSERT INTO Voucher_User (UserID, VoucherID) VALUES
(1, 1),
(2, 2);

-- Order
INSERT INTO [Order] (UserID, VoucherID, Status, TotalAmount, DeliveryAddress, Phone) VALUES
(1, 1, 'Pending', 5000000, 'Hà Nội', '0912345678'),
(2, 2, 'Pending', 2800000, 'Hồ Chí Minh', '0987654321');

-- OrderDetail
INSERT INTO OrderDetail (OrderID, ProductVariantID, Quantity, UnitPrice) VALUES
(1, 1, 2, 2500000),
(1, 4, 1, 500000),
(2, 3, 1, 2800000);

-- Payment
INSERT INTO Payment (OrderID, Method, Amount, Status) VALUES
(1, 'Credit Card', 5000000, 'Paid'),
(2, 'Cash', 2800000, 'Pending');

GO
select * from [User]
SELECT * FROM Product 
