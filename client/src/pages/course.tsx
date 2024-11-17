import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import ChaptersList from '@/components/app/user/course/chapterslist';
import { Course as CourseType } from '@/types/api-return';
import appApiClient from '@/utils/auth';
import { USER_ENROLL_FREE_COURSE, USER_URL } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';


const Course: React.FC = () => {
  const { id: courseId } = useParams();
  const {user} = useAuth()
  console.log(user)
  const FETCH_COURSE = USER_URL + `/course/${courseId}`;
  const navigate = useNavigate();

  const { data: course , isLoading} = useQuery<CourseType>({
    queryKey: ["fetch course by id", courseId],
    queryFn: async () => {
      const response = await appApiClient.get(FETCH_COURSE);
      return response.data.course;
    }
  });
console.log(course)
  async function handleEnroll(free: boolean | undefined) {
    try {
      if (free) {
        const response = await appApiClient.post(`${USER_ENROLL_FREE_COURSE}/${courseId}`);
        console.log(response)
        toast.success("Enrolled successfully");
      }
    } catch (error) {
      console.log('[COURSE_ENROLL_ERROR]', error);
      
  
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        
        switch (axiosError.response.status) {
          case 400:
            toast.error("User already enrolled");
            break;
          case 401:
            toast.error("Please login to enroll");
            break;
          case 403:
            toast.error("You don't have permission to enroll");
            break;
          default:
            toast.error("Error enrolling in course");
        }
      } else {
     
        toast.error("Unable to connect to server");
      }
    }
  }
  const isUserEnrolled = useMemo(() => {
    return courseId && user?.courses.some(enrolledCourse =>
      Array.isArray(enrolledCourse.course)
        ? enrolledCourse.course.some(c => c._id === courseId)
        : enrolledCourse.course._id === courseId
    );
  }, [courseId, user?.courses]);
  console.log(isUserEnrolled)

  return (
   <main>
    {isLoading ? 
    <div className='flex flex-col px-5'>
      <div className="mt-6 w-full h-16 rounded-md bg-neutral-50 aimate-pulse"/>
      <div className="mt-6 w-full h-48 rounded-md bg-neutral-50 aimate-pulse"/>
      <div className="mt-6 w-full h-16 rounded-md bg-neutral-50 aimate-pulse"/>
      <div className="mt-6 w-2/5 h-10 rounded-md bg-neutral-50 aimate-pulse"/>
      <div className="mt-6 w-full h-24 rounded-md bg-neutral-50 aimate-pulse"/>
      <div className="mt-6 w-full h-24 rounded-md bg-neutral-50 aimate-pulse"/>
      <div className="mt-6 w-full h-24 rounded-md bg-neutral-50 aimate-pulse"/>
    </div> :  <article className="w-full min-h-screen bg-white sm:px-4 sm:py-4 mb-20">
      
      <header>
        <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-700'>
          {course?.title}
        </h1>
      </header>

      <figure className='mt-4 sm:block lg:flex lg:items-center space-x-16 '>
        <div className='sm:w-full sm:h-48 border lg:w-3/5 lg:h-72 border-neutral-200 shadow-sm rounded-2xl bg-white flex justify-center items-center relative'>
         <img src={course?.imageurl}  className="h-full w-full rounded-lg object-cover"alt="" />
          <div className="absolute top-0 left-0">
            <div className="flex flex-wrap items-center space-x-2 p-2">
              <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                <span className="text-xs">{course?.tags?.domain}</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0">
            <div className="flex flex-wrap items-center space-x-4 p-2">
              {course?.tags?.languages.slice(0,3).map((t, i) => (
                <div key={i} className='space-x-2'>
                  <span className="text-xs bg-white border border-neutral-100 ring-1 ring-purple-500 text-purple-800 px-2 py-1 rounded-full mr-1">
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          
        </div>

        <section className="mt-4">
        <h2 className="sr-only">Course Description</h2>
        <p className="sm:hidden lg:block lg:text-neutral-500 text-lg font-medium">
          {course?.description}
        </p>
      </section>
        <figcaption className="sr-only">Course cover image</figcaption>
      </figure>

      <section className="mt-4 smn:block lg:hidden">
        <h2 className="sr-only">Course Description</h2>
        <p className="text-sm text-neutral-700 font-medium">
          {course?.description}
        </p>
      </section>

      <section className='sm:mt-6 lg:mt-8'>
        <h2 className='sm:text-lg lg:text-xl font-bold text-neutral-600'>
          Chapters
        </h2>
       {course?.chapters &&  <ChaptersList chapters={course?.chapters} />}
      </section>

      <nav className="fixed bottom-0 bg-white/90 backdrop-blur-sm w-full h-auto z-50 border-t shadow-lg left-0">
  {isUserEnrolled ? (
    <div className="container mx-auto px-4 py-3 sm:py-4 lg:py-5">
      <div className="w-full max-w-xl mx-auto">
        <button className="w-full px-4 py-3 lg:py-4 text-white text-center rounded-full bg-gradient-to-r from-purple-600 to-purple-700 via-purple-500 hover:shadow-md transition-all duration-300 cursor-pointer font-medium flex items-center justify-center space-x-2 group">
          <svg 
            className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <span className="text-base lg:text-lg">Continue Learning</span>
        </button>
      </div>
    </div>
  ) : (
    <div className="container mx-auto">
      {/* Mobile View (sm) */}
      <div className="lg:hidden px-4 py-3">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => handleEnroll(course?.isFree)}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
          >
            {course?.price == 0 ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7v9a2 2 0 01-2 2H9a2 2 0 01-2-2V7m3 9h3m-3 0h-3m4.5-11l2 2m-2-2l-2 2" />
                </svg>
                <span>Enroll Now</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span onClick={()=>{}}>Get Premium</span>
              </>
            )}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 border-2 border-purple-500 rounded-full hover:bg-purple-50 transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-purple-700 font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Desktop View (lg) */}
      <div className="hidden lg:block px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border-2 border-purple-500 rounded-full hover:bg-purple-50 transition-colors duration-300 flex items-center justify-center space-x-2 group"
            >
              <svg 
                className="w-4 h-4 text-purple-700 group-hover:-translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-purple-700 font-medium">Back to Courses</span>
            </button>
            {course?.price && !course?.isFree && (
              <div className="text-lg font-semibold text-gray-900">
                ${course.price}
              </div>
            )}
          </div>
          
          <button
            onClick={() => handleEnroll(course?.isFree)}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 min-w-[200px]"
          >
            {course?.isFree ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7v9a2 2 0 01-2 2H9a2 2 0 01-2-2V7m3 9h3m-3 0h-3m4.5-11l2 2m-2-2l-2 2" />
                </svg>
                <span className="text-lg">Enroll Now</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-lg">Buy this course</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )}
</nav>

    </article>}
   </main>
  );
};

export default Course;