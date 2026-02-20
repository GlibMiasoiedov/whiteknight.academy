import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ArrowLeft, Users, User, Check, Calendar, Star, Target, Pencil, AlertTriangle, Lightbulb, Clock, Zap, Award, Globe, ChevronDown } from 'lucide-react';
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
            s.group === selectedSlot.group &&
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
            s.group === selectedSlot.group &&
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
    disconnectPlatform?: (platform: 'chessCom' | 'lichess' | 'masterDb') => void;
}> = ({ onBack, openManualInputs, connections, disconnectPlatform }) => {
    const navigate = useNavigate();
    const profile = useCoachingProfile();

    const [planType, setPlanType] = useState<'all' | 'group' | 'individual'>('all');
    const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate'>('all');
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<LessonSlot | null>(null);
    const [showAllSessions, setShowAllSessions] = useState(false);
    const [timezone, setTimezone] = useState(getBrowserTimezone);
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

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
        if (selectedSlot?.id === slot.id) {
            setSelectedSlot(null);
            setSelectedLevel('all'); // Added this to reset level filter when deselecting slot
        } else {
            setSelectedSlot(slot);
            setPlanType(slot.format);
            if (slot.level !== 'all') setSelectedLevel(slot.level as 'beginner' | 'intermediate');
        }
    }, [selectedSlot]);

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
                interval: billingInterval,
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
        if (selectedLevel !== 'all') slots = slots.filter(s => s.level === selectedLevel || s.format === 'individual');
        return slots;
    }, [expandedDate, showAllSessions, planType, selectedLevel]);

    /* ── Pricing ── */
    const currentPricing = planType === 'group' || (selectedSlot?.format === 'group')
        ? PRICING.group
        : planType === 'individual' || (selectedSlot?.format === 'individual')
            ? PRICING.individual
            : null;

    const effectiveFormat = selectedSlot?.format || (planType !== 'all' ? planType : null);
    const canProceed = !!selectedSlot && missingHints.length === 0;

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
                        <PlanFilterBtn active={planType === 'all'} onClick={() => { setPlanType('all'); }}
                            label="All Formats" icon={<Star size={13} />} />
                        <PlanFilterBtn active={planType === 'group'} onClick={() => { setPlanType('group'); }}
                            label="Group Lessons" price="€99/mo" trialText="7-day free trial" icon={<Users size={13} />} color="amber" />
                        <PlanFilterBtn active={planType === 'individual'} onClick={() => { setPlanType('individual'); }}
                            label="Individual" price="€159/mo" icon={<User size={13} />} color="violet" />

                        <div className="w-px bg-white/10 self-stretch" />

                        <div className="flex items-center gap-2 self-center relative">
                            {/* Custom Level Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                                    className={`flex items-center gap-2 bg-[#080C14] hover:bg-[#0B101B] border rounded-lg px-3 py-1.5 text-xs font-bold transition-all min-w-[140px] justify-between shadow-lg ${isLevelDropdownOpen ? 'border-amber-500/50 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)] text-white' : 'border-white/10 text-slate-300 hover:text-white'}`}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Target size={12} className={isLevelDropdownOpen ? 'text-amber-400' : 'text-slate-500'} />
                                        <span>
                                            {selectedLevel === 'all' ? 'All Levels' :
                                                selectedLevel === 'beginner' ? 'Beginner' : 'Intermediate'}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${isLevelDropdownOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} />
                                </button>

                                {isLevelDropdownOpen && (
                                    <>
                                        {/* Backdrop to close dropdown */}
                                        <div className="fixed inset-0 z-40" onClick={() => setIsLevelDropdownOpen(false)} />

                                        {/* Dropdown Menu */}
                                        <div className="absolute top-full left-0 mt-2 w-full min-w-[160px] bg-[#080C14] border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="p-1.5 space-y-0.5">
                                                {(['all', 'beginner', 'intermediate'] as const).map((level) => (
                                                    <button
                                                        key={level}
                                                        onClick={() => {
                                                            setSelectedLevel(level);
                                                            setIsLevelDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-between ${selectedLevel === level
                                                            ? 'bg-amber-500/10 text-amber-300'
                                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                            }`}
                                                    >
                                                        <span>
                                                            {level === 'all' ? 'All Levels' :
                                                                level === 'beginner' ? 'Beginner' : 'Intermediate'}
                                                        </span>
                                                        {selectedLevel === level && <Check size={12} className="text-amber-400" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button onClick={() => setShowAllSessions(!showAllSessions)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${!showAllSessions
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)] hover-glow-amber-strong'
                                    : 'bg-white/[0.02] text-slate-500 border-white/5 hover-glow-white-strong'}`}>
                                <Star size={11} className={!showAllSessions ? 'text-amber-400' : 'text-slate-600'} fill={!showAllSessions ? "currentColor" : "none"} />
                                Entry Points Only
                            </button>
                        </div>
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
                                    levelFilter={selectedLevel}
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
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pt-3 -mt-3 pb-3 -mb-3 space-y-2 relative z-10">
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
            <div className="w-[320px] xl:w-[350px] bg-[#080C14] border-l border-white/5 flex flex-col h-full shrink-0 ml-3 relative">

                {/* Scrollable upper content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 pb-8">

                    {/* ── Coach Matching (profile settings only) ── */}
                    <button onClick={() => openManualInputs?.()}
                        className={`w-full text-left rounded-xl p-4 border group relative overflow-hidden shrink-0 ${hasProfile
                            ? 'bg-emerald-500/5 border-emerald-500/20 hover-glow-emerald-strong'
                            : 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 hover-glow-amber-strong'
                            }`}>
                        <div className="flex items-start justify-between mb-2">
                            <span className="font-bold text-white text-sm block">Coach Matching & Goals</span>
                            <div className="bg-white/10 p-1.5 rounded-md opacity-60 group-hover:opacity-100 transition-opacity">
                                <Pencil size={12} className="text-slate-300" />
                            </div>
                        </div>

                        {hasProfile ? (
                            <div className="flex flex-col gap-2.5">
                                <div className="flex flex-wrap gap-1.5">
                                    <ProfileTag value={profile.level?.split(' (')[0] || '—'} />
                                    {profile.studentAge && <ProfileTag value={`Age: ${profile.studentAge}`} />}
                                    {profile.coachingType && <ProfileTag value={profile.coachingType === 'group' ? 'Group' : '1:1'} highlight={profile.coachingType} />}
                                    {profile.primaryLang && <ProfileTag value={profile.primaryLang} />}
                                    {profile.timezone && <ProfileTag value={getTimezoneOffset(profile.timezone)} />}
                                </div>

                                {/* Platform Connections (if any) */}
                                {(connections?.chessCom || connections?.lichess) && (
                                    <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-emerald-500/10">
                                        <span className="text-[10px] text-slate-400 font-medium w-full mb-0.5">Connected</span>
                                        {connections?.chessCom && (
                                            <button onClick={(e) => { e.stopPropagation(); disconnectPlatform?.('chessCom'); }} className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Chess.com
                                            </button>
                                        )}
                                        {connections?.lichess && (
                                            <button onClick={(e) => { e.stopPropagation(); disconnectPlatform?.('lichess'); }} className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Lichess
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Training Goals (if any) */}
                                {profile.selectedGoals && profile.selectedGoals.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-emerald-500/10">
                                        <span className="text-[10px] text-slate-400 font-medium w-full mb-0.5">Goals</span>
                                        {profile.selectedGoals.map(goal => (
                                            <span key={goal} className="text-[9px] bg-white/5 text-slate-300 border border-white/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                {goal}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-[11px] text-slate-400 leading-relaxed block mt-2">
                                Personalize with level, goals & platforms.
                            </span>
                        )}
                    </button>

                    {/* ── Dynamic Recommendation ── */}
                    {!selectedSlot && (
                        <div className="bg-[#080C14] border border-amber-500/30 rounded-xl p-5 flex gap-3 relative overflow-hidden group shadow-[0_5px_20px_-5px_rgba(245,158,11,0.15)] hover-glow-amber-strong shrink-0 animate-in fade-in cursor-default">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-bl-[100px]" />
                            <Lightbulb size={20} className="mt-0.5 shrink-0 text-amber-400 relative z-10" />
                            <p className="text-sm font-medium text-slate-200 leading-relaxed relative z-10">
                                {getRecommendation(profile)}
                            </p>
                        </div>
                    )}

                    {/* ── Coach Info Card (appears when a lesson is selected) ── */}
                    {selectedCoach && selectedCoachHighlights && (
                        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-4 shrink-0 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-violet-500/30 flex items-center justify-center text-lg text-white font-bold font-display ring-2 ring-white/10 shrink-0">
                                    {selectedCoach.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-white font-bold text-sm font-display">{selectedCoach.name}</div>
                                    <div className="text-[10px] text-amber-400 font-medium truncate">{selectedCoach.title} • {selectedCoachHighlights.tagline.split(' with ')[0]}</div>
                                </div>
                            </div>

                            {/* Summary Sentence */}
                            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                                {selectedCoachHighlights.style}
                            </p>

                            {/* Chips for Achievements */}
                            <div className="flex flex-wrap gap-1.5">
                                {selectedCoachHighlights.achievements.map((ach, i) => {
                                    // Extract key phrase for shorter chip if possible, else use full string
                                    const shortAch = ach.split(',')[0].split('with')[0].trim();
                                    return (
                                        <div key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-md px-2 py-1">
                                            <Award size={9} className="text-amber-400/70" />
                                            <span className="text-[9px] text-slate-300 whitespace-nowrap">{shortAch}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {selectedCoach.languages.length > 0 && (
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        <Globe size={11} className="text-slate-500" />
                                        <span className="text-[10px] text-slate-400 font-medium">Languages</span>
                                    </div>
                                    <span className="text-[11px]">
                                        {selectedCoach.languages.map(l => LANGUAGE_FLAGS[l] || l).join(' ')}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ═══ FIXED BOTTOM SUMMARY ═══ */}
                <div className="shrink-0 p-5 pt-0 border-t border-white/5 bg-[#080C14] relative z-10 before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-gradient-to-t before:from-[#080C14] before:to-transparent">
                    <div className="bg-[#0B101B] border border-white/10 rounded-2xl p-5 shadow-[0_-5px_30px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        {effectiveFormat === 'individual'
                            ? <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/10 blur-[60px] rounded-full" />
                            : <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 blur-[60px] rounded-full" />
                        }
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-white font-bold font-display text-sm uppercase tracking-wider">Summary</h3>
                            </div>

                            <div className="space-y-1.5 mb-3 text-xs">
                                {selectedSlot ? (
                                    <>
                                        <SummaryRow label="Lesson" value={selectedSlot.topic} truncate />
                                        <SummaryRow label="Coach" value={getCoachById(selectedSlot.coachId)?.name || '—'} />
                                        <SummaryRow label="Date" value={
                                            new Date(selectedSlot.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                                        } />
                                        <SummaryRow label="Time" value={getLocalTime(selectedSlot.time, selectedSlot.date, timezone) + ` (${getTimezoneOffset(timezone)})`} />
                                        {futureSessions.length > 0 && (
                                            <SummaryRow label="Next" value={
                                                new Date(futureSessions[0].date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                + ' at ' + getLocalTime(futureSessions[0].time, futureSessions[0].date, timezone)
                                            } />
                                        )}
                                    </>
                                ) : (
                                    <SummaryRow label="Lessons" value="Not selected" warn />
                                )}

                                {/* Pricing Options Toggle */}
                                <div className="border-t border-white/5 pt-3 mt-3">
                                    <div className="flex gap-2 mb-3 bg-white/5 p-1 rounded-lg border border-white/5">
                                        <button
                                            onClick={() => setBillingInterval('monthly')}
                                            className={`flex-1 text-[11px] font-bold py-1.5 rounded-md transition-all ${billingInterval === 'monthly' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            Monthly
                                        </button>
                                        <button
                                            onClick={() => setBillingInterval('yearly')}
                                            className={`flex-1 text-[11px] font-bold py-1.5 rounded-md transition-all ${billingInterval === 'yearly' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            Yearly (Save)
                                        </button>
                                    </div>

                                    {selectedSlot ? (
                                        <>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-slate-400">Price</span>
                                                <span className="text-lg font-bold text-white flex items-end gap-1">
                                                    {currentPricing?.currency}{billingInterval === 'yearly' ? (effectiveFormat === 'individual' ? 149 : 89) : currentPricing?.monthly}
                                                    <span className="text-[10px] text-slate-500 font-normal pb-0.5">/mo</span>
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                                                <span>{billingInterval === 'yearly' ? 'billed annually' : 'billed monthly'}</span>
                                                {billingInterval === 'yearly' ? (
                                                    <span className="text-emerald-400 font-medium">Best value (save €120)</span>
                                                ) : (
                                                    <span>Full flexibility (cancel anytime)</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1.5 mt-3">
                                                <Zap size={11} className="text-emerald-400 shrink-0" />
                                                <span className="text-[10px] text-emerald-300 font-medium">
                                                    {(effectiveFormat === 'individual' && billingInterval === 'yearly') ? '7-day money-back guarantee' : '7-day free trial — no charge today'}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex justify-between items-center text-slate-500 text-[10px]">
                                            <span>Select a lesson for pricing</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button size="lg" fullWidth
                                themeColor={effectiveFormat === 'individual' ? '#8B5CF6' : '#F59E0B'}
                                onClick={handleCheckout} disabled={!canProceed}
                                className={!canProceed ? 'opacity-50 cursor-not-allowed' : `hover:scale-[1.02] active:scale-[0.98] transition-transform ${effectiveFormat === 'individual' ? 'hover-glow-violet-strong' : 'hover-glow-amber-strong'}`}>
                                {selectedSlot ? ((effectiveFormat === 'individual' && billingInterval === 'yearly') ? 'Start Yearly Plan' : 'Start Free Trial') : 'Select Lesson'}
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
            className={`w-full text-left p-3 rounded-xl border relative hover:z-10 overflow-hidden group transition-all duration-300 ${isSelected
                ? isIndividual
                    ? 'bg-violet-500/10 border-violet-500/40 hover-glow-violet-strong'
                    : 'bg-amber-500/10 border-amber-500/40 hover-glow-amber-strong'
                : 'bg-[#0B101B] border-white/5 hover-glow-white-strong hover:bg-[#0B101B]/90'
                }`}>
            <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-white font-bold text-sm font-display">{localTime}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${isIndividual ? 'bg-violet-500/20 text-violet-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {isIndividual ? '1:1 Session' : 'Group'}
                        </span>
                        <span className="text-[10px] font-bold text-amber-500/90 tracking-wide uppercase ml-1">
                            Lesson {slot.lessonNumber}
                        </span>
                        {slot.isEntryPoint && <Star size={10} className="text-amber-400 ml-auto" fill="currentColor" />}
                    </div>
                    <div className="text-sm text-slate-200 font-medium leading-snug group-hover:text-white transition-colors mb-2 pr-4">{slot.topic}</div>
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
const ProfileTag: React.FC<{ value: string; highlight?: string }> = ({ value, highlight }) => {
    const isViolet = highlight === 'individual';
    const isAmber = highlight === 'group';
    return (
        <div className={`text-[9px] font-bold px-2 py-1 rounded border ${isViolet ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' : isAmber ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-white/5 border-white/10 text-slate-300'}`}>
            {value}
        </div>
    );
};

const SummaryRow: React.FC<{ label: string; value: string; warn?: boolean; truncate?: boolean }> = ({ label, value, warn, truncate }) => (
    <div className="flex justify-between items-center gap-2">
        <span className="text-slate-400 shrink-0">{label}</span>
        <span className={`font-medium text-right ${warn ? 'text-red-400/70' : 'text-white'} ${truncate ? 'truncate max-w-[160px]' : ''}`}>{value}</span>
    </div>
);

export default StandardPlanPage;
