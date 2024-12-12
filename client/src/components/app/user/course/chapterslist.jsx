import React from 'react';

const ChaptersList = ({ chapters }) => {
  console.log(chapters);
  return (
    <div className='flex flex-col space-y-4 mt-3'>
      {chapters?.map((c, i) => (
        <ChapterItems key={i} title={c.title} description={c.description} imageurl={c.description} videoUrl={c.videoUrl} />
      ))}
    </div>
  );
};

const ChapterItems = ({ title, description }) => {
  return (
    <section className='bg-purple-50 shadow-sm border border-purple-600 p-3 rounded-md'>
      <div>{title}</div>
      <h1 className="text-muted-foreground text-xs">
        {description}
      </h1>
    </section>
  );
};

export default ChaptersList;
