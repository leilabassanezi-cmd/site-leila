// TikTok Pixel utility functions

declare global {
  interface Window {
    ttq: {
      identify: (data: Record<string, string>) => void;
      track: (event: string, data?: Record<string, unknown>) => void;
      page: () => void;
    };
  }
}

/** Hashes a string with SHA-256 (required by TikTok for PII data) */
export async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str.toLowerCase().trim())
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const BRAND = "Alabama Brazilian Keratin";
const CURRENCY = "USD";

/** Fire ViewContent — call on page load */
export function trackViewContent() {
  if (!window.ttq) return;
  window.ttq.track("ViewContent", {
    contents: [
      {
        content_id: "hair-services",
        content_type: "product_group",
        content_name: "Brazilian Keratin & Hair Services",
        content_category: "Beauty & Hair",
        brand: BRAND,
      },
    ],
    currency: CURRENCY,
    description: "Luxury hair atelier in Randolph, Alabama",
    status: "available",
  });
}

/** Fire Contact — call when user clicks WhatsApp, phone or email */
export function trackContact(method: string) {
  if (!window.ttq) return;
  window.ttq.track("Contact", {
    contents: [
      {
        content_id: "contact",
        content_type: "product_group",
        content_name: method,
        content_category: "Beauty & Hair",
        brand: BRAND,
      },
    ],
    currency: CURRENCY,
    description: method,
    status: "initiated",
  });
}

/** Fire Lead — call after successful form submission */
export async function trackLead(email: string, phone: string, name: string, services: string) {
  // Server-side Events API (reliable, not blocked by ad blockers)
  fetch("/api/tiktok-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, phone, name, services }),
  }).catch(() => {}); // fire-and-forget

  // Client-side Pixel (browser)
  if (!window.ttq) return;

  const [hashedEmail, hashedPhone] = await Promise.all([
    sha256(email),
    sha256(phone),
  ]);

  window.ttq.identify({
    email: hashedEmail,
    phone_number: hashedPhone,
    external_id: hashedEmail,
  });

  window.ttq.track("Lead", {
    contents: [
      {
        content_id: "inquiry-form",
        content_type: "product_group",
        content_name: services || "Hair Services",
        content_category: "Beauty & Hair",
        brand: BRAND,
      },
    ],
    currency: CURRENCY,
    description: "Website inquiry form submission",
    status: "submitted",
  });
}
