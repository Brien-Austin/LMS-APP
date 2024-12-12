import React from 'react';
import EnrolledCourseChapterItem from './chapterItem';

const EnrolledCourseChapters = ({ chapters, completedChapters }) => {
  return (
    <div className='flex flex-col sm:space-y-4 lg:space-y-8 pb-20 '>
      {chapters.map((c, i) => (
        <EnrolledCourseChapterItem completedChapters={completedChapters} key={i} chapter={c || []} />
      ))}
    </div>
  );
};

export default EnrolledCourseChapters;
