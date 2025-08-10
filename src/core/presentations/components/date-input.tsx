import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextInput, TextInputProps } from "@/core/presentations/components/text-input";
import { DateTime } from "luxon";

type DateInputProps = {
  onChange?: (value: DateTime) => void;
  value?: DateTime;
} & Omit<TextInputProps, "type" | "onChange" | "value">;

const MASK = "__/__/____"; // dd/MM/yyyy
const MAX_DIGITS = 8; // ddMMYYYY
// Index posisi karakter digit di dalam mask (bukan slash)
const DIGIT_SLOTS = [0, 1, 3, 4, 6, 7, 8, 9];
const digitsOnly = (s: string) => s.replace(/\D/g, "");
const applyMask = (digits: string) => {
  const d = digits.padEnd(MAX_DIGITS, "_").slice(0, MAX_DIGITS);
  return `${d[0]}${d[1]}/${d[2]}${d[3]}/${d[4]}${d[5]}${d[6]}${d[7]}`;
};

// Map posisi caret masked -> index digit (0..length)
const maskedCaretToDigitIndex = (maskedCaret: number) => {
  let count = 0;
  for (let i = 0; i < DIGIT_SLOTS.length; i++) {
    if (DIGIT_SLOTS[i] < maskedCaret) count++;
    else break;
  }
  return count;
};

// Map index digit (0..8) -> posisi caret masked
const digitIndexToMaskedCaret = (digitIdx: number) => {
  if (digitIdx <= 0) return 0;
  if (digitIdx >= MAX_DIGITS) return DIGIT_SLOTS[DIGIT_SLOTS.length - 1] + 1;
  return DIGIT_SLOTS[digitIdx] ?? DIGIT_SLOTS[DIGIT_SLOTS.length - 1] + 1;
};

// Selalu hasilkan DateTime (valid/invalid) dari digits saat ini
const toDateTime = (digits: string): DateTime => {
  if (digits.length !== MAX_DIGITS) {
    return DateTime.invalid("incomplete-date");
  }
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return DateTime.fromFormat(`${day}/${month}/${year}`, "dd/LL/yyyy").startOf("day");
};

export function DateInput(props: DateInputProps) {
  const { value, onChange, htmlFor, ...rest } = props;

  const [rawDigits, setRawDigits] = useState<string>("");

  // Sinkronisasi dari value luar: hanya jika valid.
  // Jika invalid, biarkan input mempertahankan apa yang sedang diketik user.
  useEffect(() => {
    if (value?.isValid) {
      setRawDigits(value.toFormat("ddLLyyyy"));
    } else if (value === undefined) {
      // Jika value dihilangkan (undefined), kosongkan input
      setRawDigits("");
    }
  }, [value]);

  const masked = useMemo(() => (rawDigits ? applyMask(rawDigits) : MASK), [rawDigits]);
  const inputEl = useRef<HTMLInputElement | null>(null);

  // Dapatkan elemen input berdasarkan htmlFor atau simpan saat first interaction
  const ensureInputEl = useCallback(() => {
    if (inputEl.current) return inputEl.current;
    if (htmlFor) inputEl.current = document.getElementById(htmlFor) as HTMLInputElement | null;
    return inputEl.current;
  }, [htmlFor]);

  const setCaret = useCallback(
    (digitIdx: number) => {
      const el = ensureInputEl();
      if (!el) return;

      const pos = digitIndexToMaskedCaret(digitIdx);
      requestAnimationFrame(() => {
        try {
          el.setSelectionRange(pos, pos);
        } catch {
          // no-op
        }
      });
    },
    [ensureInputEl],
  );

  // Utility: ambil digit range dari selection masked
  const getDigitSelection = useCallback(() => {
    const el = ensureInputEl();
    const start = el?.selectionStart ?? 0;
    const end = el?.selectionEnd ?? start;
    const dStart = maskedCaretToDigitIndex(start);
    const dEnd = maskedCaretToDigitIndex(end);
    return { dStart, dEnd };
  }, [ensureInputEl]);

  // Selalu emit ke parent (valid/invalid)
  const emit = useCallback(
    (digits: string) => {
      if (!onChange) return;
      onChange(toDateTime(digits));
    },
    [onChange],
  );

  // Helper untuk mengubah digits + emit + set caret
  const applyDigitsEdit = useCallback(
    (nextDigits: string, nextCaretDigitIdx?: number) => {
      setRawDigits(nextDigits);
      emit(nextDigits);
      if (typeof nextCaretDigitIdx === "number") {
        setCaret(Math.min(nextCaretDigitIdx, nextDigits.length));
      }
    },
    [emit, setCaret],
  );

  // Replace selection [dStart..dEnd) dengan textDigits
  const replaceSelection = useCallback(
    (textDigits: string) => {
      const { dStart, dEnd } = getDigitSelection();
      const before = rawDigits.slice(0, dStart);
      const after = rawDigits.slice(dEnd);
      const next = (before + textDigits + after).slice(0, MAX_DIGITS);
      const caret = Math.min(dStart + textDigits.length, next.length);
      applyDigitsEdit(next, caret);
    },
    [getDigitSelection, rawDigits, applyDigitsEdit],
  );

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const key = e.key;

    // Simpan ref element saat interaksi pertama
    if (!inputEl.current) inputEl.current = e.currentTarget;

    const { dStart, dEnd } = getDigitSelection();
    const hasSelection = dStart !== dEnd;
    const isMetaCombo = e.metaKey || e.ctrlKey;

    // Navigasi caret antar slot digit (skip slash)
    const navLeft = () => setCaret(Math.max(dStart - 1, 0));
    const navRight = () => setCaret(Math.min(dEnd + 1, Math.max(rawDigits.length, 0)));

    // Arrow/Home/End: kontrol manual agar melewati slash
    if (key === "ArrowLeft") {
      e.preventDefault();
      navLeft();
      return;
    }
    if (key === "ArrowRight") {
      e.preventDefault();
      navRight();
      return;
    }
    if (key === "Home") {
      e.preventDefault();
      setCaret(0);
      return;
    }
    if (key === "End") {
      e.preventDefault();
      setCaret(rawDigits.length);
      return;
    }

    // Paste ditangani via onPaste; Select all/copy/cut dibiarkan
    if (isMetaCombo && ["a", "c", "x", "v"].includes(key.toLowerCase())) return;

    // Digit input
    if (/^\d$/.test(key)) {
      e.preventDefault();
      if (hasSelection) {
        replaceSelection(key);
      } else {
        // Sisipkan/replace satu digit
        const before = rawDigits.slice(0, dStart);
        const after = rawDigits.slice(dStart + (rawDigits.length >= MAX_DIGITS ? 1 : 0));
        const next = (before + key + after).slice(0, MAX_DIGITS);
        applyDigitsEdit(next, dStart + 1);
      }
      return;
    }

    // Backspace / Delete
    if (key === "Backspace" || key === "Delete") {
      e.preventDefault();
      if (hasSelection) {
        replaceSelection("");
        return;
      }
      // Single delete
      if (key === "Backspace") {
        if (dStart > 0) {
          const delIdx = dStart - 1;
          const next = rawDigits.slice(0, delIdx) + rawDigits.slice(delIdx + 1);
          applyDigitsEdit(next, delIdx);
        } else {
          setCaret(0);
        }
      } else {
        // Delete forward
        if (dStart < rawDigits.length) {
          const next = rawDigits.slice(0, dStart) + rawDigits.slice(dStart + 1);
          applyDigitsEdit(next, dStart);
        } else {
          setCaret(rawDigits.length);
        }
      }
      return;
    }

    // Blokir semua char non-digit (biar mask tetap bersih)
    if (key.length === 1) {
      e.preventDefault();
    }
  };

  const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const pasteDigits = digitsOnly(e.clipboardData.getData("text"));
    if (!pasteDigits) return;
    replaceSelection(pasteDigits);
  };

  // Fallback onChange jika ada perubahan yang lolos (harusnya jarang karena kita preventDefault)
  const handleChange = (text: string) => {
    const nextDigits = digitsOnly(text).slice(0, MAX_DIGITS);
    applyDigitsEdit(nextDigits);
  };

  const handleBlur = () => {
    // Pastikan parent menerima state terakhir (valid/invalid)
    emit(rawDigits);
  };

  return (
    <TextInput
      {...rest}
      htmlFor={htmlFor}
      type="text"
      value={masked}
      placeholder={MASK}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onChange={handleChange}
      onBlur={handleBlur}
      inputMode="numeric"
      autoComplete="off"
      aria-label={rest.title ?? "Tanggal (dd/MM/yyyy)"}
    />
  );
}
