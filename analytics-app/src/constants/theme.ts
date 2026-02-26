export const THEMES = {
    home: { color: '#8B5CF6', label: 'Violet', bg: 'bg-violet-500', text: 'text-violet-400', border: 'border-violet-500/20' },
    report: { color: '#10B981', label: 'Emerald', bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    coaching: { color: '#F59E0B', label: 'Amber', bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/20' },
    training: { color: '#06B6D4', label: 'Cyan', bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    integrations: { color: '#EC4899', label: 'Pink', bg: 'bg-pink-500', text: 'text-pink-400', border: 'border-pink-500/20' },
};

export const FONTS = {
    h1: 'font-display text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white',
    h2: 'font-display text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-semibold tracking-tight text-white',
    label: 'font-body text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider',
    body: 'font-body text-base md:text-xl font-medium text-slate-400 leading-relaxed',
    kpi: 'font-display text-4xl md:text-6xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white',
    logo: 'font-display text-2xl md:text-3xl font-bold tracking-tight text-white',
};

// Dashboard-specific fonts — smaller, denser for analytics UI
export const DASHBOARD_FONTS = {
    h1: 'font-display text-xl xl:text-2xl font-bold tracking-tight text-white',
    h2: 'font-display text-lg xl:text-xl font-semibold tracking-tight text-white',
    h3: 'font-display text-base xl:text-lg font-semibold text-white',
    widgetTitle: 'font-body text-[11px] md:text-xs xl:text-sm font-bold text-white uppercase tracking-wider',
    label: 'font-body text-[10px] xl:text-xs font-bold text-slate-400 uppercase tracking-wider',
    body: 'font-body text-sm font-medium text-slate-400 leading-relaxed',
    kpi: 'font-display text-2xl xl:text-3xl font-extrabold tracking-tight text-white',
    logo: 'font-display text-lg xl:text-xl font-bold tracking-tight text-white',
    small: 'font-body text-xs text-slate-500',
};
