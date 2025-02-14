import CreateCourse from "@/components/app/admin/create-course/createcourse";
import TabHeader from "@/components/app/admin/layout/tabHeader";
import InstructorLayout from "@/components/app/instructor/instructorlayout";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const InstructorCourses = () => {
  const [createCourse, setCreateCourse] = useState(false);
  const subHeader = new Map();
  if (createCourse) {
    subHeader.set(1, "Create");
  }

  console.log(createCourse);
  return (
    <InstructorLayout>
      <TabHeader title="Courses" subHeader={subHeader} />
      <section>
        {createCourse ? (
          <CreateCourse setCreate={setCreateCourse} create={createCourse} />
        ) : (
          <div className="w-full border border-neutral-200 shadow-sm rounded-md p-6 mt-4 flex items-center justify-between">
            <h1>Create a course</h1>
            <button
              onClick={() => {
                setCreateCourse(true);
              }}
              className="rounded-md px-3 py-2 bg-gradient-to-b from-purple-500 to-purple-600 text-white flex items-center gap-2"
            >
              Create <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>
    </InstructorLayout>
  );
};

export default InstructorCourses;
