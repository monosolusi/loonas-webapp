"use client";

import { TextInput, TextInputProps } from "@/core/presentations/components/text-input";
import Image from "next/image";
import { useMemo, useState } from "react";

type PasswordInputProps = {
  label?: string;
} & Omit<TextInputProps, "type" | "leftIcon" | "rightIcon" | "label">;

export function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const onVisibilityToggle = () => {
    setIsVisible((prev) => !prev);
  };

  const iconPath = useMemo(() => {
    return isVisible ? "/assets/images/eye-icon-w20-h20.svg" : "/assets/images/eye-closed-icon-w20-h20.svg";
  }, [isVisible]);

  return (
    <TextInput
      {...props}
      label={props.label ?? "Kata Sandi"}
      type={isVisible ? "text" : "password"}
      placeholder={props.placeholder ?? "Masukan kata sandi Anda"}
      leftIcon={<Image src="/assets/images/lock-icon-w20-h20.svg" alt="Lock Icon" width={20} height={20} />}
      rightIcon={<Image src={iconPath} alt="Lock Icon" width={20} height={20} onClick={onVisibilityToggle} />}
    />
  );
}
