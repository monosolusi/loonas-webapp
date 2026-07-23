type ProductFormLayoutProps = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export function ProductFormLayout({ left, right }: ProductFormLayoutProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-x-6">
      <div className="flex min-w-0 flex-col gap-y-6 lg:flex-1">{left}</div>
      <div className="lg:w-[280px] lg:shrink-0">
        <div className="flex flex-col gap-y-6 lg:sticky lg:top-8">{right}</div>
      </div>
    </div>
  );
}
