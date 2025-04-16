"use client";

import React from "react";
import { DateTime } from "luxon";
import { useCreatePersonalAccount } from "@/features/account/presentation/providers/create-personal-account";
import { Label } from "../../../../../../core/presentations/components/label";
import { Select } from "./select";

export function PlaceDateOfBirth() {
  const {
    pob,
    dobDay,
    dobMonth,
    dobYear,
    dobError,
    setPob,
    setDobDay,
    setDobMonth,
    setDobYear
  } = useCreatePersonalAccount();

  function handleDobDayChange({ value, label }: { value: string, label: string }) {
    setDobDay?.(value);
  }

  function handleDobMonthChange({ value, label }: { value: string, label: string }) {
    setDobMonth?.(value);
  }

  function handleDobYearChange({ value, label }: { value: string, label: string }) {
    setDobYear?.(value);
  }

  function handlePobChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPob?.(e.target.value.slice(0, 255));
  }

  return (
    <>
      <div className="sm:col-span-full grid grid-cols-1 sm:grid-cols-6">
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
              maxLength={255}
              value={pob}
              onChange={handlePobChange}
              required
            />
          </div>
        </div>
      </div>
      <div className="group sm:col-span-full" data-error={dobError}>
        <Label
          title="Tanggal Lahir"
          description="Berikutnya, tolong isi tanggal lahirmu."
        />
        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-start-1">
            <Select
              id="day"
              value={dobDay}
              onChange={handleDobDayChange}
              isError={dobError}
              data={[{ value: "", label: "--" }, ...Array.from({ length: 31 }, (_, i) => {
                const day = String(i + 1).padStart(2, "0");
                return { value: day, label: day };
              })]}
              disableFirstOption
              required
            />
          </div>

          <div className="col-start-2 col-span-2 grid grid-cols-1">
            <Select
              id="month"
              value={dobMonth}
              onChange={handleDobMonthChange}
              isError={dobError}
              data={[{ value: "", label: "--" }, ...[
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
                return { value: monthIndex.toString().padStart(2, "0"), label: month };
              })]}
              disableFirstOption
              required
            />
          </div>

          <div className="col-start-4 grid grid-cols-1">
            <Select
              id="year"
              value={dobYear}
              onChange={handleDobYearChange}
              isError={dobError}
              data={[{ value: "", label: "--" }, ...(() => {
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
                return years.reverse().map((year) => {
                  return { value: year.toString(), label: year.toString() };
                });
              })()]}
              disableFirstOption
              required
            />
          </div>
        </div>
        <div className="hidden group-data-[error=true]:block mt-2">
          <span className="text-red-400 text-sm/6">
            Sepertinya tanggal yang kamu masukkan kurang tepat. Coba dicek lagi, ya?
          </span>
        </div>
      </div>
    </>
  );
}