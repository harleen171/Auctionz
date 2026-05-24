const prisma = require("../config/prisma");


// CREATE USER
const createUser = async (req, res) => {

    try {

        const { name, email } = req.body;

        const user = await prisma.user.create({
            data: {
                name,
                email
            }
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "User creation failed"
        });

    }

};


// GET ALL USERS
const getUsers = async (req, res) => {

    try {

        const users = await prisma.user.findMany();

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Cannot fetch users"
        });

    }

};



// GET SINGLE USER
const getSingleUser = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Cannot fetch user"
        });

    }

};


// UPDATE USER
const updateUser = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const { name, email } = req.body;

        const updatedUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                name,
                email
            }
        });

        res.status(200).json({
            success: true,
            updatedUser
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "User update failed"
        });

    }

};


// DELETE USER
const deleteUser = async (req, res) => {

    try {

        const id = Number(req.params.id);

        await prisma.user.delete({
            where: {
                id
            }
        });

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "User deletion failed"
        });

    }

};
module.exports = {
    createUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser
};