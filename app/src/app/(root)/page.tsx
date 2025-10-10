
export default function Home() {
  return (
    <div className="min-h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-screen mx-auto p-4 relative z-10">
        <h1 className="relative z-10 text-3xl sm:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          <span className="text-primary">Neural Notes</span>
          <br />
          <span className="text-2xl sm:text-6xl">

          Learn smarter with your notes
          </span>
        </h1>
        <p className="mt-8 text-neutral-400 max-w-lg mx-auto my-2 text-sm md:text-base text-center relative z-10">
          Turn your notes, PDFs, and videos into an AI study companion — chat
          with your material, uncover weak spots, and get personalized roadmaps
          to master any topic.
        </p>
      </div>
    </div>
  );
}
