const User = require('../models/user.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
    try {
        let {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType
        } = req.body;

        console.log("hello")

        if (
            !firstName ||
            !lastName ||
            !email ||
            !confirmPassword 
        ) {
            return res.status(400).json({
                success: false,
                message: "Please Fill in all the Required Fields to Sign up.",
            });
        }
        
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please Provide a valid Email Address.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Password and Confirm Password do not Match. Please Try Again.",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is Already Registered.",
            });
        }

        const reservedBooks = []

        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUser = await User.find({accountType: 'Admin'})

        if(accountType==='Admin'&& adminUser){
            return res.status(403).json({
                message: 'Admin user already exists',
                success: false
            })
        }

        if(accountType==null){
            accountType="User"
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            reservedBooks
        });

        return res.status(200).json({
            success: true,
            message: "User is Registered Successfully",
            user,
        });
    } catch (error) {
        console.error("Error in signUp:", error);
        return res.status(500).json({
            success: false,
            message: "User Cannot be Registered. Please Try Again.",
            error: error.message,
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please Provide Both Email and Password to Login.",
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email Format. Please Provide a valid Email Address.",
            });
        }

        const user = await User.findOne({ email })
            .populate("reservedBooks")
            .exec();

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials. User is not Registered. Please Sign up.",
            });
        }

        if (user.token) {
            return res.status(401).json({
                success: false,
                message: "User is Already logged in.",
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in Successfully.",
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials. Please check your Email and Password.",
            });
        }
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({
            success: false,
            message: "Login Failure. Please Try Again Later.",
            error: error.message,
        });
    }
};

