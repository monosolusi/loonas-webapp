import {
  NationalityRadioItem
} from "@/app/(user)/onboarding-new-user/@personalAccount/_components/nationality-radio-item";
import { TextInput } from "@/core/presentations/components/text-input";
import { SelectInput } from "@/core/presentations/components/select-input";

export default function PersonalDetailInputPage() {
  return (
    <>
      <div className="mb-6 flex flex-col">
        <span className="text-lg leading-6 font-medium text-neutral-500">Data Diri</span>
        <span className="text-sm leading-5 font-medium text-neutral-200">
          Isi data diri sesuai kartu identitas Anda
        </span>
      </div>
      <div className="mb-8 flex flex-col gap-4">
        {/* Nationality Radio Input Group */}
        <div className="flex flex-col gap-2">
          <legend>Status Kewarganegaraan</legend>
          <fieldset className="flex flex-row gap-3">
            <div className="flex-1">
              <NationalityRadioItem
                uncheckedIconPath="/assets/images/flag-icon-neutral-200-w20-h20.svg"
                checkedIconPath="/assets/images/flag-icon-primary-w20-h20.svg"
                title="WNI"
                description="Warga Negara Indonesia"
              />
            </div>
            <div className="flex-1">
              <NationalityRadioItem
                uncheckedIconPath="/assets/images/globe-icon-neutral-200-w20-h20.svg"
                checkedIconPath="/assets/images/globe-icon-primary-w20-h20.svg"
                title="WNA"
                description="Warga Negara Asing"
              />
            </div>
          </fieldset>
        </div>

        {/*  Full Name Input */}
        <TextInput label="Nama Lengkap" type="text" placeholder="Masukan nama lengkap Anda" />

        {/*  Identity Number Input */}
        <TextInput label="Nomor Identitas / Nomor KTP" type="text" placeholder="Masukan nomor identitas Anda" />

        {/* Occupation Input */}
        <SelectInput
          label="Pekerjaan"
          options={[{ label: "Pegawai Swasta", value: "PRIVATE_EMPLOYEE" }]}
          placeholder="Pilih pekerjaan Anda"
        />

        {/*  Place of Birth Input */}
        <TextInput label="Tempat Lahir" type="text" placeholder="Masukan tempat lahir Anda" />

        {/*  Date of Birth Input */}
        <div className="flex flex-col gap-2">
          <span className="text-base">Tanggal Lahir</span>
          <div className="flex flex-row gap-2">
            <div className="flex-1">
              <SelectInput options={[]} placeholder="Tanggal" noLabel />
            </div>
            <div className="flex-1">
              <SelectInput options={[]} placeholder="Bulan" noLabel />
            </div>
            <div className="flex-1">
              <SelectInput options={[]} placeholder="Tahun" noLabel />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
