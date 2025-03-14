export function PageContent({ children }: { children: any }) {
  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}