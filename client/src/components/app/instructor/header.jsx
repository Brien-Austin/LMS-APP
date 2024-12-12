const InstructorHeader = ({ name }) => {
  return (
    <section>
      {name !== undefined ? (
        <h1 className="text-2xl pt-5 font-[900] text-neutral-600 drop-shadow-sm">
          Hey, {name}
        </h1>
      ) : (
        <div className="w-24 h-6 bg-slate-100 animate-pulse" />
      )}
    </section>
  );
};

export default InstructorHeader;
