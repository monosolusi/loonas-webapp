export function PageMain({ children }: { children: any }) {
  return (
    <div className="relative isolate overflow-hidden pt-16">
      <div className="py-10">
        {children}
      </div>
    </div>
  );
}