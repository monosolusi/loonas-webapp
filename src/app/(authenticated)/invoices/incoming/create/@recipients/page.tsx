import React from "react";
import { FilledButton } from "@/core/presentations/components/filled-button";

const people = [
  { name: "Lindsay Walton", email: "lindsay.walton@example.com", phoneNumber: "+628123456789" }
];

export default function SelectRecipientPage() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Klien</h1>
          <p className="mt-2 text-sm text-gray-700">
            Pilih klien yang ingin kamu lakukan pembayaran, yuk!
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <FilledButton>Buat Klien Baru</FilledButton>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Nama
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    No. Telpon
                  </th>
                  <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                    <span className="sr-only">Pilih</span>
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {people.map((person) => (
                  <tr key={person.email}>
                    <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                      {person.name}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{person.email}</td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{person.phoneNumber}</td>
                    <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                      <a href="#" className="text-primary-default hover:text-primary-900">
                        Pilih<span className="sr-only">, {person.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}