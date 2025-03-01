import Program from '../models/programs.js';
import dotenv from "dotenv";

dotenv.config();

export const addProgram = async (req, res) => {
  console.log("Calling add program!");
  console.log(req.body);

  const { program_name, description, total_credits, start_date, end_date } = req.body;

  // Validate required fields
  if (!program_name || !total_credits || !start_date || !end_date) {
    return res.status(400).json({
      status: "error",
      message: "Program name, total credits, start date, and end date are required."
    });
  }

  try {
    const existingData = await Program.findOne({
      where: {
        program_name // Check for duplicate program name
      }
    });

    if (existingData) {
      return res.status(409).json({
        status: "error",
        message: "Program already exists."
      });
    }

    const newProgram = await Program.create({
      program_name,
      description: description || null,
      total_credits,
      is_active: true, // default to true
      start_date,
      end_date
    });

    console.log("Program creation successful:");

    // Return success response with program data
    res.status(200).json({
      status: "success",
      message: "Program created successfully",
      program: {
        program_id: newProgram.program_id,
        program_name: newProgram.program_name,
        description: newProgram.description,
        total_credits: newProgram.total_credits,
        is_active: newProgram.is_active,
        start_date: newProgram.start_date,
        end_date: newProgram.end_date
      }
    });
  } catch (error) {
    console.error("Error adding program:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error."
    });
  }
};

export const fetchAllPrograms = async () => {
  try {
    console.log("============ Calling to get active programs data ================");

    const allPrograms = await Program.findAll({
      where: {
        is_active: true // Only fetch programs that are active
      }
    });
    console.log("=====check active programs data ===");
    console.log(JSON.stringify(allPrograms, null, 2));

    return allPrograms.map(program => ({
      program_id: program.program_id,
      program_name: program.program_name,
      description: program.description,
      total_credits: program.total_credits,
      is_active: program.is_active,
      start_date: program.start_date,
      end_date: program.end_date
    }));
  } catch (error) {
    console.error("Error fetching programs:", error);
  }
};

export const deleteProgram = async (req, res) => {
  console.log("Calling to delete this program");
  const { program_id } = req.body;

  try {
    console.log("Calling to delete this program", program_id);

    const result = await Program.destroy({
      where: {
        program_id
      }
    });

    if (result === 0) {
      return res.status(404).json({
        status: "error",
        message: "Program not found."
      });
    }

    res.status(200).json({
      status: "success",
      message: "Program deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error."
    });
  }
};

export default addProgram;
