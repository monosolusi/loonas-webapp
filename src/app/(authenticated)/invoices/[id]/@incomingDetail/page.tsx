import { BackButton } from "@/core/presentations/components/back-button";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { PageContent } from "@/core/presentations/components/page-content";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import { InvoiceSummaryImpl } from "@/app/(authenticated)/invoices/[id]/@incomingDetail/_components/invoice-summary-impl";
import { PaymentDetail } from "@/app/(authenticated)/invoices/_components/payment-detail";
import { Card } from "@/core/presentations/components/card";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { Timeline } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/timeline";
import { BanknotesIcon, ClockIcon, CreditCardIcon } from "@heroicons/react/20/solid";
import { TableContainer } from "@/core/presentations/components/table-container";
import { Table } from "@/core/presentations/components/table";
import { TableHeader } from "@/core/presentations/components/table-header";
import { TableBody } from "@/core/presentations/components/table-body";

export default function IncomingInvoiceDetailPage() {
  return (
    <PageContent>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-1 flex-row justify-between space-x-4">
          <div className="flex">
            <BackButton />
          </div>
          <div className="flex self-end">
            <FilledButton>Lihat Status</FilledButton>
          </div>
        </div>
        <div className="flex-1">
          <InvoiceSummaryImpl />
        </div>
        <div className="flex flex-1 flex-row space-x-4">
          <div className="flex-2">
            <TableContainer>
              <Table>
                <TableHeader
                  items={[
                    { node: "Dokumen", hideOnMobile: false },
                    { node: "Tanggal Faktur", hideOnMobile: true },
                    { node: "Tanggal Jatuh Tempo", hideOnMobile: true },
                    { node: "Jumlah", hideOnMobile: true },
                  ]}
                />
                <TableBody
                  items={[
                    {
                      row: [
                        {
                          node: (
                            <div className="flex flex-col space-y-1">
                              <div className="text-xs text-gray-500">INV/2025/06/001</div>
                              <div className="font-semibold text-gray-900">
                                <div className="max-w-[220px] overflow-hidden overflow-ellipsis">
                                  Dokumen Faktur Pertama.pdf
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                <div className="max-w-[220px] overflow-hidden overflow-ellipsis">
                                  Catatan untuk dokumen ini
                                </div>
                              </div>
                            </div>
                          ),
                          hideOnMobile: false,
                        },
                        {
                          node: DateTime.now().setLocale("id-id").toLocaleString(DateTime.DATE_FULL),
                          hideOnMobile: true,
                        },
                        {
                          node: DateTime.now().plus({ days: 30 }).setLocale("id-id").toLocaleString(DateTime.DATE_FULL),
                          hideOnMobile: true,
                        },
                        {
                          node: IDRFormatter.toCurrency(100000),
                          hideOnMobile: true,
                        },
                      ],
                    },
                    {
                      row: [
                        {
                          node: (
                            <div className="flex flex-col space-y-1">
                              <div className="text-xs text-gray-500">INV/2025/06/001</div>
                              <div className="font-semibold text-gray-900">
                                <div className="max-w-[220px] overflow-hidden overflow-ellipsis">
                                  Dokumen Faktur Kedua Cukup Panjang.pdf
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                <div className="max-w-[220px] overflow-hidden overflow-ellipsis">
                                  Catatan untuk dokumen ini yang cukup panjang sekali
                                </div>
                              </div>
                            </div>
                          ),
                          hideOnMobile: false,
                        },
                        {
                          node: DateTime.now().setLocale("id-id").toLocaleString(DateTime.DATE_FULL),
                          hideOnMobile: true,
                        },
                        {
                          node: DateTime.now().plus({ days: 30 }).setLocale("id-id").toLocaleString(DateTime.DATE_FULL),
                          hideOnMobile: true,
                        },
                        {
                          node: IDRFormatter.toCurrency(100000),
                          hideOnMobile: true,
                        },
                      ],
                    },
                  ]}
                />
              </Table>
            </TableContainer>
          </div>
          <div className="flex flex-1 flex-col space-y-4">
            <div className="flex-1">
              <Timeline
                currentStatus={PaymentRequestStatus.COMPLETED}
                override={{ title: <h3 className="mb-4 text-lg font-semibold">Status Transaksis</h3> }}
                items={[
                  {
                    id: 1,
                    content: "Silakan lakukan pembayaran, kami siap memprosesnya.",
                    status: PaymentRequestStatus.PENDING_PAYMENT,
                    icon: ClockIcon,
                    iconBackground: "bg-yellow-400",
                  },
                  {
                    id: 2,
                    content: "Terima kasih! Pembayaran masuk, faktur kamu sedang kami urus.",
                    status: PaymentRequestStatus.PAYMENT_RECEIVED_PENDING_DELIVERY,
                    icon: CreditCardIcon,
                    iconBackground: "bg-yellow-500",
                  },
                  {
                    id: 4,
                    content: "Dana kamu sukses diteruskan ke bank penerima, sekarang tinggal proses di pihak mereka.",
                    status: PaymentRequestStatus.COMPLETED,
                    icon: BanknotesIcon,
                    iconBackground: "bg-green-500",
                  },
                ]}
              />
            </div>
            <div className="flex flex-col">
              <Card>
                <div className="flex flex-col">
                  <div className="mb-4 text-lg font-semibold">Petunjuk Pembayaran</div>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-600">Metode Pembayaran</div>
                      <div className="font-bold">Credit Card</div>
                    </div>
                    <div className="flex-1">
                      <FilledButton>Lakukan Pembayaran</FilledButton>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <Card>
              <div className="flex flex-col">
                <div className="mb-4 text-lg font-semibold">Petunjuk Pembayaran</div>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-600">Metode Pembayaran</div>
                    <div className="font-bold">BRI Virtual Account</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-600">Nomor Virtual Account</div>
                    <div className="font-bold">1234567890</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-600">Nominal Pembayaran</div>
                    <div className="font-bold">{IDRFormatter.toCurrency(100000)}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-600">Bayar Sebelum</div>
                    <div className="font-bold">{DateTime.now().plus({ days: 1 }).toFormat("dd LLLL yyyy hh:mm")}</div>
                  </div>
                  <div className="flex-1">
                    <FilledButton>Sudah Bayar</FilledButton>
                  </div>
                </div>
              </div>
            </Card>
            <PaymentDetail
              invoiceId={uuid()}
              receiverName="Frans Siswanto"
              bankName="Bank Mandiri"
              accountNumber="1234567890"
              accountHolderName="Frans Siswanto"
              total={10000}
              fee={500}
              totalPayment={10500}
              showActions={false}
            />
          </div>
        </div>
      </div>
    </PageContent>
  );
}
