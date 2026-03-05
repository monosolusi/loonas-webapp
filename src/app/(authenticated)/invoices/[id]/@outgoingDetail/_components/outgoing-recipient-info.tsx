"use client";

interface OutgoingRecipientInfoProps {
  name: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

export function OutgoingRecipientInfo({ name, email, phoneNumber, address }: OutgoingRecipientInfoProps) {
  return (
    <div className="flex flex-col gap-y-5">
      {/* Contact Info */}
      <div className="flex flex-col gap-y-1">
        <span className="text-sm leading-5 font-semibold">{name}</span>
        <div className="flex flex-col gap-y-1.5 text-xs leading-4 text-neutral-200">
          {email && <span>{email}</span>}
          {phoneNumber && <span>{phoneNumber}</span>}
        </div>
      </div>

      {/* Address */}
      {address && (
        <>
          <hr className="border-neutral-100" />
          <div className="flex flex-col gap-y-0.5">
            <span className="text-xs leading-4 text-neutral-200">Alamat</span>
            <span className="text-sm leading-5">{address}</span>
          </div>
        </>
      )}
    </div>
  );
}
