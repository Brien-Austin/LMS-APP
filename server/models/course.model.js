const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },

  verifiedByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },
  imageurl: {
    type: String,
  },
  price: {
    type: Number,
    required: false,
  },

  isFree: {
    type: Boolean,
    default: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },

  isYoutubeCourse: {
    type: Boolean,
    default: false,
  },

  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  description: {
    type: String,
  },
  tags: {
    domain: {
      type: String,
    },
    languages: [
      {
        name: String,
      },
    ],
  },
  chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapters",
      required: false,
    },
  ],
});

const notesSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },

  url : {
    type : String,
    required : true
  }
})

const Notes = mongoose.model("Notes",notesSchema) || mongoose.models.Notes

const Courses =
  mongoose.model("Courses", courseSchema) || mongoose.models.Courses;
module.exports = {Courses,Notes};
