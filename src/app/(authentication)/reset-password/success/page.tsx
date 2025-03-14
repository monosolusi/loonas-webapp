import Link from "next/link";

export default function ResetPasswordSuccessPage() {
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          alt="Loonas"
          src="https://res.cloudinary.com/monosolusi/image/upload/v1740993366/loonas/web-assets/loonas-logo_rspb5c.svg"
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sukses Reset Password! Langsung Cek Email Kamu, ya!
        </h2>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
            <div className="space-y-6">
              <p>Permintaan reset password berhasil! Sekarang tinggal buka email kamu aja buat langkah selanjutnya,
                gampang kok.</p>
              <Link
                href="/sign-in"
                className="inline-flex w-full justify-center rounded-md bg-primary-default px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-default disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
              >
                Kembali ke Halaman Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}