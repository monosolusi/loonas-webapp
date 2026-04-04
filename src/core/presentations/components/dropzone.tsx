"use client";

import { useRef, useState } from "react";
import clsx from "clsx";

type DropzoneProps = {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFiles: (files: File[]) => void;
  onError?: (message: string) => void;
  children: React.ReactNode;
};

export function Dropzone({ accept, multiple = false, maxSize, onFiles, onError, children }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const valid: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (maxSize && file.size > maxSize) {
        onError?.(`File terlalu besar. Maksimal ${(maxSize / (1024 * 1024)).toFixed(0)}MB`);
        continue;
      }
      valid.push(file);
    }

    if (valid.length > 0) onFiles(valid);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
      className={clsx(
        "flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-6 transition-colors",
        isDragging ? "border-primary-300 bg-primary-300/5" : "border-neutral-200 bg-neutral-50 hover:border-neutral-300",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => { processFiles(e.target.files); e.target.value = ""; }}
        className="hidden"
      />
      {children}
    </div>
  );
}
