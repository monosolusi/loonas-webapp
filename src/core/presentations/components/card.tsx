export function Card({ children }: { children?: any }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
  );
}