export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Visant®
        </h1>
        <p className="text-muted-foreground">
          Where visionarybrands are born.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/protected"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Explore our work
          </a>
        </div>
      </div>
    </main>
  );
}
