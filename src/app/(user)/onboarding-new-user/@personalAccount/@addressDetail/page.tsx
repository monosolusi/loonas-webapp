import { SelectInput } from "@/core/presentations/components/select-input";
import { TextAreaInput } from "@/core/presentations/components/text-area-input";

export default function AddressDetailInputPage() {
  return (
    <>
      <div className="mb-6 flex flex-col">
        <span className="text-lg leading-6 font-medium text-neutral-500">Alamat Domisili</span>
        <span className="text-sm leading-5 font-medium text-neutral-200">
          Lengkapi detail alamat tempat tinggal Anda
        </span>
      </div>
      <div className="mb-8 flex flex-col gap-4">
        {/* Province Input */}
        <SelectInput options={[]} label="Provinsi" placeholder="Pilih Provinsi" />

        {/* City Input */}
        <SelectInput options={[]} label="Kabupaten/Kota" placeholder="Pilih Kabupaten/Kota" />

        {/* District Input */}
        <SelectInput options={[]} label="Kecamatan" placeholder="Pilih Kecamatan" />

        {/* Subdistrict Input */}
        <SelectInput options={[]} label="Kelurahan" placeholder="Pilih Kelurahan" />

        {/* Address Input */}
        <TextAreaInput label="Alamat" placeholder="Masukkan alamat lengkap" />
      </div>
    </>
  );
}
