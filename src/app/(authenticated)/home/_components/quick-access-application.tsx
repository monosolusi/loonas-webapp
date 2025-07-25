import { ApplicationItem } from "@/app/(authenticated)/home/_components/application-item";
import { HelloName } from "@/app/(authenticated)/home/_components/hello-name";

export function QuickAccessApplication() {
  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-row items-end pb-4 sm:pb-6">
        <div className="flex-1 flex-col flex-wrap space-y-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div className="mb-8">
            <HelloName />
          </div>
          <div className="flex flex-1 flex-row space-x-4">
            <ApplicationItem
              title="Buat Faktur Masukan"
              description="Unggah atau salin tagihan supplier, langsung bayar di Loonas."
              icon={{
                alt: "create incoming invoice",
                src: "https://res.cloudinary.com/monosolusi/image/upload/v1753356981/loonas/web-assets/new_incoice_icon.svg",
              }}
              route={{ path: "/invoices/incoming/create" }}
              className="flex-1"
            />

            <ApplicationItem
              title="Buat Faktur Keluaran"
              description="Kamu sebagai penjual? Pilih ini untuk kirim tagihan ke pelanggan."
              icon={{
                alt: "create outgoing invoice",
                src: "https://res.cloudinary.com/monosolusi/image/upload/v1753358097/loonas/web-assets/new_outgoing_invoice.svg",
              }}
              route={{ path: "/invoices/outgoing/create" }}
              className="flex-1"
            />
            <ApplicationItem
              title="Kelola Inventori"
              description="Kelola inventori secara real-time agar stok selalu terkendali dan bisnis tetap lancar."
              icon={{
                alt: "manage inventory",
                src: "https://res.cloudinary.com/monosolusi/image/upload/v1753360190/loonas/web-assets/manage_inventory.svg",
              }}
              route={{ path: "/inventories" }}
              className="flex-1"
            />
          </div>
        </div>
      </header>
    </div>
  );
}
