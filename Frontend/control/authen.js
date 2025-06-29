// authen.js
const bcrypt = require("bcryptjs");
const UserDB = require("../model/userModel");

const userLogin = async function (req, res, username, password) {
    try {
        console.log("Attempting login for username:", username);
        console.log("Attempting login for password:", password);
        const oldUser = await UserDB.findByKey("username", username);

        if (oldUser) {
            const isPasswordCorrect = bcrypt.compareSync(password, oldUser.password_hash);
            if (isPasswordCorrect) {
                req.session.authenticated = true;
                req.session.userId = oldUser.id;
                req.session.username = username;
            
                console.log("User logged in. Session Data:", req.session);
                return oldUser; // Return the user object instead of true
            }
             else {
                console.log("Wrong authentication");
                return false;
            }
        } else {
            console.log("User not found");
            return false;
        }
    } catch (error) {
        console.error("Login error:", error);
        return false;
    }
};

const userSignup = async function (req, res, username,phone,email, password) {
    try {
        console.log("Attempting signup for username:", username);
        const oldUser = await UserDB.findByKey("username", username);

        if (oldUser) {
            console.log("User already exists");
            return false;
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await UserDB.createUser(username,phone,email, hashedPassword);

        if (newUser) {
            req.session.authenticated = true;
            req.session.userId = newUser.id;
            req.session.username = username;

            console.log("User signed up. Session Data:", req.session);
            return true;
        } else {
            console.log("Failed to create user");
            return false;
        }
    } catch (error) {
        console.error("Signup error:", error);
        return false;
    }
};

const authentication = async (req, res, next) => {
    console.log("Session in authentication: ", req.sessionID);

    if (!req.session.authenticated) {
        console.log("Unauthenticated access attempt.");
        return res.redirect("/?q=session-expired");
    }

    try {
        const user = await UserDB.findById(req.session.userId);

        if (!user) {
            console.log("User not found. Session expired.");
            req.session.destroy();
            return res.status(401).json({ message: "Session expired" });
        }

        next();
    } catch (err) {
        console.error("Authentication error:", err);
        res.status(500).json({ msg: "Server error. Please reload the page later." });
    }
};

module.exports = {
    userLogin,
    userSignup,
    authentication,
};