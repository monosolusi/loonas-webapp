import React from "react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "Apakah data akun lama akan hilang?",
    answer: "Kamu dapat memiliki lebih dari satu akun bisnis maupun akun personal dalam satu platform. Setiap akun akan tetap tersimpan dan dapat diakses kapan saja sesuai kebutuhanmu. Jika kamu membuat akun baru, akun lama tetap aman dan tidak terhapus. Kamu bisa berpindah antar akun dengan mudah tanpa kehilangan data transaksi, informasi klien, atau riwayat pembayaran yang sudah tercatat sebelumnya."
  },
  {
    question: "Apakah proses KYC wajib untuk semua akun?",
    answer: "Ya, proses KYC (Know Your Customer) wajib untuk akun bisnis dan akun personal. Ini bertujuan untuk memastikan keamanan transaksi dan kepatuhan terhadap regulasi keuangan. Prosesnya melibatkan verifikasi identitas dengan dokumen resmi."
  },
  {
    question: "Bagaimana proses KYC untuk akun lama dan baru?",
    answer: "Proses KYC hanya perlu dilakukan untuk akun baru yang kamu buat. Jika kamu sudah memiliki akun lama yang telah terverifikasi, kamu tidak perlu melewati proses KYC lagi untuk akun tersebut. \n\nSetiap kali kamu membuat akun baru, kami akan melakukan verifikasi sesuai prosedur untuk memastikan keamanan transaksi. Namun, akun lama yang sudah lolos verifikasi sebelumnya tetap dapat digunakan tanpa perlu melalui proses KYC ulang.\n\nPastikan informasi yang kamu berikan saat registrasi sesuai dan valid agar proses KYC dapat berjalan dengan lancar."
  },
  {
    question: "Berapa lama proses verifikasi KYC di Loonas?",
    answer: "Proses verifikasi KYC biasanya memakan waktu antara 1-2 hari kerja. Namun, dalam beberapa kasus, bisa lebih cepat atau memerlukan waktu tambahan jika ada dokumen yang perlu diperiksa lebih lanjut."
  },
  {
    question: "Apakah transaksi di satu akun akan mempengaruhi akun lainnya?",
    answer: "Tidak, setiap akun bersifat independen. Transaksi yang terjadi di satu akun tidak akan mempengaruhi akun lainnya. Data keuangan, klien, dan riwayat pembayaran akan tetap terpisah sesuai dengan akun yang digunakan."
  },
  {
    question: "Bagaimana cara berpindah antar akun?",
    answer: "Kamu bisa berpindah antar akun langsung dari pengaturan profil. Jika kamu memiliki lebih dari satu akun, cukup pilih akun yang ingin digunakan tanpa perlu logout dan login ulang."
  },
  {
    question: "Apakah saya bisa mengubah akun personal menjadi akun bisnis, atau sebaliknya?",
    answer: "Tidak bisa langsung diubah. Jika kamu ingin beralih dari akun personal ke akun bisnis, kamu perlu membuat akun bisnis baru. Begitu juga sebaliknya. Setiap jenis akun memiliki struktur data dan verifikasi yang berbeda."
  }
];


export function CreateAccountQuestions() {
  return (
    <div className="mx-auto">
      <h2 className="text-lg font-semibold tracking-tight text-gray-900">
        FAQ (Frequently Asked Questions)
      </h2>
      <dl className="mt-8 divide-y divide-gray-900/10">
        {faqs.map((faq) => (
          <Disclosure key={faq.question} as="div" className="py-6 first:pt-0 last:pb-0">
            <dt>
              <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                <span className="text-base/7 font-semibold">{faq.question}</span>
                <span className="ml-6 flex h-7 items-center">
                <PlusIcon aria-hidden="true" className="size-6 group-data-open:hidden" />
                <MinusIcon aira-hidden="true" className="size-6 group-not-data-open:hidden" />
              </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel as="dd" className="mt-2  pr-12">
              <p className="text-base/7 text-gray-600">{faq.answer}</p>
            </DisclosurePanel>
          </Disclosure>
        ))}
      </dl>
    </div>
  );
}