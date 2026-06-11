/**
 * Currency formatting utilities for the application.
 * This module provides functions for formatting and parsing currency values.
 */

export class IDRFormatter {
  /**
   * Formats a number or string value as Indonesian Rupiah (IDR) currency.
   * @param value - The number or string value to format
   * @param options - Optional configuration for the formatter
   * @returns Formatted currency string
   */
  public static toCurrency(
    value: number | string,
    options: {
      minimumFractionDigits?: number;
      maximumFractionDigits?: number;
    } = {},
  ): string {
    // If value is a string, try to parse it as a number
    const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;

    // Return empty string if value is not a valid number
    if (isNaN(numericValue)) return "";

    // Format as currency
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: options.minimumFractionDigits ?? 0,
      maximumFractionDigits: options.maximumFractionDigits ?? 0,
    });

    return formatter.format(numericValue);
  }

  public static toThousand(value: number): string {
    return value.toLocaleString("id-ID", { style: "decimal" });
  }

  /**
   * Parses a formatted currency string back to a number.
   * @param value - The formatted currency string to parse
   * @returns The parsed number value
   */
  public static toNumber(value: string): number {
    // Remove currency symbol, dots, and other non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue ? parseInt(numericValue) : 0;
  }
}
