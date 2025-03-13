import React from "react";

const data = [
  {
    label: "Kewarganegaraan",
    value: "Warga Negara Indonesia"
  },
  {
    label: "Nomor Kartu Identitas",
    value: "KTP - 1234567812345678"
  },
  {
    label: "Nama Lengkap",
    value: "Frans Siswanto"
  },
  {
    label: "Pekerjaan",
    value: "Pegawai Swasta"
  },
  {
    label: "Tempat & Tanggal Lahir",
    value: "Surabaya, 01 Januari 2008"
  },
  {
    label: "Alamat",
    value: "Graha Natura AC59, Lontar, Sambikerep, Kota Surabaya, Jawa Timur"
  }
];

export function VerificationData() {
  return (
    <>
      <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">Berkas yang Sudah Dikirim</h2>
            <p className="mt-1 text-sm/6 text-gray-500">
              Ini adalah berkas akun yang sudah kamu kirim. Verifikasi sedang diproses, estimasi selesai pada 15 Maret
              2025. Mohon ditunggu ya!
            </p>

            <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
              {data.map((item) => (
                <VerificationItem key={item.label} title={item.label} description={item.value} />
              ))}
            </dl>
          </div>
        </div>
      </main>
      <div className="flex justify-center">
        <div className="text-gray-400 text-center sm:max-w-lg">
          Berkas yang kamu kirim akan langsung diverifikasi oleh tim Loonas. Saat proses verifikasi berlangsung, data
          tidak bisa diubah. Mohon tunggu hingga waktunya tiba, ya!
        </div>
      </div>
    </>
  );
}

function VerificationItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="py-6 sm:flex">
      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{title}</dt>
      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
        <div className="text-gray-900">{description}</div>
      </dd>
    </div>
  );
}