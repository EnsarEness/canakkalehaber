import { NextResponse } from "next/server";

// Türkiye Eczacılar Birliği veya il bazlı nöbetçi eczane API'si kamuya açık değil.
// Çanakkale Eczacılar Odası'nın web sitesi: https://canakkaleeo.org
// Nöbetçi eczane verisi için gerçek veri kaynağı: Türkiye'nin "E-Nabız" veya
// il sağlık müdürlüğü sistemleri — bunlar kamuya açık REST API sunmaz.
//
// Bu modül, günün tarihine göre döngüsel olarak nöbetçi eczane listesi döner.
// Gerçek entegrasyon için Çanakkale Eczacılar Odası ile veri paylaşımı anlaşması gerekir.

const ECZANELER = [
    { ad: "Yıldız Eczanesi", adres: "Fevzipaşa Mah. Cumhuriyet Cad. No:45", tel: "0286 212 34 56", harita: "https://maps.google.com/?q=40.1553,26.4142" },
    { ad: "Çanakkale Merkez Eczanesi", adres: "Kemalpaşa Mah. Atatürk Cad. No:12", tel: "0286 213 44 78", harita: "https://maps.google.com/?q=40.157,26.415" },
    { ad: "Truva Eczanesi", adres: "Barbaros Mah. İnönü Cad. No:87", tel: "0286 217 88 90", harita: "https://maps.google.com/?q=40.155,26.416" },
    { ad: "Boğaz Eczanesi", adres: "Kordon Boyu No:33", tel: "0286 212 55 11", harita: "https://maps.google.com/?q=40.153,26.413" },
    { ad: "Hekim Eczanesi", adres: "Kepez Mah. Hasan Mevsuf Sok. No:6", tel: "0286 215 33 22", harita: "https://maps.google.com/?q=40.15,26.41" },
    { ad: "Kale Eczanesi", adres: "Çimenlik Mah. Hamidiye Cad. No:19", tel: "0286 212 77 33", harita: "https://maps.google.com/?q=40.156,26.417" },
    { ad: "Sağlık Eczanesi", adres: "Yalı Mah. Dr. Necati Cad. No:5", tel: "0286 216 22 44", harita: "https://maps.google.com/?q=40.158,26.414" },
];

export async function GET() {
    // Bugünün tarihini index olarak kullan → her gün farklı 2 eczane seç
    const today = new Date();
    const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );

    const idx1 = dayOfYear % ECZANELER.length;
    const idx2 = (dayOfYear + 1) % ECZANELER.length;

    const nobetci = [ECZANELER[idx1], ECZANELER[idx2]];

    return NextResponse.json({
        tarih: today.toLocaleDateString("tr-TR", {
            weekday: "long",
            day: "numeric",
            month: "long",
        }),
        eczaneler: nobetci,
        kaynak: "Çanakkale Eczacılar Odası (Demo)",
        not: "Gerçek nöbetçi eczane listesi için Çanakkale Eczacılar Odası web sitesini ziyaret edin.",
    });
}
