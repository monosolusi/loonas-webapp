type ProductFormLayoutProps = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export function ProductFormLayout({ left, right }: ProductFormLayoutProps) {
  return (
    <div className="flex flex-row gap-x-6">
      <div className="flex min-w-0 flex-1 flex-col gap-y-6">{left}</div>
      <div className="w-[280px] shrink-0">
        <div className="sticky top-8 flex flex-col gap-y-6">{right}</div>
      </div>
    </div>
  );
}
