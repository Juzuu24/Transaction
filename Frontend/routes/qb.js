const express = require("express");
const mysqlConnection = require("../utils/database.js"); // Ensure this is promise-based
const Router = express.Router();
Router.use(express.json());
const bodyParser = require("body-parser");
Router.use(bodyParser.json());
Router.use(bodyParser.urlencoded({ extended: true }));
const methodOverride = require("method-override");
Router.use(methodOverride("_method"));

// Router.get("/home", async (req, res) => {
//     const sql = `
//     SELECT p.*, c.Category_Name 
//     FROM Products p 
//     JOIN Category c ON p.Category_ID = c.Category_ID
//     ORDER BY p.Product_Name DESC
//     `;

//     try {
//         const results = await mysqlConnection.executeQuery(sql);
//         console.log("Fetched Products:", results);
//         res.render("home", { title: "User-Home", products: results });
//     } catch (err) {
//         console.error("Database error:", err);
//         res.status(500).json({ message: "Products not found." });
//     }
// });

// Router.get("/products/edit/:id", async (req, res) => {
//     const productId = req.params.id;
//     console.log("🔹 Product ID received:", productId); 

//     const sqlProduct = `SELECT * FROM Products WHERE Product_ID = ?`;
//     const sqlCategories = `SELECT * FROM Category`;
//     const sqlUser = `SELECT * FROM customers WHERE Customer_ID = ?`; 

//     try {
//         const productResults = await mysqlConnection.executeQuery(sqlProduct, [productId]);

//         if (productResults.length === 0) {
//             console.log("Product not found!");
//             return res.status(404).json({ message: "Product not found." });
//         }

//         const categoryResults = await mysqlConnection.executeQuery(sqlCategories);

//         let user = null;
//         if (req.session.userId) {
//             const userResults = await mysqlConnection.executeQuery(sqlUser, [req.session.userId]);
//             user = userResults.length > 0 ? userResults[0] : null;
//         }

//         res.render("productDetail", {
//             title: "Product Detail",
//             product: productResults[0],
//             categories: categoryResults,
//             user //
//         });

//     } catch (error) {
//         console.error("Error fetching product details:", error);
//         res.status(500).json({ message: "Server error. Please try again later." });
//     }
// });


// // Add to Cart API
// Router.post("/cart/add", async (req, res) => {
//     const userId = req.session.userId;  // pull user ID from session
//     const { productId, size, color, quantity } = req.body;

//     console.log("Request Received:", { userId, productId, size, color, quantity });

//     if (!userId) {
//         console.log("User not logged in!");
//         return res.status(401).json({ success: false, message: "User not logged in" });
//     }

//     if (!productId || !size || !color || !quantity) {
//         console.log("Missing required fields!", { productId, size, color, quantity });
//         return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const checkSql = `SELECT quantity FROM cart WHERE user_id = ? AND product_id = ? AND size = ? AND color = ?`;

//     try {
//         // Use await to execute the query instead of the callback function
//         const results = await mysqlConnection.executeQuery(checkSql, [userId, productId, size, color]);

//         if (results.length > 0) {
//             console.log("Updating existing cart item...");
//             const updateSql = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ? AND size = ? AND color = ?`;

//             // Use await for the update query
//             await mysqlConnection.executeQuery(updateSql, [quantity, userId, productId, size, color]);
//             console.log("Cart updated successfully!");
//             res.json({ success: true, message: "Cart updated successfully" });
//         } else {
//             console.log("Adding new item to cart...");
//             const insertSql = `INSERT INTO cart (user_id, product_id, size, color, quantity) VALUES (?, ?, ?, ?, ?)`;

//             // Use await for the insert query
//             await mysqlConnection.executeQuery(insertSql, [userId, productId, size, color, quantity]);
//             console.log("Add to cart successful!");
//             res.json({ success: true, message: "Added to cart successfully" });
//         }
//     } catch (err) {
//         console.error("Error inserting or updating cart:", err);
//         res.status(500).json({ success: false, message: "Database error" });
//     }
// });
Router.get("/check-session", (req, res) => {
    if (req.session && req.session.userId) {
        
        return res.json({ hasSession: true });
    } else {
        
        return res.json({ hasSession: false });
    }
});

// Router.get("/basket", async (req, res) => {
//     if (!req.session || !req.session.userId) {
//         return res.redirect("/");
//     }

//     const userId = req.session.userId;
//     const sql = `
//     SELECT c.id AS cart_id, c.product_id, c.size, c.color, c.quantity, 
//            p.Product_Name AS name, p.Product_Price AS price, p.Product_Price_Promotion AS discountPrice, p.Product_Image AS image
//     FROM cart c
//     JOIN Products p ON c.product_id = p.Product_ID
//     WHERE c.user_id = ?`;

//     try {
//         const results = await mysqlConnection.executeQuery(sql, [userId]); 

//         let totalPrice = 0;
//         let cartSummary = [];

//         results.forEach(item => {
//             const price = item.discountPrice || item.price;
//             const totalItemPrice = price * item.quantity;
//             const discountItemPrice = item.price - item.discountPrice;
//             totalPrice += totalItemPrice;

//             cartSummary.push({
//                 name: item.name,
//                 originalPrice: item.price,
//                 quantity: item.quantity,
//                 discountPrice: discountItemPrice,
//                 totalPrice: totalItemPrice,
//                 size: item.size,
//                 color: item.color,
//                 image: item.image
//             });
//         });

//         return res.render("basket", {
//             title: "Shopping Cart",
//             cartItems: results,
//             cartSummary,
//             discount: 0,
//             totalPrice
//         });
//     } catch (err) {
//         console.error("Error fetching cart:", err);
//         return res.status(500).json({ message: "Cannot fetch cart items." });
//     }
// });

// Router.post("/cart/update/:id", async (req, res) => {
//     const cartId = req.params.id;
//     const { quantity } = req.body;

//     try {
//         await mysqlConnection.executeQuery(
//             "UPDATE cart SET quantity = ? WHERE id = ?",
//             [quantity, cartId]
//         );
//         res.json({ success: true, message: "Quantity updated!" });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Database error" });
//     }
// });
// Router.post("/cart/delete/:id", async (req, res) => {
//     const cartId = req.params.id;

//     try {
//         await mysqlConnection.executeQuery("DELETE FROM cart WHERE id = ?", [cartId]);
//         res.json({ success: true, message: "Item deleted!" });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Database error" });
//     }
// });

// Router.get("/success", (req, res) => {
//     res.render("success", { title: "Checkout Successful" });
// });

// Router.post("/checkout", async (req, res) => {
//     const { cartIds } = req.body;
//     const userId = req.session.userId;

//     if (!userId) {
//         return res.status(401).json({ success: false, message: "User not logged in" });
//     }

//     if (!cartIds || cartIds.length === 0) {
//         return res.status(400).json({ success: false, message: "No items selected for checkout" });
//     }

//     try {
//         await mysqlConnection.executeQuery(
//             "DELETE FROM cart WHERE id IN (?) AND user_id = ?",
//             [cartIds, userId]
//         );

//         res.json({ success: true, message: "Checkout successful" });
//     } catch (error) {
//         console.error("Error during checkout:", error);
//         res.status(500).json({ success: false, message: "Database error during checkout" });
//     }
// });

// Router.get("/all", async (req, res) => {
//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name
//             FROM Products p
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             ORDER BY p.Product_Name DESC
//         `;
//         const [results] = await mysqlConnection.executeQuery(sql);
//         console.log("Fetched a Products:");
//         res.render("allProduct", { title: "all product", products: results });
//     } catch (err) {
//         console.log("Database error:", err);
//         res.status(500).json({ message: "Products not found." });
//     }
// });


// Router.get("/women", async (req, res) => {
//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name
//             FROM Products p
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             WHERE c.Category_Name = 'WOMEN'
//             ORDER BY p.Product_Name DESC
//         `;
//         const [results] = await mysqlConnection.executeQuery(sql);
//         console.log("Fetched Women's Products:", results);
//         res.render("women", { title: "Women Category", products: results });
//     } catch (err) {
//         console.log("Database error:", err);
//         res.status(500).json({ message: "Products not found." });
//     }
// });

// Router.get("/men", async (req, res) => {
//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name
//             FROM Products p
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             WHERE c.Category_Name = 'MEN'
//             ORDER BY p.Product_Name DESC
//         `;
//         const [results] = await mysqlConnection.executeQuery(sql);
//         console.log("Fetched men's Products:", results);
//         res.render("men", { title: "Men Category", products: results });
//     } catch (err) {
//         console.log("Database error:", err);
//         res.status(500).json({ message: "Products not found." });
//     }
// });

// Router.get("/kids", async (req, res) => {
//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name
//             FROM Products p
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             WHERE c.Category_Name = 'KIDS'
//             ORDER BY p.Product_Name DESC
//         `;
//         const [results] = await mysqlConnection.executeQuery(sql);
//         console.log("Fetched kids's Products:", results);
//         res.render("kids", { title: "kid Category", products: results });
//     } catch (err) {
//         console.log("Database error:", err);
//         res.status(500).json({ message: "Products not found." });
//     }
// });

// Router.get("/sport", async (req, res) => {
//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name
//             FROM Products p
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             WHERE c.Category_Name = 'SPORTS'
//             ORDER BY p.Product_Name DESC
//         `;
//         const [results] = await mysqlConnection.executeQuery(sql);
//         console.log("Fetched sports's Products:", results);
//         res.render("sport", { title: "sport Category", products: results });
//     } catch (err) {
//         console.log("Database error:", err);
//         res.status(500).json({ message: "Products not found." });
//     }
// });

// Router.get("/unisex", async (req, res) => {
//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name
//             FROM Products p
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             WHERE c.Category_Name = 'UNISEX'
//             ORDER BY p.Product_Name DESC
//         `;
//         const [results] = await mysqlConnection.executeQuery(sql);
//         console.log("Fetched unisex's Products:", results);
//         res.render("unisex", { title: "unisex Category", products: results });
//     } catch (err) {
//         console.log("Database error:", err);
//         res.status(500).json({ message: "Products not found." });
//     }
// });



 
// Router.get("/contact", (req, res) => {
//     res.render("contact", { title: "Contact Us" });
// });
 
// Router.get("/search", async (req, res) => {
//     const query = req.query.productName; 

//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name 
//             FROM Products p 
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             WHERE p.Product_Name LIKE ? OR c.Category_Name LIKE ?
//             ORDER BY p.Product_Name DESC
//         `;
//         const searchResults = await mysqlConnection.executeQuery(sql, [`%${query}%`, `%${query}%`]);

//         res.render("search", {
//             title: "Search Results",
//             query: query,
//             searchProduct: searchResults
//         });
//     } catch (err) {
//         console.error("Database error:", err);
//         res.status(500).json({ message: "Error during search." });
//     }
// });


// Router.get('/api/products', async (req, res) => {
//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name 
//             FROM Products p 
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             ORDER BY p.Product_Name DESC
//         `;
//         const results = await mysqlConnection.executeQuery(sql);
//         res.json(results);
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ message: "Error fetching products" });
//     }
// });

// Router.get('/api/women', async (req, res) => {
//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name 
//             FROM Products p
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             WHERE c.Category_Name = 'WOMEN'
//             ORDER BY p.Product_Name DESC
//         `;
//         const results = await mysqlConnection.executeQuery(sql);
//         res.json(results);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error fetching products'); // Changed to 500 for server error
//     }
// });

// Router.get('/api/men', async (req, res) => {
//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name 
//             FROM Products p
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             WHERE c.Category_Name = 'MEN'
//             ORDER BY p.Product_Name DESC
//         `;
//         const results = await mysqlConnection.executeQuery(sql);
//         res.json(results);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error fetching products'); // Changed to 500 for server error
//     }
// });

// Router.get('/api/kids', async (req, res) => {
//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name 
//             FROM Products p
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             WHERE c.Category_Name = 'KIDS'
//             ORDER BY p.Product_Name DESC
//         `;
//         const results = await mysqlConnection.executeQuery(sql);
//         res.json(results);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error fetching products'); // Changed to 500 for server error
//     }
// });

// Router.get('/api/sport', async (req, res) => {
//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name 
//             FROM Products p
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             WHERE c.Category_Name = 'SPORTS'
//             ORDER BY p.Product_Name DESC
//         `;
//         const results = await mysqlConnection.executeQuery(sql);
//         res.json(results);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error fetching products'); // Changed to 500 for server error
//     }
// });

// Router.get('/api/unisex', async (req, res) => {
//     try {
//         const sql = `
//             SELECT p.*, c.Category_Name 
//             FROM Products p
//             JOIN Category c ON p.Category_ID = c.Category_ID
//             WHERE c.Category_Name = 'UNISEX'
//             ORDER BY p.Product_Name DESC
//         `;
//         const results = await mysqlConnection.executeQuery(sql);
//         res.json(results);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error fetching products'); // Changed to 500 for server error
//     }
// });
 
module.exports = Router;