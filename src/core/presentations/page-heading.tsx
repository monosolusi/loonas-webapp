export function PageHeading({ children }: { children: any }) {
  return (
    <header className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="relative text-3xl font-bold tracking-tight text-gray-900 inline-block">
          {children}
          <span className="absolute left-0 -bottom-2 w-3/4 h-1 bg-primary-default"></span>
        </h1>
      </div>

      {/* Elemen Dekoratif Abstrak */}
      <div
        aria-hidden="true"
        className="absolute top-full left-0 -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-mt-10 sm:-ml-96 sm:translate-y-0 sm:rotate-0 sm:opacity-50"
      >
        <div
          style={{
            clipPath:
              "polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)"
          }}
          className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#007bff] to-[#60a5fa]"
        />
      </div>
    </header>

  );
}