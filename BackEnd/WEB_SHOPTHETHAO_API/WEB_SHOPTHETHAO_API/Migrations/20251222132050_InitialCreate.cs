using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WEB_SHOPTHETHAO_API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Brand",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Logo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Brand__3214EC2773B25785", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    image = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Category__3214EC276532B5BB", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Color",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    colorCode = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Color__3214EC275F4701C1", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "FilterProductVariantDtos",
                columns: table => new
                {
                    ProductID = table.Column<int>(type: "int", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ColorID = table.Column<int>(type: "int", nullable: false),
                    ColorName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ColorCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Role__8AFACE1A0066376A", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "Size",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Length = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Width = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Weight = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Height = table.Column<decimal>(type: "decimal(10,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Size__3214EC27DE69C28C", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "TopProductVariantDtos",
                columns: table => new
                {
                    ProductVariantID = table.Column<int>(type: "int", nullable: false),
                    ProductID = table.Column<int>(type: "int", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ColorID = table.Column<int>(type: "int", nullable: false),
                    ColorName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SizeID = table.Column<int>(type: "int", nullable: false),
                    SizeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalSold = table.Column<int>(type: "int", nullable: false),
                    TotalRevenue = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    AvatarUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__User__1788CC4CC907C528", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Voucher",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DiscountPercent = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Voucher__3214EC27AC31F3D7", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryID = table.Column<int>(type: "int", nullable: false),
                    BrandID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    Status = table.Column<bool>(type: "bit", nullable: true, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Product__3214EC279CEE24E1", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Product_Brand",
                        column: x => x.BrandID,
                        principalTable: "Brand",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Product_Category",
                        column: x => x.CategoryID,
                        principalTable: "Category",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Cart",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Cart__3214EC27845E7CFF", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Cart_User",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "UserRole",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    AssignedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__UserRole__AF2760ADF61C8BDE", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRole_Role",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRole_User",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Order",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    VoucherID = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true, defaultValue: "Pending"),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DeliveryAddress = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    OrderDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Order__3214EC27739E563E", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Order_User",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_Order_Voucher",
                        column: x => x.VoucherID,
                        principalTable: "Voucher",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Voucher_User",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    VoucherID = table.Column<int>(type: "int", nullable: false),
                    ReceivedDate = table.Column<DateOnly>(type: "date", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Voucher___3214EC2740839C80", x => x.ID);
                    table.ForeignKey(
                        name: "FK_VoucherUser_User",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_VoucherUser_Voucher",
                        column: x => x.VoucherID,
                        principalTable: "Voucher",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "ProductVariant",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductID = table.Column<int>(type: "int", nullable: false),
                    SizeID = table.Column<int>(type: "int", nullable: false),
                    ColorID = table.Column<int>(type: "int", nullable: false),
                    StockQuantity = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    NgayNhap = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ProductV__3214EC270CA130D3", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProductVariant_Color",
                        column: x => x.ColorID,
                        principalTable: "Color",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_ProductVariant_Product",
                        column: x => x.ProductID,
                        principalTable: "Product",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_ProductVariant_Size",
                        column: x => x.SizeID,
                        principalTable: "Size",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Payment",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderID = table.Column<int>(type: "int", nullable: false),
                    Method = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PaymentDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Payment__3214EC27C621CD36", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Payment_Order",
                        column: x => x.OrderID,
                        principalTable: "Order",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "CartDetail",
                columns: table => new
                {
                    CartID = table.Column<int>(type: "int", nullable: false),
                    ProductVariantID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false, defaultValue: 1)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__CartDeta__1FF1B1E5B3BDDCB5", x => new { x.CartID, x.ProductVariantID });
                    table.ForeignKey(
                        name: "FK_CartDetail_Cart",
                        column: x => x.CartID,
                        principalTable: "Cart",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartDetail_ProductVariant",
                        column: x => x.ProductVariantID,
                        principalTable: "ProductVariant",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "OrderDetail",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderID = table.Column<int>(type: "int", nullable: false),
                    ProductVariantID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OrderDet__3214EC27C2058F74", x => x.ID);
                    table.ForeignKey(
                        name: "FK_OrderDetail_Order",
                        column: x => x.OrderID,
                        principalTable: "Order",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderDetail_ProductVariant",
                        column: x => x.ProductVariantID,
                        principalTable: "ProductVariant",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cart_UserID",
                table: "Cart",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_CartDetail_ProductVariantID",
                table: "CartDetail",
                column: "ProductVariantID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_UserID",
                table: "Order",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_VoucherID",
                table: "Order",
                column: "VoucherID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_OrderID",
                table: "OrderDetail",
                column: "OrderID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_ProductVariantID",
                table: "OrderDetail",
                column: "ProductVariantID");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_OrderID",
                table: "Payment",
                column: "OrderID");

            migrationBuilder.CreateIndex(
                name: "IX_Product_BrandID",
                table: "Product",
                column: "BrandID");

            migrationBuilder.CreateIndex(
                name: "IX_Product_CategoryID",
                table: "Product",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVariant_ColorID",
                table: "ProductVariant",
                column: "ColorID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVariant_ProductID",
                table: "ProductVariant",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVariant_SizeID",
                table: "ProductVariant",
                column: "SizeID");

            migrationBuilder.CreateIndex(
                name: "UQ__Role__8A2B6160EF548C78",
                table: "Role",
                column: "RoleName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserRole_RoleId",
                table: "UserRole",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_User_UserID",
                table: "Voucher_User",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_User_VoucherID",
                table: "Voucher_User",
                column: "VoucherID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartDetail");

            migrationBuilder.DropTable(
                name: "FilterProductVariantDtos");

            migrationBuilder.DropTable(
                name: "OrderDetail");

            migrationBuilder.DropTable(
                name: "Payment");

            migrationBuilder.DropTable(
                name: "TopProductVariantDtos");

            migrationBuilder.DropTable(
                name: "UserRole");

            migrationBuilder.DropTable(
                name: "Voucher_User");

            migrationBuilder.DropTable(
                name: "Cart");

            migrationBuilder.DropTable(
                name: "ProductVariant");

            migrationBuilder.DropTable(
                name: "Order");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "Color");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "Size");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Voucher");

            migrationBuilder.DropTable(
                name: "Brand");

            migrationBuilder.DropTable(
                name: "Category");
        }
    }
}
