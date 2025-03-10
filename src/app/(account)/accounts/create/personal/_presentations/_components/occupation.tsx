import { Label } from "@/app/(account)/accounts/create/personal/_presentations/_components/label";
import { Select } from "@/app/(account)/accounts/create/personal/_presentations/_components/select";

export function Occupation() {
  return (
    <div className="sm:col-span-4">
      <Label
        title="Pekerjaan"
        description="Masukkan pekerjaanmu yang sedang kamu tekuni saat ini, ya."
      />
      <div className="mt-2">
        <Select
          data={[
            { value: "pelajar", label: "Pelajar" }
          ]}
        />
      </div>
    </div>
  );
}