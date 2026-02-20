import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ArrowLeft, Users, User, Check, Calendar, Star, Target, Pencil, AlertTriangle, Lightbulb, Clock, Zap, Award, Globe } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LessonCalendar from './LessonCalendar';
import { ALL_LESSON_SLOTS, getCoachById, LANGUAGE_FLAGS, PRICING } from './mockData';
import type { LessonSlot } from './mockData';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_FONTS } from '../../constants/theme';

/* ─── Types ─────────────────────────────────────── */
interface CoachingProfile {
    timezone: string;
    primaryLang: string;
    secondaryLang: string;
    level: string;
    selectedGoals: string[];
    availability: { day: string; time: string }[];
    coachingType: 'individual' | 'group';
    studentAge: string;
}

/* ─── Hook: Load profile from localStorage ──────── */
function useCoachingProfile() {
    const [profile, setProfile] = useState<CoachingProfile | null>(null);

    const reload = useCallback(() => {
        try {
            const raw = localStorage.getItem('wk_coaching_profile');
            if (raw) setProfile(JSON.parse(raw));
            else setProfile(null);
        } catch { setProfile(null); }
    }, []);

    useEffect(() => {
        reload();
        window.addEventListener('storage', reload);
        const interval = setInterval(reload, 800);
        return () => { window.removeEventListener('storage', reload); clearInterval(interval); };
    }, [reload]);

    return profile;
}

/* ─── Browser timezone ──────────────────────────── */
function getBrowserTimezone(): string {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
    catch { return 'Europe/Warsaw'; }
}

function getTimezoneOffset(tz: string): string {
    try {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(new Date());
        return parts.find(p => p.type === 'timeZoneName')?.value || tz;
    } catch { return tz; }
}

/* ─── Dynamic Recommendation ────────────────────── */
function getRecommendation(profile: CoachingProfile | null): string {
    if (!profile) {
        return 'Complete your Coach Matching profile to get personalized lesson recommendations based on your level, goals, and availability.';
    }
    const parts: string[] = [];
    const level = profile.level || '';
    const goals = profile.selectedGoals || [];
    const type = profile.coachingType;
    const age = parseInt(profile.studentAge) || 0;

    if (level.includes('Beginner')) parts.push('Focus on building a solid foundation. Start with lessons marked ★ (entry points).');
    else if (level.includes('Club') || level.includes('Intermediate')) parts.push('Focus on tactical sharpness and opening preparation for consistent improvement.');
    else if (level.includes('Advanced') || level.includes('Expert')) parts.push('Individual coaching will give you the biggest edge at your rating range.');

    if (goals.includes('Tournament Prep')) parts.push('For tournament prep, book Individual sessions before events.');
    else if (goals.includes('Opening Repertoire')) parts.push('Check out our Opening Prep sessions for structured repertoire building.');
    else if (goals.includes('Endgame Mastery')) parts.push('Endgame mastery requires deep study — group lessons cover key patterns weekly.');

    if (type === 'group') parts.push('Group sessions (max 4) are great for structured weekly improvement.');
    else if (type === 'individual') parts.push('Individual coaching gives you personalized game analysis and targeted training.');

    if (age > 0 && age < 12) parts.push('For younger students, we pair with coaches experienced in junior training.');

    return parts.length > 0 ? parts.join(' ') : 'Your profile is set! Browse and select a lesson to begin your chess journey.';
}

/* ─── Coach highlights for the info card ──────── */
const COACH_HIGHLIGHTS: Record<string, { tagline: string; achievements: string[]; style: string }> = {
    glib: {
        tagline: 'Structured foundation builder with 10+ years of youth coaching',
        achievements: [
            'FIDE Master (FM), 2250+ peak FIDE rating',
            'Trained 200+ students from zero to tournament level',
            'Developed White Knight beginner curriculum',
            'Multilingual: English, Ukrainian, Polish',
        ],
        style: 'Patient, structured approach with focus on understanding core principles',
    },
    maria: {
        tagline: 'Strategic thinker specializing in endgames & tournament preparation',
        achievements: [
            'Woman International Master (WIM), 2180+ peak FIDE rating',
            'National Women\'s Champion (Poland, 2022)',
            'Certified FIDE Trainer with 8+ years of experience',
            'Multilingual: English, Polish, Mandarin',
        ],
        style: 'Analytical approach with deep focus on decision-making and endgame technique',
    },
    daniel: {
        tagline: 'Opening specialist with competitive time management expertise',
        achievements: [
            'International Master (IM), 2400+ peak FIDE rating',
            'Author of "Modern Opening Repertoire for Club Players"',
            'Active tournament player with 15+ years of experience',
            'Expert in rapid & blitz time management',
        ],
        style: 'Practical, competition-focused coaching with emphasis on opening preparation',
    },
};

/* ─── Get future sessions for selected lesson ───── */
function getFutureSessions(selectedSlot: LessonSlot | null, allSlots: LessonSlot[], count: number = 5): LessonSlot[] {
    if (!selectedSlot) return [];
    return allSlots
        .filter(s =>
            s.id !== selectedSlot.id &&
            s.coachId === selectedSlot.coachId &&
            s.topic === selectedSlot.topic &&
            s.date > selectedSlot.date
        )
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
        .slice(0, count);
}

/* ─── Get all dates for future sessions of same topic/coach ───── */
function getRelatedDates(selectedSlot: LessonSlot | null, allSlots: LessonSlot[]): Set<string> {
    if (!selectedSlot) return new Set();
    const dates = new Set<string>();
    allSlots.forEach(s => {
        if (s.id !== selectedSlot.id &&
            s.coachId === selectedSlot.coachId &&
            s.topic === selectedSlot.topic &&
            s.date >= selectedSlot.date) {
            dates.add(s.date);
        }
    });
    return dates;
}

/* ═══ Main Component ════════════════════════════ */
const StandardPlanPage: React.FC<{
    onBack: () => void;
    openManualInputs?: () => void;
    connections?: { chessCom: boolean; lichess: boolean; masterDb: boolean };
    openModal?: (modal: 'chessCom' | 'lichess' | 'masterDb' | null) => void;
}> = ({ onBack, openManualInputs }) => {
    const navigate = useNavigate();
    const profile = useCoachingProfile();

    const [planType, setPlanType] = useState<'all' | 'group' | 'individual'>('all');
    const [selectedSlot, setSelectedSlot] = useState<LessonSlot | null>(null);
    const [showAllSessions, setShowAllSessions] = useState(false);
    const [timezone, setTimezone] = useState(getBrowserTimezone);

    // Day currently expanded in schedule
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const [expandedDate, setExpandedDate] = useState<string | null>(todayStr);

    // Sync timezone from profile
    useEffect(() => {
        if (profile?.timezone) setTimezone(profile.timezone);
    }, [profile?.timezone]);

    const hasProfile = !!profile;

    const handleSelectSlot = useCallback((slot: LessonSlot) => {
        setSelectedSlot(slot);
        setPlanType(slot.format);
    }, []);

    // Future sessions & highlighted dates
    const futureSessions = useMemo(() => getFutureSessions(selectedSlot, ALL_LESSON_SLOTS), [selectedSlot]);
    const highlightDates = useMemo(() => getRelatedDates(selectedSlot, ALL_LESSON_SLOTS), [selectedSlot]);

    // Coach info for selected slot
    const selectedCoach = selectedSlot ? getCoachById(selectedSlot.coachId) : null;
    const selectedCoachHighlights = selectedSlot ? COACH_HIGHLIGHTS[selectedSlot.coachId] : null;

    const handleCheckout = () => {
        if (selectedSlot) {
            const params = new URLSearchParams({
                type: selectedSlot.format,
                plan: selectedSlot.format === 'group' ? 'standard' : 'individual',
                firstLesson: selectedSlot.date,
                time: selectedSlot.time,
                group: selectedSlot.group,
                coach: selectedSlot.coachId,
                ...(profile?.studentAge && { age: profile.studentAge }),
                tz: timezone,
                lang: selectedSlot.language
            });
            navigate(`/checkout?${params.toString()}`);
        }
    };

    /* ── Missing hints ── */
    const getMissingHints = (): string[] => {
        const hints: string[] = [];
        if (!profile) hints.push('Complete Coach Matching & Goals');
        if (profile && !profile.studentAge) hints.push('Set student age in profile');
        if (!selectedSlot && planType === 'all') hints.push('Select a plan (Group or Individual)');
        if (!selectedSlot) hints.push('Select a lesson from the calendar');
        return hints;
    };
    const missingHints = getMissingHints();

    /* ── Expanded day slots for Schedule ── */
    const expandedSlots = useMemo(() => {
        if (!expandedDate) return [];
        let slots = ALL_LESSON_SLOTS.filter(s => s.date === expandedDate);
        if (!showAllSessions) slots = slots.filter(s => s.isEntryPoint);
        if (planType !== 'all') slots = slots.filter(s => s.format === planType);
        return slots;
    }, [expandedDate, showAllSessions, planType]);

    /* ── Pricing ── */
    const currentPricing = planType === 'group' || (selectedSlot?.format === 'group')
        ? PRICING.group
        : planType === 'individual' || (selectedSlot?.format === 'individual')
            ? PRICING.individual
            : null;

    const effectiveFormat = selectedSlot?.format || (planType !== 'all' ? planType : null);
    const hasTrial = effectiveFormat === 'group' && PRICING.group.trialDays > 0;
    const canProceed = !!selectedSlot;

    return (
        <div className="flex h-screen bg-[#080C14] font-body text-slate-300 overflow-hidden">

            {/* ═══ CENTER COLUMN ═════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 pb-2 shrink-0">
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs mb-4 transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Coaching Hub
                    </button>
                    <div className="mb-4">
                        <h1 className={DASHBOARD_FONTS.h1 + " mb-1"}>
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Chess Lesson</span>
                        </h1>
                        <p className={DASHBOARD_FONTS.body}>
                            Browse group & individual sessions. Select your first lesson to start.
                        </p>
                    </div>

                    {/* ── Plan Card Selectors + Entry Point toggle ── */}
                    <div className="flex flex-wrap items-stretch gap-3 mb-2">
                        <PlanFilterBtn active={planType === 'all'} onClick={() => { setPlanType('all'); setSelectedSlot(null); }}
                            label="All Formats" icon={<Star size={13} />} />
                        <PlanFilterBtn active={planType === 'group'} onClick={() => { setPlanType('group'); setSelectedSlot(null); }}
                            label="Group Lessons" price="€99/mo" trialText="7-day free trial" icon={<Users size={13} />} color="amber" />
                        <PlanFilterBtn active={planType === 'individual'} onClick={() => { setPlanType('individual'); setSelectedSlot(null); }}
                            label="Individual" price="€159/mo" icon={<User size={13} />} color="violet" />

                        <div className="w-px bg-white/10 self-stretch" />

                        <button onClick={() => setShowAllSessions(!showAllSessions)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border self-center ${!showAllSessions
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover-glow-amber-strong'
                                : 'bg-white/[0.02] text-slate-500 border-white/5 hover-glow-white-strong'}`}>
                            <Star size={11} className={!showAllSessions ? 'text-amber-400' : 'text-slate-600'} fill={!showAllSessions ? "currentColor" : "none"} />
                            Entry Points Only
                        </button>
                    </div>
                </div>

                {/* Calendar + Schedule */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 pt-2">
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

                        {/* ── Calendar ── */}
                        <Card className="p-4 bg-[#0B101B]/80 backdrop-blur-xl border-white/5 shadow-xl">
                            <div className="max-w-[92%] mx-auto">
                                <LessonCalendar
                                    slots={ALL_LESSON_SLOTS}
                                    onSelectSlot={(slot) => { handleSelectSlot(slot); setExpandedDate(slot.date); }}
                                    selectedSlotId={selectedSlot?.id || null}
                                    entryPointOnly={!showAllSessions}
                                    timezone={timezone}
                                    formatFilter={planType}
                                    hideExpansion={true}
                                    onDateClick={(dateStr) => setExpandedDate(dateStr)}
                                    selectedDate={expandedDate}
                                    highlightDates={highlightDates}
                                    bookedDate={selectedSlot?.date || null}
                                />
                            </div>
                        </Card>

                        {/* ── Schedule Column ── */}
                        <div className="bg-[#0B101B]/60 border border-white/5 rounded-2xl p-4 flex flex-col min-h-[400px] xl:min-h-0 xl:h-full shadow-lg overflow-hidden">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5 shrink-0">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-amber-500" />
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">Schedule</h3>
                                </div>
                                {expandedDate && (
                                    <span className="text-[10px] text-slate-400 font-medium bg-white/5 px-2 py-1 rounded-md">
                                        {new Date(expandedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </span>
                                )}
                            </div>

                            {expandedSlots.length > 0 ? (
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
                                    {expandedSlots.map(slot => (
                                        <ScheduleCard key={slot.id} slot={slot} isSelected={selectedSlot?.id === slot.id}
                                            onSelect={() => handleSelectSlot(slot)} timezone={timezone} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 opacity-50">
                                    <Calendar size={28} className="text-slate-600 mb-2 stroke-1" />
                                    <p className="text-[10px] text-slate-500">No sessions on this day</p>
                                    <p className="text-[9px] text-slate-600 mt-1">Click a date on the calendar</p>
                                </div>
                            )}

                            {/* ── Future sessions ── */}
                            {selectedSlot && futureSessions.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-white/5 shrink-0">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <Clock size={11} className="text-emerald-400" />
                                        <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider">Upcoming same session</span>
                                    </div>
                                    <div className="space-y-1 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                                        {futureSessions.map(slot => {
                                            const localTime = getLocalTime(slot.time, slot.date, timezone);
                                            return (
                                                <div key={slot.id} className="flex items-center justify-between text-[10px] py-1.5 px-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-500 w-16 shrink-0">{new Date(slot.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                        <span className="text-white font-medium">{localTime}</span>
                                                    </div>
                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${slot.format === 'individual' ? 'bg-violet-500/20 text-violet-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                        {slot.format === 'individual' ? '1:1' : 'Group'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ RIGHT COLUMN ════════════════════ */}
            <div className="w-[320px] xl:w-[350px] bg-[#080C14] border-l border-white/5 flex flex-col h-full shrink-0 overflow-y-auto custom-scrollbar p-5 ml-3">
                <div className="space-y-4 flex flex-col h-full">

                    {/* ── Coach Matching (profile settings only) ── */}
                    {/* ── Coach Matching (profile settings only) ── */}
                    <button onClick={() => openManualInputs?.()}
                        className={`w-full text-left rounded-xl p-4 border group relative overflow-hidden shrink-0 ${hasProfile
                            ? 'bg-emerald-500/5 border-emerald-500/20 hover-glow-emerald-strong'
                            : 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 hover-glow-amber-strong'
                            }`}>
                        <div className="flex items-start justify-between mb-2">
                            <Target size={16} className={hasProfile ? 'text-emerald-400' : 'text-amber-400'} />
                            <div className="bg-white/10 p-1 rounded-md opacity-60 group-hover:opacity-100 transition-opacity">
                                <Pencil size={10} className="text-slate-300" />
                            </div>
                        </div>
                        <span className="font-bold text-white text-sm block mb-1">Coach Matching & Goals</span>
                        {hasProfile ? (
                            <div className="space-y-1.5 mt-2">
                                <ProfileTag label="Level" value={profile.level?.split(' (')[0] || '—'} />
                                {profile.studentAge && <ProfileTag label="Age" value={profile.studentAge} />}
                                {profile.selectedGoals?.length > 0 && (
                                    <ProfileTag label="Goals" value={profile.selectedGoals.slice(0, 2).join(', ') + (profile.selectedGoals.length > 2 ? ` +${profile.selectedGoals.length - 2}` : '')} />
                                )}
                                {profile.coachingType && <ProfileTag label="Type" value={profile.coachingType === 'group' ? 'Group' : 'Individual'} />}
                                {profile.primaryLang && <ProfileTag label="Lang" value={profile.primaryLang} />}
                                {profile.timezone && <ProfileTag label="TZ" value={getTimezoneOffset(profile.timezone)} />}
                            </div>
                        ) : (
                            <span className="text-[11px] text-slate-400 leading-relaxed block">
                                Personalize with level & goals.
                            </span>
                        )}
                    </button>

                    {/* ── Dynamic Recommendation ── */}
                    <div className="rounded-xl p-3 border text-[11px] leading-relaxed bg-white/[0.02] border-white/5 text-slate-400 flex gap-2.5 shrink-0">
                        <Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-400/70" />
                        <span>{getRecommendation(profile)}</span>
                    </div>

                    {/* ── Coach Info Card (appears when a lesson is selected) ── */}
                    {selectedCoach && selectedCoachHighlights && (
                        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-4 shrink-0 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-violet-500/30 flex items-center justify-center text-lg text-white font-bold font-display ring-2 ring-white/10">
                                    {selectedCoach.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-white font-bold text-sm font-display">{selectedCoach.name}</div>
                                    <div className="text-[10px] text-amber-400 font-medium">{selectedCoach.title} • {selectedCoachHighlights.tagline.split(' with ')[0]}</div>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed mb-3 italic">"{selectedCoachHighlights.style}"</p>
                            <div className="space-y-1.5">
                                {selectedCoachHighlights.achievements.map((ach, i) => (
                                    <div key={i} className="flex items-start gap-2 text-[10px]">
                                        <Award size={10} className="text-amber-400/60 mt-0.5 shrink-0" />
                                        <span className="text-slate-300">{ach}</span>
                                    </div>
                                ))}
                            </div>
                            {selectedCoach.languages.length > 0 && (
                                <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/5">
                                    <Globe size={10} className="text-slate-500" />
                                    <span className="text-[10px] text-slate-500">
                                        {selectedCoach.languages.map(l => LANGUAGE_FLAGS[l] || l).join('  ')}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex-1" />

                    {/* ═══ SUMMARY ═══ */}
                    <div className="bg-[#0B101B] border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden shrink-0">
                        {effectiveFormat === 'individual'
                            ? <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/10 blur-[60px] rounded-full" />
                            : <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 blur-[60px] rounded-full" />
                        }
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-white font-bold font-display text-sm uppercase tracking-wider">Summary</h3>
                            </div>

                            <div className="space-y-2 mb-4 text-xs">
                                {selectedSlot ? (
                                    <>
                                        <SummaryRow label="Lesson" value={selectedSlot.topic} truncate />
                                        <SummaryRow label="Coach" value={getCoachById(selectedSlot.coachId)?.name || '—'} />
                                        <SummaryRow label="Date" value={
                                            new Date(selectedSlot.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                                        } />
                                        <SummaryRow label="Time" value={getLocalTime(selectedSlot.time, selectedSlot.date, timezone) + ` (${getTimezoneOffset(timezone)})`} />
                                        <SummaryRow label="Format" value={selectedSlot.format === 'group' ? 'Group (max 4)' : 'Individual 1:1'} />
                                        {futureSessions.length > 0 && (
                                            <SummaryRow label="Next session" value={
                                                new Date(futureSessions[0].date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                + ' at ' + getLocalTime(futureSessions[0].time, futureSessions[0].date, timezone)
                                            } />
                                        )}
                                    </>
                                ) : (
                                    <SummaryRow label="Lesson" value="Not selected" warn />
                                )}

                                {/* Pricing */}
                                <div className="border-t border-white/5 pt-2 mt-3">
                                    {currentPricing ? (
                                        <>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-slate-400">Price</span>
                                                <span className="text-lg font-bold text-white">
                                                    {currentPricing.currency}{currentPricing.monthly}<span className="text-[10px] text-slate-500 font-normal">/mo</span>
                                                </span>
                                            </div>
                                            {hasTrial && (
                                                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1.5 mt-2">
                                                    <Zap size={11} className="text-emerald-400 shrink-0" />
                                                    <span className="text-[10px] text-emerald-300 font-medium">
                                                        7-day free trial — no charge today
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">Total</span>
                                            <span className="text-lg font-bold text-white">—</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button size="lg" fullWidth
                                themeColor={effectiveFormat === 'individual' ? '#8B5CF6' : '#F59E0B'}
                                onClick={handleCheckout} disabled={!canProceed}
                                className={!canProceed ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg'}>
                                {selectedSlot ? (hasTrial ? 'Start Free Trial' : 'Subscribe') : 'Select Lesson'}
                            </Button>

                            {missingHints.length > 0 && (
                                <div className="mt-3 space-y-1">
                                    {missingHints.map((hint, i) => (
                                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-red-400/80">
                                            <AlertTriangle size={10} className="shrink-0" />
                                            <span>{hint}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

/* ─── Helper: Convert time to local timezone ──── */
function getLocalTime(time: string, date: string, tz: string): string {
    try {
        const isoString = `${date}T${time}:00+01:00`;
        const dateObj = new Date(isoString);
        return dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz
        });
    } catch { return time; }
}

/* ─── Plan Filter Button ────────────────────────── */
const PlanFilterBtn: React.FC<{
    active: boolean; onClick: () => void; label: string;
    price?: string; trialText?: string; icon: React.ReactNode; color?: 'amber' | 'violet';
}> = ({ active, onClick, label, price, trialText, icon, color }) => {
    const activeColors = color === 'violet'
        ? 'bg-violet-500/15 border-violet-500/40 text-violet-200 shadow-[0_0_15px_-5px_rgba(139,92,246,0.2)]'
        : color === 'amber'
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)]'
            : 'bg-white/10 border-white/20 text-white';

    return (
        <button onClick={onClick}
            className={`px-4 py-2 rounded-xl text-left border flex items-center gap-3 ${active
                ? activeColors
                : 'bg-white/[0.02] border-white/5 text-slate-500 hover-glow-white-strong'}`}>
            <div className={`${active ? '' : 'opacity-50'}`}>{icon}</div>
            <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider leading-tight">{label}</div>
                {price && (
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-medium ${active ? 'text-white/80' : 'text-slate-600'}`}>{price}</span>
                        {trialText && <span className={`text-[9px] ${active ? 'text-emerald-400' : 'text-slate-600'}`}>{trialText}</span>}
                    </div>
                )}
            </div>
            {active && (
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ml-auto ${color === 'violet' ? 'bg-violet-500' : color === 'amber' ? 'bg-amber-500' : 'bg-white/20'}`}>
                    <Check size={10} className="text-white" />
                </div>
            )}
        </button>
    );
};

/* ─── Schedule Card ─────────────────────────────── */
const ScheduleCard: React.FC<{
    slot: LessonSlot; isSelected: boolean; onSelect: () => void; timezone: string;
}> = ({ slot, isSelected, onSelect, timezone }) => {
    const coach = getCoachById(slot.coachId);
    const isIndividual = slot.format === 'individual';
    const seatsLeft = slot.seatsTotal - slot.seatsTaken;
    const localTime = getLocalTime(slot.time, slot.date, timezone);

    return (
        <button onClick={onSelect}
            className={`w-full text-left p-3 rounded-xl border relative overflow-hidden group ${isSelected
                ? isIndividual
                    ? 'bg-violet-500/10 border-violet-500/40 hover-glow-violet-strong'
                    : 'bg-amber-500/10 border-amber-500/40 hover-glow-amber-strong'
                : 'bg-white/[0.02] border-white/5 hover-glow-white-strong'
                }`}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-white font-bold text-sm font-display">{localTime}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${isIndividual ? 'bg-violet-500/20 text-violet-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {isIndividual ? '1:1' : 'Group'}
                        </span>
                        {slot.isEntryPoint && <Star size={10} className="text-amber-400" fill="currentColor" />}
                    </div>
                    <div className="text-xs text-slate-200 font-medium leading-snug group-hover:text-white transition-colors mb-2">{slot.topic}</div>
                    {coach && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[9px] text-white font-bold ring-1 ring-white/10">
                                {coach.name.charAt(0)}
                            </div>
                            <span className="text-[11px] text-slate-400">{coach.name}</span>
                            <span className="text-[10px] text-slate-600 px-1 bg-white/5 rounded">{LANGUAGE_FLAGS[slot.language]}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <span>50 min</span>
                        <span className="capitalize">{slot.language}</span>
                        {!isIndividual && <span>{slot.seatsTaken}/{slot.seatsTotal} enrolled</span>}
                    </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                    {isSelected ? (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isIndividual ? 'bg-violet-500' : 'bg-amber-500'}`}>
                            <Check size={12} className="text-white" />
                        </div>
                    ) : (
                        <>
                            {!isIndividual && (
                                <div className={`text-[10px] font-bold ${seatsLeft <= 2 ? 'text-red-400' : 'text-slate-500'}`}>{seatsLeft} left</div>
                            )}
                            {isIndividual && (
                                <span className="text-[9px] px-2 py-1 rounded-md bg-violet-500/20 text-violet-300 font-bold">Book</span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </button>
    );
};

/* ─── Small UI Helpers ──────────────────────────── */
const ProfileTag: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex items-center gap-2 text-[10px]">
        <span className="text-slate-500 uppercase font-bold tracking-wider w-12 shrink-0">{label}</span>
        <span className="text-slate-300 truncate">{value}</span>
    </div>
);

const SummaryRow: React.FC<{ label: string; value: string; warn?: boolean; truncate?: boolean }> = ({ label, value, warn, truncate }) => (
    <div className="flex justify-between items-center gap-2">
        <span className="text-slate-400 shrink-0">{label}</span>
        <span className={`font-medium text-right ${warn ? 'text-red-400/70' : 'text-white'} ${truncate ? 'truncate max-w-[160px]' : ''}`}>{value}</span>
    </div>
);

export default StandardPlanPage;
