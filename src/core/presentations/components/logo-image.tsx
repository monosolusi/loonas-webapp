import clsx from "clsx";
import React from "react";

interface LogoImageProps {
  className?: string;
}

export function LogoImage(props: LogoImageProps) {
  return (
    <img
      src="https://res.cloudinary.com/monosolusi/image/upload/v1740993366/loonas/web-assets/loonas-logo_rspb5c.svg"
      alt="Logo"
      className={clsx("h-10 w-auto", props.className)}
    />
  );
}
