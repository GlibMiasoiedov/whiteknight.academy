export const TIMEZONES = [
    { label: "UTC−09:00 — Anchorage (USA, Alaska)", value: "America/Anchorage" },
    { label: "UTC−08:00 — Los Angeles (USA)", value: "America/Los_Angeles" },
    { label: "UTC−07:00 — Phoenix (USA) / Denver (USA)", value: "America/Denver" },
    { label: "UTC−06:00 — Chicago (USA)", value: "America/Chicago" },
    { label: "UTC−05:00 — New York (USA)", value: "America/New_York" },
    { label: "UTC−04:00 — Caracas (Venezuela)", value: "America/Caracas" },
    { label: "UTC−03:30 — St. John’s (Canada)", value: "America/St_Johns" },
    { label: "UTC−03:00 — Buenos Aires (Argentina)", value: "America/Argentina/Buenos_Aires" },
    { label: "UTC−02:00 — Fernando de Noronha (Brazil)", value: "America/Noronha" },
    { label: "UTC−01:00 — Ponta Delgada (Azores, Portugal)", value: "Atlantic/Azores" },
    { label: "UTC±00:00 — London (UK)", value: "Europe/London" },
    { label: "UTC+01:00 — Berlin (Germany)", value: "Europe/Berlin" },
    { label: "UTC+01:00 — Warsaw (Poland)", value: "Europe/Warsaw" },
    { label: "UTC+01:00 — Paris (France)", value: "Europe/Paris" },
    { label: "UTC+02:00 — Kyiv (Ukraine)", value: "Europe/Kyiv" },
    { label: "UTC+02:00 — Johannesburg (South Africa)", value: "Africa/Johannesburg" },
    { label: "UTC+03:00 — Riyadh (Saudi Arabia)", value: "Asia/Riyadh" },
    { label: "UTC+03:30 — Tehran (Iran)", value: "Asia/Tehran" },
    { label: "UTC+04:00 — Dubai (UAE)", value: "Asia/Dubai" },
    { label: "UTC+04:30 — Kabul (Afghanistan)", value: "Asia/Kabul" },
    { label: "UTC+05:00 — Karachi (Pakistan)", value: "Asia/Karachi" },
    { label: "UTC+05:30 — Delhi (India)", value: "Asia/Kolkata" },
    { label: "UTC+05:45 — Kathmandu (Nepal)", value: "Asia/Kathmandu" },
    { label: "UTC+06:00 — Dhaka (Bangladesh)", value: "Asia/Dhaka" },
    { label: "UTC+06:30 — Yangon (Myanmar)", value: "Asia/Yangon" },
    { label: "UTC+07:00 — Bangkok (Thailand)", value: "Asia/Bangkok" },
    { label: "UTC+08:00 — Singapore (Singapore)", value: "Asia/Singapore" },
    { label: "UTC+08:00 — Shanghai (China)", value: "Asia/Shanghai" },
    { label: "UTC+08:45 — Eucla (Australia)", value: "Australia/Eucla" },
    { label: "UTC+09:00 — Tokyo (Japan) / Seoul (South Korea)", value: "Asia/Tokyo" },
    { label: "UTC+09:30 — Adelaide (Australia)", value: "Australia/Adelaide" },
    { label: "UTC+10:00 — Sydney (Australia)", value: "Australia/Sydney" },
    { label: "UTC+10:30 — Lord Howe Island (Australia)", value: "Australia/Lord_Howe" },
    { label: "UTC+11:00 — Nouméa (New Caledonia)", value: "Pacific/Noumea" },
    { label: "UTC+12:00 — Auckland (New Zealand)", value: "Pacific/Auckland" },
    { label: "UTC+12:45 — Waitangi (New Zealand)", value: "Pacific/Chatham" }
];

/**
 * Converts a Warsaw time (default for mock schedule) to the target timezone.
 * Assumes source time is Europe/Warsaw.
 */
export function convertToTimezone(dateStr: string, timeStr: string, targetTz: string): string {
    // Construct ISO string assuming Warsaw offset. 
    // Warsaw is UTC+1 (CET) or UTC+2 (CEST).
    // Simple heuristic: Feb/Mar is CET (UTC+1). Apr-Oct is CEST (UTC+2).
    // Since our schedule is Feb/Mar, we use +01:00.
    const isoString = `${dateStr}T${timeStr}:00+01:00`;

    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: targetTz
        });
    } catch (e) {
        console.error("Time conversion error", e);
        return timeStr; // Fallback
    }
}

export function formatLessonDate(dateStr: string, timeStr: string, targetTz: string): string {
    const isoString = `${dateStr}T${timeStr}:00+01:00`;
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            timeZone: targetTz
        });
    } catch (e) {
        return dateStr;
    }
}
