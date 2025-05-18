"use client";

import {PaymentRequestStatus} from "@/features/payment/domain/enums/payment-request";
import {DateTime} from "luxon";
import {InvoiceRow, InvoiceTable} from "@/app/(authenticated)/invoices/_components/invoice-table";
import {InvoiceType} from "@/features/invoice/domain/invoice-type";

const DUMMY_DATA: InvoiceRow[] = [
  // 2024-06 (2)
  {
    type: InvoiceType.INCOMING,
    receiverName: "PT Nusantara",
    bankAccount: {
      bankName: "BCA",
      accountNumber: "1234567890",
      accountHolderName: "Budi Santoso"
    },
    total: 1000000,
    status: PaymentRequestStatus.PENDING_PAYMENT,
    paymentMethod: "VA",
    createdAt: DateTime.fromISO("2024-06-01T08:07:00+07:00")
  },
  {
    type: InvoiceType.OUTGOING,
    receiverName: "CV Maju Jaya",
    bankAccount: {
      bankName: "Mandiri",
      accountNumber: "9876543210",
      accountHolderName: "Ani Wijaya"
    },
    total: 2500000,
    status: PaymentRequestStatus.COMPLETED,
    paymentMethod: "QRIS",
    createdAt: DateTime.fromISO("2024-06-02T14:12:00+07:00")
  },

  // 2025-04 (7)
  {
    type: InvoiceType.INCOMING,
    receiverName: "PT Sumber Rezeki",
    bankAccount: {
      bankName: "BRI",
      accountNumber: "3102992387",
      accountHolderName: "Rahmat Hidayat"
    },
    total: 4200000,
    status: PaymentRequestStatus.EXPIRED,
    paymentMethod: "VA",
    createdAt: DateTime.fromISO("2025-04-02T10:30:00+07:00")
  },
  {
    type: InvoiceType.OUTGOING,
    receiverName: "UD Sinar Mulia",
    bankAccount: {
      bankName: "BCA",
      accountNumber: "2321983765",
      accountHolderName: "Lina Pratiwi"
    },
    total: 3798000,
    status: PaymentRequestStatus.COMPLETED,
    paymentMethod: "CC",
    createdAt: DateTime.fromISO("2025-04-05T12:30:00+07:00")
  },
  {
    type: InvoiceType.INCOMING,
    receiverName: "CV Artha Mandiri",
    bankAccount: {
      bankName: "Mandiri",
      accountNumber: "5628934710",
      accountHolderName: "Sigit Prabowo"
    },
    total: 1700000,
    status: PaymentRequestStatus.PENDING_PAYMENT,
    paymentMethod: "QRIS",
    createdAt: DateTime.fromISO("2025-04-10T08:00:00+07:00")
  },
  {
    type: InvoiceType.OUTGOING,
    receiverName: "PT Sejahtera Abadi",
    bankAccount: {
      bankName: "BTN",
      accountNumber: "3030310001",
      accountHolderName: "Dewi Sari"
    },
    total: 5870000,
    status: PaymentRequestStatus.CANCELLED,
    paymentMethod: "VA",
    createdAt: DateTime.fromISO("2025-04-13T16:00:00+07:00")
  },
  {
    type: InvoiceType.INCOMING,
    receiverName: "UD Mekar Jaya",
    bankAccount: {
      bankName: "CIMB Niaga",
      accountNumber: "1122334455",
      accountHolderName: "Syarifudin"
    },
    total: 600000,
    status: PaymentRequestStatus.PENDING_INVOICE,
    paymentMethod: "CC",
    createdAt: DateTime.fromISO("2025-04-17T11:15:00+07:00")
  },
  {
    type: InvoiceType.OUTGOING,
    receiverName: "PT Indo Prima",
    bankAccount: {
      bankName: "Permata",
      accountNumber: "7755664422",
      accountHolderName: "Wulan Ayu"
    },
    total: 850000,
    status: PaymentRequestStatus.PAYMENT_RECEIVED_PENDING_DELIVERY,
    paymentMethod: "QRIS",
    createdAt: DateTime.fromISO("2025-04-20T09:45:00+07:00")
  },
  {
    type: InvoiceType.OUTGOING,
    receiverName: "PT Maju Selalu",
    bankAccount: {
      bankName: "BCA",
      accountNumber: "3278902345",
      accountHolderName: "Hendra Susanto"
    },
    total: 1500000,
    status: PaymentRequestStatus.FAILED,
    paymentMethod: "CC",
    createdAt: DateTime.fromISO("2025-04-24T15:50:00+07:00"),
  }
];

export function InvoiceTableImpl() {
  return (
    <InvoiceTable
      data={DUMMY_DATA}
    />
  );
}
