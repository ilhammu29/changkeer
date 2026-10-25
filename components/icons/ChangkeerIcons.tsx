import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * Artisanal Tea Cup with delicate rising steam
 */
export function TeaCupIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z" />
      <path d="M17 10h2.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M3 21h15" />
      <path d="M8 3c0 1.5 1 2.5 1 3.5" />
      <path d="M12 2.5c0 1.5 1 2.5 1 3.5" />
    </svg>
  );
}

/**
 * Pure Herbal Tea Leaf with delicate central vein
 */
export function TeaLeafIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M12 2C6.5 4.5 4 10 4 15.5c0 4 3 6.5 8 6.5s8-2.5 8-6.5C20 10 17.5 4.5 12 2z" />
      <path d="M12 22V6" />
      <path d="M12 11l4-2.5" />
      <path d="M12 15l-3.5-2" />
    </svg>
  );
}

/**
 * Hot Steep Vapor Waves
 */
export function WarmVaporIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M8 6c0 3-2 4-2 7a4 4 0 0 0 8 0c0-3-2-4-2-7" />
      <path d="M15 4c0 2.5-1.5 3.5-1.5 6a3 3 0 0 0 6 0c0-2.5-1.5-3.5-1.5-6" />
      <path d="M4 21h16" />
    </svg>
  );
}

/**
 * Geometric Cold Brew Ice Cube
 */
export function IceCrystalIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 3v9l8 4.5" />
      <path d="M12 12L4 7.5" />
    </svg>
  );
}

/**
 * Precision QRIS Scan Target Frame
 */
export function QRISScanIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      {/* Top Left Corner */}
      <path d="M3 8V5a2 2 0 0 1 2-2h3" />
      {/* Top Right Corner */}
      <path d="M16 3h3a2 2 0 0 1 2 2v3" />
      {/* Bottom Right Corner */}
      <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
      {/* Bottom Left Corner */}
      <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
      {/* Inner Mini QR Matrix points */}
      <rect x="7" y="7" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="14" y="7" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="7" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Brew Bar Cashier Register / POS
 */
export function CashierCounterIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <rect x="3" y="13" width="18" height="8" rx="2" />
      <path d="M6 13V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7" />
      <path d="M8 9h8" />
      <circle cx="9" cy="17" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Architectural Bank Pillar / Vault
 */
export function BankVaultIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M3 21h18" />
      <path d="M4 18h16" />
      <path d="M12 3l9 5H3l9-5z" />
      <path d="M6 10v6" />
      <path d="M10 10v6" />
      <path d="M14 10v6" />
      <path d="M18 10v6" />
    </svg>
  );
}

/**
 * Smooth Shield with embedded verification checkmark
 */
export function SecureShieldIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M12 3s7 2 7 8c0 6-7 10-7 10S5 17 5 11c0-6 7-8 7-8z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/**
 * Artisanal Brew Timer Clock
 */
export function BrewClockIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

/**
 * Clean Crisp Checkmark
 */
export function CheckIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

/**
 * Clean Verified Badge in Circle
 */
export function CheckCircleIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

/**
 * Clean Two-Layer Clipboard Copy
 */
export function CopyClipboardIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

/**
 * Clean Download Arrow into Tray
 */
export function DownloadTrayIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M12 3v11" />
      <path d="M7.5 10.5L12 15l4.5-4.5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

/**
 * Thermal Printer / Receipt
 */
export function ThermalSlipIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M6 9V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v5" />
      <path d="M18 17h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2" />
      <rect x="6" y="14" width="12" height="7" rx="1" />
      <path d="M9 17h6" />
    </svg>
  );
}

/**
 * Artisanal Shopping Tote Bag
 */
export function ToteBagIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M5 8h14l-1.5 13H6.5L5 8z" />
      <path d="M9 11V6a3 3 0 0 1 6 0v5" />
    </svg>
  );
}

/**
 * Cafe Table Dining Mode
 */
export function DiningTableIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M3 10h18" />
      <path d="M12 10v9" />
      <path d="M8 19h8" />
      <path d="M5 6v4" />
      <path d="M19 6v4" />
    </svg>
  );
}

/**
 * Takeaway On-the-Go Cup
 */
export function TakeawayCupIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M6 7l1.5 13a2 2 0 0 0 2 1.8h5a2 2 0 0 0 2-1.8L18 7" />
      <path d="M5 7h14" />
      <path d="M8 7l1-3h6l1 3" />
      <path d="M9 12h6" />
    </svg>
  );
}

/**
 * Courier Delivery Bicycle
 */
export function DeliveryBikeIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6h2l3 6" />
      <path d="M12 17.5V11l3-5" />
      <path d="M5.5 17.5L9.5 11h5.5" />
      <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * WhatsApp Direct Barista Contact
 */
export function WhatsAppIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M12 21a9 9 0 0 1-4.5-1.2L3 21l1.3-4.3A9 9 0 1 1 12 21z" />
      <path d="M9 10a4 4 0 0 0 5 5l1.5-1.5a1 1 0 0 0 0-1.5l-1.5-1.5a1 1 0 0 0-1.5 0L12 11l-1-1 0.5-0.5a1 1 0 0 0 0-1.5L10 6.5a1 1 0 0 0-1.5 0L7 8c-.5.5-.5 1.5.5 3z" />
    </svg>
  );
}

/**
 * Discount Promo Voucher Ticket
 */
export function PromoTicketIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2a2 2 0 0 0 0 4v2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2a2 2 0 0 0 0-4V8z" />
      <path d="M9 9h6" />
      <path d="M9 15h6" />
    </svg>
  );
}

/**
 * Artisanal 4-Point Craft Star
 */
export function CraftStarIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2z" />
    </svg>
  );
}

/**
 * Directional Arrow Right
 */
export function ArrowRightLineIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Directional Arrow Left
 */
export function ArrowLeftLineIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M19 12H5" />
      <path d="M11 18l-6-6 6-6" />
    </svg>
  );
}
