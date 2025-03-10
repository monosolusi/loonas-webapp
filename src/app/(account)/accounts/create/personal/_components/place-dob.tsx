import React from "react";
import { Label } from "@/app/(account)/accounts/create/personal/_components/label";
import { DateTime } from "luxon";
import { Select } from "@/app/(account)/accounts/create/personal/_components/select";

export function PlaceDateOfBirth() {
  return (
    <>
      <div className="sm:col-span-full grid grid-cols-6">
        <div className="sm:col-span-4">
          <Label
            htmlFor="place-of-birth"
            title="Tempat Lahir"
            description="Tuliskan tempat lahirmu sama persis seperti di kartu identitas, ya."
          />
          <div className="mt-2">
            <input
              id="place-of-birth"
              name="place-of-birth"
              type="text"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-default sm:text-sm/6"
            />
          </div>
        </div>
      </div>
      <div className="sm:col-span-full">
        <Label
          title="Tanggal Lahir"
          description="Berikutnya, tolong isi tanggal lahirmu."
        />
        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-start-1">
            <Select
              id="day"
              data={Array.from({ length: 31 }, (_, i) => {
                const day = String(i + 1).padStart(2, "0");
                return { value: (i + 1).toString(), label: day };
              })}
            />
          </div>

          <div className="col-start-2 col-span-2 grid grid-cols-1">
            <Select
              id="month"
              data={[
                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember"
              ].map((month, index) => {
                const monthIndex = index + 1;
                return { value: monthIndex.toString(), label: month };
              })}
            />
          </div>

          <div className="col-start-4 grid grid-cols-1">
            <Select
              id="year"
              data={(() => {
                const currentYear = DateTime.now().year;

                // Batas usia: minimal 17 tahun, maksimal 90 tahun
                const maxAllowedYear = currentYear - 17;
                const minAllowedYear = currentYear - 90;

                // Buat array tahun dari 1935 sampai 2008 (boleh diurut ascending atau descending)
                const years = [];
                for (let y = minAllowedYear; y <= maxAllowedYear; y++) {
                  years.push(y);
                }

                // Return pilihan tahun
                return years.map((year) => {
                  return { value: year.toString(), label: year.toString() };
                });
              })()}
            />
          </div>
        </div>
      </div>
    </>
  );
}