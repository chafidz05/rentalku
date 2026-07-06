import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { skipped: true, reason: "DISCORD_WEBHOOK_URL belum diset" },
      { status: 200 }
    );
  }

  try {
    const body = await request.json();
    const { nama, no_hp, tanggal_pinjam, lokasi, mobil_nama } = body as {
      nama: string;
      no_hp: string;
      tanggal_pinjam: string;
      lokasi: string;
      mobil_nama?: string | null;
    };

    const tanggalFormatted = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(tanggal_pinjam));

    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "🚗 Pengajuan Sewa Baru",
            color: 0x1d4ed8,
            fields: [
              { name: "Nama", value: nama || "-", inline: true },
              { name: "No. HP", value: no_hp || "-", inline: true },
              { name: "Mobil", value: mobil_nama || "-", inline: true },
              { name: "Tanggal Pinjam", value: tanggalFormatted, inline: true },
              { nama: "Lokasi", value: lokasi || "-", inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!discordResponse.ok) {
      const errText = await discordResponse.text();
      return NextResponse.json(
        { sent: false, error: errText },
        { status: 502 }
      );
    }

    return NextResponse.json({ sent: true });
  } catch (err) {
    return NextResponse.json(
      { sent: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  };
};