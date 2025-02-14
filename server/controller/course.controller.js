const { upload } = require("../config/upload");
const Category = require("../models/category.model");
const { Courses } = require("../models/course.model");

const Instructor = require("../models/instructor.model");

//course creation
async function createCourseHandler(req, res) {
  const { title, imageurl, description,price, tags , categoryId } = req.body;
  try {
    const instructor = await Instructor.findById(req.instructor._id);
    if (!instructor.canCreateCourse) {
      return res.status(404).json({
        success: false,
        message: "No access to create a course !!!",
        instructor: {
          id: req.instructor._id,
        },
      });
    }
    const course = await Courses.create({
      title,
      imageurl,
      description,
      tags,
      price,
      instructor: req.instructor._id,
      category : categoryId
    });
    instructor.courses.push(course._id);
    await instructor.save();
    await course.save();

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: {
        courseId: course.id,
        title: course.title,
      },
    });
  } catch (error) {
    console.log("[COURSE_CREATION_ERRROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

//get courses with chapters
async function getCourses(req, res) {
  try {
    const courses = await Courses.find()
      .populate({
        path: "instructor",
        select: "email",
      })
      .populate("chapters");

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.log("[GET_COURSES_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function getCourseById(req, res) {
  const { courseId } = req.params;
  try {
    const course = await Courses.findById(courseId).populate({
      path: "chapters",
      select: "title description imageurl _id",
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course found",
      course: course,
    });
  } catch (error) {
    console.log("[SINGLE_COURSE_FETCH_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


async function createCategory(req,res){
  try {
    const {name , description} = req.body
    const course  = await Category.create({
      name ,
      description
    })
    await course.save()
    return res.status(201).json({
      success: true,
      message : "category created successfully"
    })
    
  } catch (error) {
    console.log('[CREATE_CATEGORY_ERROR]', error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
    
  }
}
async function imageUploadHandler(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file Uploaded !!!",
    });
  }

  




  const filePath = req.file.path;
  res.json({
    url: filePath,
  });
}


async function paymentHandler() {
  try {
    
  } catch (error) {
    
  }
}

async function uploadNotes() {
  
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file Uploaded !!!",
      });
    }
  
    const filePath = req.file.path;
    res.json({
      success : true,
      message : "Document Uploaded !!!",
      url: filePath,
    });

}

module.exports = {
  createCourseHandler,
  imageUploadHandler,
  getCourses,
  getCourseById,
  createCategory,
  paymentHandler
};
