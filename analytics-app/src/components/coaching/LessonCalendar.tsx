import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, Users, User } from 'lucide-react';
import type { LessonSlot } from './mockData';
import { getCoachById, LANGUAGE_FLAGS } from './mockData';
import Badge from '../ui/Badge';

interface LessonCalendarProps {
    slots: LessonSlot[];
    onSelectSlot: (slot: LessonSlot) => void;
    selectedSlotId: string | null;
    entryPointOnly?: boolean;
    formatFilter?: 'all' | 'group' | 'individual';
    levelFilter?: 'all' | 'beginner' | 'intermediate';
    timezone?: string;
    onDateClick?: (dateStr: string) => void;
    hideExpansion?: boolean;
    /** The date currently selected/expanded by the user (gold border) */
    selectedDate?: string | null;
    /** Dates to highlight (e.g. future sessions with same coach/topic) */
    highlightDates?: Set<string>;
    /** The date where the user booked their first lesson (small indicator) */
    bookedDate?: string | null;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const LessonCalendar: React.FC<LessonCalendarProps> = ({
    slots, onSelectSlot, selectedSlotId, entryPointOnly, timezone,
    formatFilter = 'all', levelFilter = 'all', onDateClick, hideExpansion = false,
    selectedDate: externalSelectedDate, highlightDates, bookedDate
}) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [expandedDate, setExpandedDate] = useState<string | null>(todayStr);

    // Use external selectedDate if provided, otherwise use internal expandedDate
    const activeSelectedDate = externalSelectedDate !== undefined ? externalSelectedDate : expandedDate;

    // 1. Map slots to local timezone
    const localSlots = useMemo(() => {
        return slots.map(slot => {
            const isoString = `${slot.date}T${slot.time}:00+01:00`;
            try {
                const dateObj = new Date(isoString);
                const formatter = new Intl.DateTimeFormat('en-CA', {
                    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit'
                });
                const localDateStr = formatter.format(dateObj);
                const localTimeStr = dateObj.toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone
                });
                return { ...slot, localDate: localDateStr, localTime: localTimeStr, originalSlot: slot };
            } catch {
                return { ...slot, localDate: slot.date, localTime: slot.time, originalSlot: slot };
            }
        });
    }, [slots, timezone]);

    const filteredSlots = useMemo(() => {
        let filtered = localSlots;
        if (entryPointOnly) filtered = filtered.filter(s => s.isEntryPoint);
        if (formatFilter !== 'all') filtered = filtered.filter(s => s.format === formatFilter);
        if (levelFilter !== 'all') filtered = filtered.filter(s => s.level === levelFilter || s.level === 'all');
        return filtered;
    }, [localSlots, entryPointOnly, formatFilter, levelFilter]);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayRaw = new Date(currentYear, currentMonth, 1).getDay();
    const firstDay = firstDayRaw === 0 ? 6 : firstDayRaw - 1;

    const getLessonsForDate = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return filteredSlots.filter(s => s.localDate === dateStr);
    };

    const goToPrevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    };

    const handleDayClick = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const lessons = getLessonsForDate(day);
        if (lessons.length > 0) {
            // If clicking the already-selected date, do nothing (don't deselect)
            if (activeSelectedDate === dateStr) {
                // Still fire onDateClick to refresh schedule
                if (onDateClick) onDateClick(dateStr);
                return;
            }
            setExpandedDate(dateStr);
            if (onDateClick) onDateClick(dateStr);
        }
    };

    // Build calendar grid
    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);
    while (calendarDays.length % 7 !== 0) calendarDays.push(null);

    const expandedDateLessons = expandedDate ? filteredSlots.filter(s => s.localDate === expandedDate) : [];

    return (
        <div>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-3 bg-white/5 p-1.5 rounded-xl border border-white/10">
                <button onClick={goToPrevMonth} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={18} />
                </button>
                <h3 className="text-sm font-bold text-white min-w-[140px] text-center font-display">
                    {MONTH_NAMES[currentMonth]} {currentYear}
                </h3>
                <button onClick={goToNextMonth} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[9px] text-slate-500 mb-2 font-medium uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" /> Group</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" /> Individual</span>
                <span className="flex items-center gap-1.5"><Star size={10} className="text-amber-400" /> Entry Point</span>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
                {DAY_NAMES.map(d => (
                    <div key={d} className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest py-0.5">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} className="aspect-square" />;

                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const lessons = getLessonsForDate(day);
                    const hasLessons = lessons.length > 0;
                    const isToday = dateStr === todayStr;
                    const isSelected = activeSelectedDate === dateStr;
                    const isPast = new Date(dateStr) < new Date(todayStr);
                    const hasEntryPoint = lessons.some(l => l.isEntryPoint);
                    const hasGroup = lessons.some(l => l.format === 'group');
                    const hasIndividual = lessons.some(l => l.format === 'individual');
                    const isHighlighted = highlightDates?.has(dateStr) ?? false;
                    const isBooked = bookedDate === dateStr;

                    return (
                        <button
                            key={`day-${day}`}
                            onClick={() => handleDayClick(day)}
                            disabled={!hasLessons || isPast}
                            className={`
                                aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-300 group
                                ${isPast ? 'opacity-20 cursor-not-allowed' : ''}
                                ${hasLessons && !isPast ? 'cursor-pointer bg-white/[0.03] border hover-glow-white-strong' : 'cursor-default opacity-50'}
                                ${isSelected
                                    ? 'ring-2 ring-amber-500 bg-amber-500/15 border-amber-500/50 hover-glow-amber-strong'
                                    : isHighlighted
                                        ? 'bg-emerald-500/10 border-emerald-500/30 hover-glow-emerald-strong'
                                        : isBooked
                                            ? 'bg-amber-500/10 border-amber-500/30 hover-glow-amber-strong'
                                            : hasLessons && !isPast ? 'border-white/5' : ''
                                }
                            `}
                        >
                            {/* Booked indicator (small pin) */}
                            {isBooked && !isSelected && (
                                <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                            )}
                            <span className={`text-xs font-bold font-display ${isSelected ? 'text-amber-300'
                                : isToday ? 'text-amber-400'
                                    : isHighlighted ? 'text-emerald-400'
                                        : 'text-slate-400 group-hover:text-white'
                                }`}>
                                {day}
                            </span>
                            {hasLessons && (
                                <div className="flex items-center gap-0.5 mt-1.5">
                                    {hasGroup && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm" />}
                                    {hasIndividual && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-sm" />}
                                    {lessons.length > 2 && <span className="text-[8px] text-slate-500 ml-0.5">+{lessons.length - 2}</span>}
                                </div>
                            )}
                            {hasEntryPoint && !isPast && (
                                <div className="absolute top-1 right-1">
                                    <Star size={8} className="text-amber-400/80" fill="currentColor" />
                                </div>
                            )}
                            {/* Highlight dot for future sessions */}
                            {isHighlighted && !isSelected && !isBooked && (
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Expanded Day Slots (inline under calendar — only if hideExpansion is false) */}
            {!hideExpansion && expandedDate && expandedDateLessons.length > 0 && (
                <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {new Date(expandedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="text-[10px] text-slate-500">
                            {expandedDateLessons.length} sessions available
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        {expandedDateLessons.map(slot => {
                            const coach = getCoachById(slot.coachId);
                            const isSlotSelected = selectedSlotId === slot.id;
                            const isIndividual = slot.format === 'individual';
                            const seatsLeft = slot.seatsTotal - slot.seatsTaken;

                            return (
                                <button
                                    key={slot.id}
                                    onClick={() => onSelectSlot(slot.originalSlot)}
                                    className={`w-full text-left p-4 rounded-xl border relative overflow-hidden ${isSlotSelected
                                        ? isIndividual
                                            ? 'bg-violet-500/10 border-violet-500/50 hover-glow-violet-strong'
                                            : 'bg-amber-500/10 border-amber-500/50 hover-glow-amber-strong'
                                        : 'bg-white/[0.03] border-white/5 hover-glow-white-strong'
                                        }`}
                                >
                                    {isSlotSelected && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 animate-shimmer" />}

                                    <div className="flex items-start justify-between mb-3 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-white font-bold text-lg font-display">
                                                <Clock size={14} className="text-slate-500" />
                                                {slot.localTime}
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${isIndividual
                                                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/20'
                                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                {isIndividual ? <User size={9} /> : <Users size={9} />}
                                                {isIndividual ? '1:1' : 'Group'}
                                            </span>
                                            {!isIndividual && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${slot.level === 'beginner' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                                    slot.level === 'intermediate' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                                                        'bg-slate-500/20 text-slate-400'
                                                    }`}>
                                                    {slot.level}
                                                </span>
                                            )}
                                        </div>
                                        {isIndividual
                                            ? <Badge type="connected" label="Available" />
                                            : <Badge type={seatsLeft <= 2 ? 'high' : 'neutral'} label={`${seatsLeft} left`} />
                                        }
                                    </div>

                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <div className="font-bold text-white text-sm mb-0.5">{slot.group}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-2">
                                                {!isIndividual && (
                                                    <>
                                                        <span>Lesson {slot.lessonNumber}/{slot.totalLessons}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                                                    </>
                                                )}
                                                <span>{slot.topic}</span>
                                            </div>
                                        </div>

                                        {coach && (
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-300 font-medium text-right">{coach.name}</span>
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-[10px] text-white font-bold">
                                                        {coach.name.charAt(0)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="text-[10px] text-slate-500">{LANGUAGE_FLAGS[slot.language]} {slot.language.toUpperCase()}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonCalendar;
