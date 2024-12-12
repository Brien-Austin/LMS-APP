import React from "react";
import EnrolledCourseChapters from "../chapters";

const CourseHome = ({ chapters, completedChapters }) => {
  const completed = chapters.filter(chapter => completedChapters.includes(chapter._id));
  console.log(completed);

  return (
    <main>
      <section>
        <EnrolledCourseChapters completedChapters={completedChapters} chapters={chapters} />
      </section>
    </main>
  );
};

export default CourseHome;
