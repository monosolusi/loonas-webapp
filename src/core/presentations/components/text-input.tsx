import { Label } from "@/core/presentations/components/label";

export function TextInput({ title, description, htmlFor, value, onChange }: {
  title: string,
  description?: string,
  htmlFor?: string
  value?: string,
  onChange?: (value: string) => void,
}) {

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) onChange(e.target.value);
  }

  return (
    <div>
      <Label
        htmlFor={htmlFor}
        title={title}
        description={description}
      />
      <div className="mt-2">
        <input
          id="id-document"
          name="id-document"
          type="text"
          value={value}
          onChange={handleChange}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-default sm:text-sm/6"
          required
        />
      </div>
    </div>
  );
}