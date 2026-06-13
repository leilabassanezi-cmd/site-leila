import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

const PIXEL_ID = "D8MNQ9JC77U12CTGU5T0";
const ACCESS_TOKEN = process.env.TIKTOK_API_TOKEN!;

function sha256(value: string) {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, phone, name, services } = req.body ?? {};

  const event = {
    pixel_code: PIXEL_ID,
    event: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    user: {
      email: email ? sha256(email) : undefined,
      phone_number: phone ? sha256(phone) : undefined,
      external_id: email ? sha256(email) : undefined,
    },
    properties: {
      content_name: services || "Hair Services",
      content_category: "Beauty & Hair",
      content_type: "product_group",
      currency: "USD",
      description: `Inquiry from ${name}`,
      status: "submitted",
    },
  };

  try {
    const ttRes = await fetch(
      `https://business-api.tiktok.com/open_api/v1.3/pixel/track/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": ACCESS_TOKEN,
        },
        body: JSON.stringify({ data: [event] }),
      }
    );
    const data = await ttRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("TikTok Events API error:", err);
    return res.status(500).json({ error: "Failed to send event" });
  }
}
