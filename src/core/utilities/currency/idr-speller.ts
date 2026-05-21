const SATUAN = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"];
const BELASAN = [
  "sepuluh",
  "sebelas",
  "dua belas",
  "tiga belas",
  "empat belas",
  "lima belas",
  "enam belas",
  "tujuh belas",
  "delapan belas",
  "sembilan belas",
];

function spellHundreds(n: number): string {
  if (n === 0) return "";
  if (n < 10) return SATUAN[n];
  if (n < 20) return BELASAN[n - 10];

  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const tensWord = SATUAN[tens] + " puluh";
  return ones === 0 ? tensWord : tensWord + " " + SATUAN[ones];
}

function spellBelow1000(n: number): string {
  if (n === 0) return "";
  if (n < 100) return spellHundreds(n);

  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  const hundredsWord = (hundreds === 1 ? "seratus" : SATUAN[hundreds] + " ratus");
  if (remainder === 0) return hundredsWord;
  return hundredsWord + " " + spellHundreds(remainder);
}

/**
 * Converts a non-negative integer (0–999,999,999) to its Bahasa Indonesia word form.
 * Returns a lowercased string with no "rupiah" suffix — the caller is responsible for appending it.
 *
 * - Non-integers are rounded with Math.round before spelling.
 * - Negative values, values above 999,999,999, non-finite values → return "".
 * - Zero → returns "nol".
 */
export function idrSpeller(value: number): string {
  if (!Number.isFinite(value) || value < 0 || value > 999_999_999) return "";

  const n = Math.round(value);

  if (n === 0) return "nol";

  const jutaan = Math.floor(n / 1_000_000);
  const ribuan = Math.floor((n % 1_000_000) / 1_000);
  const sisa = n % 1_000;

  const parts: string[] = [];

  if (jutaan > 0) {
    parts.push(spellBelow1000(jutaan) + " juta");
  }

  if (ribuan > 0) {
    parts.push(ribuan === 1 ? "seribu" : spellBelow1000(ribuan) + " ribu");
  }

  if (sisa > 0) {
    parts.push(spellBelow1000(sisa));
  }

  return parts.join(" ");
}
