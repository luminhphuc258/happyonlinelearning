import UserRole from '../models/userrole.js';

// add new user role
export const addUserRole = async (req, res) => {
  const { user_id, role_name } = req.body;
  try {
    const newUserRole = await UserRole.create({
      user_id,
      role_name,
      assigned_at: new Date()
    });
    res.status(201).json({
      status: "success",
      message: "User role added successfully",
      data: newUserRole
    });
  } catch (error) {
    console.error("Error adding user role:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to add user role"
    });
  }
};

// update user role
export const updateUserRole = async (req, res) => {
  const { user_id, role_name } = req.body;
  try {
    const roleToUpdate = await UserRole.findByPk(user_id);
    if (roleToUpdate) {
      roleToUpdate.role_name = role_name;
      await roleToUpdate.save();
      res.status(200).json({
        status: "success",
        message: "User role updated successfully",
        data: roleToUpdate
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "User role not found"
      });
    }
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update user role"
    });
  }
};


