import React from "react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "Apa itu Faktur Masukan?",
    answer: "Faktur Masukan adalah tagihan yang kamu terima dari supplier atau vendor. Ini membantu kamu mencatat dan mengelola biaya yang harus dibayar kepada pihak lain. Kamu bisa mengunggah foto faktur atau memasukkan detail tagihan secara manual ke dalam sistem Loonas."
  },
  {
    question: "Apa itu Faktur Keluaran?",
    answer: "Faktur Keluaran adalah tagihan yang kamu buat sebagai penjual untuk dikirimkan kepada pelanggan. Ini merupakan dokumen yang mencatat penjualan produk atau jasa yang telah kamu lakukan."
  },
  {
    question: "Apa perbedaan utama antara Faktur Masukan dan Faktur Keluaran?",
    answer: "Faktur Masukan adalah tagihan yang kamu terima dari supplier (pembelian), sedangkan Faktur Keluaran adalah tagihan yang kamu buat untuk pelanggan (penjualan). Keduanya membantu kamu melacak aliran keuangan bisnis dari sisi berbeda."
  },
  {
    question: "Bagaimana cara membuat Faktur Masukan?",
    answer: "Untuk membuat Faktur Masukan, pilih opsi 'Faktur Masukan' di halaman utama. Kamu bisa mengunggah foto faktur atau memasukkan detail tagihan secara manual. Pastikan semua informasi pembayaran supplier tercatat dengan lengkap."
  },
  {
    question: "Apakah Faktur Keluaran selalu aktif?",
    answer: "Saat ini, fitur Faktur Keluaran sedang dalam tahap pengembangan. Untuk sementara, opsi ini tidak dapat digunakan (disabled) di dalam sistem."
  },
  {
    question: "Apa saja informasi penting yang harus ada di faktur?",
    answer: "Untuk Faktur Masukan, pastikan kamu mencatat detail seperti nama supplier, tanggal tagihan, jumlah pembayaran, deskripsi barang/jasa, dan informasi pembayaran lainnya. Semakin lengkap, semakin memudahkan pengelolaan keuanganmu."
  },
  {
    question: "Mengapa saya perlu membuat Faktur Masukan?",
    answer: "Membuat Faktur Masukan membantu kamu melacak pengeluaran bisnis, mempermudah pembukuan, dan memiliki catatan resmi untuk setiap pembayaran kepada supplier. Ini penting untuk manajemen keuangan yang baik."
  }
];


export function CreateInvoiceQuestions() {
  return (
    <div className="mx-auto">
      <h2 className="text-lg font-semibold tracking-tight text-neutral-500">
        FAQ (Frequently Asked Questions)
      </h2>
      <dl className="mt-8 divide-y divide-neutral-500/10">
        {faqs.map((faq) => (
          <Disclosure key={faq.question} as="div" className="py-6 first:pt-0 last:pb-0">
            <dt>
              <DisclosureButton className="group flex w-full items-start justify-between text-left text-neutral-500">
                <span className="text-base/7 font-semibold">{faq.question}</span>
                <span className="ml-6 flex h-7 items-center">
                <PlusIcon aria-hidden="true" className="size-6 group-data-open:hidden" />
                <MinusIcon aira-hidden="true" className="size-6 group-not-data-open:hidden" />
              </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel as="dd" className="mt-2  pr-12">
              <p className="text-base/7 text-neutral-400">{faq.answer}</p>
            </DisclosurePanel>
          </Disclosure>
        ))}
      </dl>
    </div>
  );
}