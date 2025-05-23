import { PageContent } from "@/core/presentations/components/page-content";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { BuildingOffice2Icon, DocumentIcon } from "@heroicons/react/24/outline";


const secondaryNavigation = [
  { name: "Detail", href: "#", icon: BuildingOffice2Icon, current: true },
  { name: "Faktur", href: "#", icon: DocumentIcon, current: false }
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ClientDetailPage() {
  return (
    <>
      <PageHeading>PT. Mono Solusi Indonesia</PageHeading>
      <PageContent>
        <div className="flex flex-row mx-auto max-w-7xl">
          <aside
            className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0">
            <nav className="flex-none px-4 sm:px-6 lg:px-0">
              <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-100  text-primary-default"
                          : "text-gray-700 hover:bg-gray-100 hover:text-primary-default",
                        "group flex gap-x-3 rounded-md py-2 pr-3 pl-2 text-sm/6 font-semibold"
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={classNames(
                          item.current ? "text-primary-default" : "text-gray-400 group-hover:text-primary-default",
                          "size-6 shrink-0"
                        )}
                      />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="flex px-4 sm:px-6 lg:flex-auto py-4">
            <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
              <div>
                <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
                <p className="mt-1 text-sm/6 text-gray-500">
                  This information will be displayed publicly so be careful what you share.
                </p>

                <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
                  <div className="py-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">Tom Cook</div>
                      <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Update
                      </button>
                    </dd>
                  </div>
                  <div className="py-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">tom.cook@example.com</div>
                      <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Update
                      </button>
                    </dd>
                  </div>
                  <div className="py-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Title</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">Human Resources Manager</div>
                      <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Update
                      </button>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </main>
        </div>
      </PageContent>
    </>
  );
}
