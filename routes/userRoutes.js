const express = require("express");

const router = express.Router();

const {
    createUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");


// CREATE USER
router.post("/", createUser);


// GET ALL USERS
router.get("/", getUsers);


// GET SINGLE USER
router.get("/:id", getSingleUser);


// UPDATE USER
router.put("/:id", updateUser);


// DELETE USER
router.delete("/:id", deleteUser);


module.exports = router;