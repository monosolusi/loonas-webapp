import React from "react";
import Image from "next/image";

interface LogoImageProps {
  className?: string;
}

export function LogoImage(props: LogoImageProps) {
  return (
    <Image src="/assets/images/logo-w165-h48.png" alt="Logo" className={props.className} width={165} height={48} />
  );
}
