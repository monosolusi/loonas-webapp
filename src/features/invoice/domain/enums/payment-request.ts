export enum PaymentRequestStatus {
  PENDING_INVOICE = "PENDING_INVOICE", // Menunggu upload invoice
  PENDING_PAYMENT = "PENDING_PAYMENT", // Invoice sudah diupload, menunggu pembayaran
  PAYMENT_RECEIVED_PENDING_DELIVERY = "PAYMENT_RECEIVED_PENDING_DELIVERY", // Dana telah diterima oleh Loonas dan menanti untuk dikirim ke penerima akhir
  COMPLETED = "COMPLETED",             // Pembayaran selesai dan dana telah ditransfer
  EXPIRED = "EXPIRED",                 // Waktu pembayaran telah habis
  FAILED = "FAILED",                   // Pembayaran gagal karena alasan teknis
  CANCELLED = "CANCELLED"              // Pembayaran dibatalkan oleh pengguna
}