export function CreditCardFullRedirectPayInDetail() {
  return (
    <div>
      <iframe
        src="https://sandbox.doku.com/wt-frontend-transaction/dynamic-payment-page?signature=HMACSHA256%3DIFbbu4gJkzlLhnfiBXCeyAE0hMJMqQZelPagBA%2BQez4%3D&clientId=BRN-0271-1747612485660&invoiceNumber=9fd68cb8-9f41-4ca6-82e9-d1b9e277e00d&requestId=a1a0f6f4-3d4e-48df-974f-476164e6c14a&backgroundColor=fcfcfc&fontColor=171717&buttonBackgroundColor=0050ac&buttonFontColor=f5f5f5&transactionType=S"
        className="min-h-[500px] w-full"
        allowFullScreen
      />
    </div>
  );
}
