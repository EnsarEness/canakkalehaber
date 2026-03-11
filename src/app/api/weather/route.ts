import { NextResponse } from "next/server";

// Open-Meteo API - ücretsiz, API anahtarı gerektirmez
// Çanakkale koordinatları: 40.1553°N, 26.4142°E
const CANAKKALE_LAT = 40.1553;
const CANAKKALE_LON = 26.4142;

const WEATHER_URL = `https://api.open-meteo.com/v1/forecast?latitude=${CANAKKALE_LAT}&longitude=${CANAKKALE_LON}&current=temperature_2m,apparent_temperature,windspeed_10m,winddirection_10m,weathercode,relative_humidity_2m&hourly=temperature_2m,windspeed_10m&forecast_days=1&windspeed_unit=kmh&timezone=Europe%2FIstanbul`;

function getWeatherDescription(code: number): { label: string; icon: string } {
    if (code === 0) return { label: "Açık", icon: "☀️" };
    if (code <= 2) return { label: "Parçalı Bulutlu", icon: "🌤️" };
    if (code <= 3) return { label: "Kapalı", icon: "☁️" };
    if (code <= 49) return { label: "Sisli", icon: "🌫️" };
    if (code <= 57) return { label: "Çisenti", icon: "🌧️" };
    if (code <= 67) return { label: "Yağmurlu", icon: "🌧️" };
    if (code <= 77) return { label: "Karlı", icon: "❄️" };
    if (code <= 82) return { label: "Sağanak", icon: "⛈️" };
    if (code <= 99) return { label: "Fırtınalı", icon: "⛈️" };
    return { label: "Bilinmiyor", icon: "🌡️" };
}

function getWindLabel(speed: number, direction: number): { name: string; severity: "normal" | "warning" | "danger" } {
    // Rüzgar yönüne göre ad belirleme (Çanakkale için kritik rüzgarlar)
    // Lodos: güneybatı (225-315°), Poyraz: kuzeydoğu (22-90°)
    let windName = "";
    if (direction >= 337 || direction < 22) windName = "Yıldız (K)";
    else if (direction >= 22 && direction < 67) windName = "Poyraz (KD)";
    else if (direction >= 67 && direction < 112) windName = "Gündoğusu (D)";
    else if (direction >= 112 && direction < 157) windName = "Keşişleme (GD)";
    else if (direction >= 157 && direction < 202) windName = "Kıble (G)";
    else if (direction >= 202 && direction < 247) windName = "Lodos (GB)";
    else if (direction >= 247 && direction < 292) windName = "Karayel (B)";
    else windName = "Madarbat (KB)";

    let severity: "normal" | "warning" | "danger" = "normal";
    if (speed >= 50) severity = "danger";
    else if (speed >= 30) severity = "warning";

    // Poyraz ve Lodos Çanakkale Boğazı'nda kritik
    const isCritical = (direction >= 22 && direction < 90) || (direction >= 202 && direction < 270);
    if (isCritical && speed >= 25) severity = speed >= 40 ? "danger" : "warning";

    return { name: windName, severity };
}

export async function GET() {
    try {
        const response = await fetch(WEATHER_URL, {
            next: { revalidate: 1800 }, // 30 dakika cache
        });

        if (!response.ok) throw new Error("Weather API error");

        const data = await response.json();
        const current = data.current;

        const { label, icon } = getWeatherDescription(current.weathercode);
        const { name: windName, severity } = getWindLabel(
            current.windspeed_10m,
            current.winddirection_10m
        );

        return NextResponse.json({
            temperature: Math.round(current.temperature_2m),
            feelsLike: Math.round(current.apparent_temperature),
            humidity: current.relative_humidity_2m,
            windSpeed: Math.round(current.windspeed_10m),
            windDirection: current.winddirection_10m,
            windName,
            windSeverity: severity,
            weatherCode: current.weathercode,
            description: label,
            icon,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        // Fallback değerleri
        return NextResponse.json({
            temperature: 16,
            feelsLike: 13,
            humidity: 72,
            windSpeed: 22,
            windDirection: 45,
            windName: "Poyraz (KD)",
            windSeverity: "normal",
            weatherCode: 2,
            description: "Parçalı Bulutlu",
            icon: "🌤️",
            updatedAt: new Date().toISOString(),
            error: true,
        });
    }
}
