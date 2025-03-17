import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const stats = [
  { name: "Total Faktur Masukan", value: "Rp 0", change: "0%", changeType: "positive" },
  { name: "Total Faktur Keluaran", value: "Rp 0", change: "0%", changeType: "positive" }
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function InvoiceSummary() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Secondary navigation */}
      <header className="pt-6 pb-4 sm:pb-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <h1 className="text-base/7 font-semibold text-gray-900">Arus Kas</h1>
          <Link
            href="/src/app/(authenticated)/invoices/create"
            className="ml-auto flex items-center gap-x-1 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-1.5 size-5" />
            Faktur Baru
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
        <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
          {stats.map((stat, statIdx) => (
            <div
              key={stat.name}
              className={classNames(
                statIdx % 2 === 1 ? "sm:border-l" : statIdx === 2 ? "lg:border-l" : "",
                "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8"
              )}
            >
              <dt className="text-sm/6 font-medium text-gray-500">{stat.name}</dt>
              <dd
                className={classNames(
                  stat.changeType === "negative" ? "text-rose-600" : "text-gray-700",
                  "text-xs font-medium"
                )}
              >
                {stat.change}
              </dd>
              <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Charts Background */}
      <div
        aria-hidden="true"
        className="absolute top-full left-0 -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-mt-10 sm:-ml-96 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50"
      >
        <div
          style={{
            clipPath: "polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)"
          }}
          className="aspect-1154/678 w-[72.125rem] bg-linear-to-br from-[#007bff] to-[#60a5fa]"
        />
      </div>
    </div>
  );
}