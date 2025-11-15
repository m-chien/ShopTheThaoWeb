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
    CreatedAt DATETIME DEFAULT GETDATE()       -- Ngày tạo danh mục, mặc định là ngày hiện tại
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
    Name NVARCHAR(50) NOT NULL                 -- Tên màu
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
    CONSTRAINT FK_ProductVariant_Product FOREIGN KEY (ProductID) REFERENCES Product(ID),
    CONSTRAINT FK_ProductVariant_Size FOREIGN KEY (SizeID) REFERENCES Size(ID),
    CONSTRAINT FK_ProductVariant_Color FOREIGN KEY (ColorID) REFERENCES Color(ID)
);


-- Bảng User
CREATE TABLE [User] (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    Name NVARCHAR(100) NOT NULL,               -- Tên người dùng
    Email NVARCHAR(100) NOT NULL UNIQUE,       -- Email đăng nhập, duy nhất
    SDT NVARCHAR(20),                           -- Số điện thoại
    DiaChi NVARCHAR(200),                       -- Địa chỉ
    AvatarURL NVARCHAR(200),                    -- URL avatar 
    DOB DATE                                    -- Ngày sinh
);


-- Bảng Role
CREATE TABLE Role (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,      -- Khóa chính
    RoleName NVARCHAR(50) NOT NULL UNIQUE,     -- Tên quyền/role
    Description NVARCHAR(200)                  -- Mô tả quyền/role
);


-- Bảng UserRole (N:N giữa User và Role)
CREATE TABLE UserRole (
    UserId INT NOT NULL,                        -- FK tới User(ID)
    RoleId INT NOT NULL,                        -- FK tới Role(RoleId)
    AssignedDate DATETIME DEFAULT GETDATE(),    -- Ngày gán role
    PRIMARY KEY (UserId, RoleId),
    CONSTRAINT FK_UserRole_User FOREIGN KEY (UserId) REFERENCES [User](ID) ON DELETE CASCADE,
    CONSTRAINT FK_UserRole_Role FOREIGN KEY (RoleId) REFERENCES Role(RoleId) ON DELETE CASCADE
);


-- Bảng Cart (Giỏ hàng)
CREATE TABLE Cart (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    UserID INT NOT NULL,                        -- FK tới User(ID)
    CONSTRAINT FK_Cart_User FOREIGN KEY (UserID) REFERENCES [User](ID)
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
    CONSTRAINT FK_VoucherUser_User FOREIGN KEY (UserID) REFERENCES [User](ID),
    CONSTRAINT FK_VoucherUser_Voucher FOREIGN KEY (VoucherID) REFERENCES Voucher(ID)
);

-- Bảng Order (Hóa đơn)
CREATE TABLE [Order] (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    UserID INT NOT NULL,                        -- FK tới User(ID)
    VoucherID INT NULL,                          -- FK tới Voucher(ID) nếu có
    Status NVARCHAR(50) DEFAULT 'Pending',      -- Trạng thái đơn hàng
    TotalAmount DECIMAL(18,2),                  -- Tổng tiền
    DeliveryAddress NVARCHAR(200),              -- Địa chỉ nhận hàng
    Phone NVARCHAR(20),                          -- Số điện thoại liên hệ
    OrderDate DATETIME DEFAULT GETDATE(),       -- Ngày tạo đơn
    CONSTRAINT FK_Order_User FOREIGN KEY (UserID) REFERENCES [User](ID),
    CONSTRAINT FK_Order_Voucher FOREIGN KEY (VoucherID) REFERENCES Voucher(ID)
);


-- Bảng OrderDetail (Chi tiết hóa đơn)
CREATE TABLE OrderDetail (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    OrderID INT NOT NULL,                        -- FK tới Order(ID)
    ProductVariantID INT NOT NULL,               -- FK tới ProductVariant(ID)
    Quantity INT NOT NULL DEFAULT 1,             -- Số lượng
    UnitPrice DECIMAL(18,2),                     -- Giá đơn vị tại thời điểm mua
    Status NVARCHAR(50) DEFAULT 'Pending',       -- Trạng thái sản phẩm trong đơn
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
INSERT INTO Category (Name, Description) VALUES
(N'Giày Thể Thao', N'Các loại giày cho thể thao và đi chơi'),
(N'Quần Áo Thể Thao', N'Trang phục tập luyện và thể thao'),
(N'Phụ Kiện Thể Thao', N'Tất, balo, mũ thể thao');

-- ========================
-- Thêm dữ liệu cho Brand
-- ========================
INSERT INTO Brand (Name, Logo) VALUES
('Nike', 'nike_logo.png'),
('Adidas', 'adidas_logo.png'),
('Puma', 'puma_logo.png');

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
INSERT INTO Color (Name) VALUES
(N'Đỏ'),
(N'Xanh Dương'),
(N'Đen');

-- ========================
-- Thêm dữ liệu cho Product
-- ========================
INSERT INTO Product (CategoryID, BrandID, Name, Description, Status) VALUES
(1, 1, 'Nike Air Max', N'Giày chạy bộ Nike Air Max', 1),
(1, 2, 'Adidas Ultraboost', N'Giày chạy bộ Adidas Ultraboost', 1),
(2, 3, N'Puma Quần Jogger', N'Quần thể thao Puma Jogger', 1);

-- ========================
-- Thêm dữ liệu cho ProductVariant
-- ========================
INSERT INTO ProductVariant (ProductID, SizeID, ColorID, StockQuantity, Price, Image) VALUES
(1, 1, 1, 10, 2500000, 'nike_red.png'),
(1, 2, 2, 15, 2600000, 'nike_blue.png'),
(2, 2, 3, 8, 2800000, 'puma_jogger.png'),
(3, 1, 1, 20, 500000, 'nike_airmax.png'),
(3, 3, 2, 10, 550000, 'puma_jogger.png');

-- ========================
-- Thêm dữ liệu cho User
-- ========================
INSERT INTO [User] (Name, Email, SDT, DiaChi, AvatarURL, DOB) VALUES
(N'Trần Đặng Tuấn Khanh', 'a@gmail.com', '0912345678', 'Hà Nội', 'avatar1.png', '1995-05-10'),
(N'Trần Minh Chiến', 'chientranminh355@gmail.com', '0987654321', 'Đà Nẵng', 'avatar2.png', '1998-08-15');

-- ========================
-- Thêm dữ liệu cho Role
-- ========================
INSERT INTO Role (RoleName, Description) VALUES
('Admin', N'Quản trị hệ thống'),
('Customer', N'Khách hàng bình thường');

-- ========================
-- Thêm dữ liệu cho UserRole
-- ========================
INSERT INTO UserRole (UserId, RoleId) VALUES
(1, 1), -- User 1 là Admin
(2, 2); -- User 2 là Customer

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
(1, 1, 'Pending', 5000000, 'Hà Nội', '0912345678'),
(2, 2, 'Pending', 2800000, 'Hồ Chí Minh', '0987654321');

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
(1, 'Credit Card', 5000000, 'Paid'),
(2, 'Cash', 2800000, 'Pending');

GO
-- 1. Category
SELECT * FROM Category;

-- 2. Brand
SELECT * FROM Brand;

-- 3. Product
SELECT * FROM Product;

-- 4. Size
SELECT * FROM Size;

-- 5. Color
SELECT * FROM Color;

-- 6. ProductVariant
SELECT * FROM ProductVariant;

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