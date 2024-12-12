import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import ChaptersList from '@/components/app/user/course/chapterslist';

import appApiClient from '@/utils/auth';
import { USER_ENROLL_FREE_COURSE, USER_URL } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const Course = () => {
  const { id: courseId } = useParams();
  const { user } = useAuth();
  console.log(user);
  const FETCH_COURSE = `${USER_URL}/course/${courseId}`;
  const navigate = useNavigate();

  const { data: course, isLoading } = useQuery({
    queryKey: ['fetch course by id', courseId],
    queryFn: async () => {
      const response = await appApiClient.get(FETCH_COURSE);
      return response.data.course;
    },
  });
  console.log(course);

  async function handleEnroll(free) {
    try {
      if (free) {
        const response = await appApiClient.post(`${USER_ENROLL_FREE_COURSE}/${courseId}`);
        console.log(response);
        toast.success('Enrolled successfully');
      }
    } catch (error) {
      console.log('[COURSE_ENROLL_ERROR]', error);

      const axiosError = error;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            toast.error('User already enrolled');
            break;
          case 401:
            toast.error('Please login to enroll');
            break;
          case 403:
            toast.error("You don't have permission to enroll");
            break;
          default:
            toast.error('Error enrolling in course');
        }
      } else {
        toast.error('Unable to connect to server');
      }
    }
  }

  const isUserEnrolled = useMemo(() => {
    return (
      courseId &&
      user?.courses.some((enrolledCourse) =>
        Array.isArray(enrolledCourse.course)
          ? enrolledCourse.course.some((c) => c._id === courseId)
          : enrolledCourse.course._id === courseId
      )
    );
  }, [courseId, user?.courses]);
  console.log(isUserEnrolled);

  return (
    <main>
      {isLoading ? (
        <div className="flex flex-col px-5">
          <div className="mt-6 w-full h-16 rounded-md bg-neutral-50 animate-pulse" />
          <div className="mt-6 w-full h-48 rounded-md bg-neutral-50 animate-pulse" />
          <div className="mt-6 w-full h-16 rounded-md bg-neutral-50 animate-pulse" />
          <div className="mt-6 w-2/5 h-10 rounded-md bg-neutral-50 animate-pulse" />
          <div className="mt-6 w-full h-24 rounded-md bg-neutral-50 animate-pulse" />
          <div className="mt-6 w-full h-24 rounded-md bg-neutral-50 animate-pulse" />
          <div className="mt-6 w-full h-24 rounded-md bg-neutral-50 animate-pulse" />
        </div>
      ) : (
        <article className="w-full min-h-screen bg-white sm:px-4 sm:py-4 mb-20">
          <header>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-700">
              {course?.title}
            </h1>
          </header>

          <figure className="mt-4 sm:block lg:flex lg:items-center space-x-16 ">
            <div className="sm:w-full sm:h-48 border lg:w-3/5 lg:h-72 border-neutral-200 shadow-sm rounded-2xl bg-white flex justify-center items-center relative">
              <img
                src={course?.imageurl}
                className="h-full w-full rounded-lg object-cover"
                alt=""
              />
              <div className="absolute top-0 left-0">
                <div className="flex flex-wrap items-center space-x-2 p-2">
                  <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    <span className="text-xs">{course?.tags?.domain}</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-0">
                <div className="flex flex-wrap items-center space-x-4 p-2">
                  {course?.tags?.languages.slice(0, 3).map((t, i) => (
                    <div key={i} className="space-x-2">
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
            <p className="text-sm text-neutral-700 font-medium">{course?.description}</p>
          </section>

          <section className="sm:mt-6 lg:mt-8">
            <h2 className="sm:text-lg lg:text-xl font-bold text-neutral-600">Chapters</h2>
            {course?.chapters && <ChaptersList chapters={course?.chapters} />}
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
                      {course?.isFree ? (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 7v9a2 2 0 01-2 2H9a2 2 0 01-2-2V7m3 9h3m-3 0h-3m4.5-11l2 2m-2-2l-2 2"
                            />
                          </svg>
                          <span>Enroll Now</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707h12.16c.891 0 1.337-1.077.707-1.707L17 13"
                            />
                          </svg>
                          <span>Enroll Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {/* Desktop View */}
                <div className="lg:flex lg:px-8 py-3 hidden">
                  <div className="w-full max-w-xl mx-auto">
                    <button
                      onClick={() => handleEnroll(course?.isFree)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                    >
                      {course?.isFree ? (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 7v9a2 2 0 01-2 2H9a2 2 0 01-2-2V7m3 9h3m-3 0h-3m4.5-11l2 2m-2-2l-2 2"
                            />
                          </svg>
                          <span>Enroll Now</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707h12.16c.891 0 1.337-1.077.707-1.707L17 13"
                            />
                          </svg>
                          <span>Enroll Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </article>
      )}
    </main>
  );
};

export default Course;
