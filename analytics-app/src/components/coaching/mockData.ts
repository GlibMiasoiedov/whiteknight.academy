// Mock data for coaching enrollment page
// All data will be replaced by API calls in the future

export interface Coach {
    id: string;
    name: string;
    title: string; // FM, WIM, IM, GM
    specialties: string[];
    languages: string[]; // ISO codes: 'en', 'ua', 'pl', 'zh'
    avatar?: string; // URL — placeholder for now
    bio: string;
}

export interface LessonSlot {
    id: string;
    date: string;          // ISO date: "2026-02-20"
    dayOfWeek: number;     // 0=Sun, 1=Mon, ...
    time: string;          // "14:00"
    duration: number;      // minutes
    group: string;         // Group name
    level: 'beginner' | 'intermediate' | 'all';
    lessonNumber: number;  // Current lesson # in cycle
    totalLessons: number;  // Total lessons in cycle
    topic: string;
    coachId: string;
    seatsTotal: number;
    seatsTaken: number;
    language: string;      // ISO code
    isEntryPoint: boolean; // true if Lesson #1
    format: 'group' | 'individual'; // lesson format
}

export interface Curriculum {
    level: 'beginner' | 'intermediate';
    lessons: {
        number: number;
        topic: string;
        reportCategory: string;
        isEntryPoint?: boolean;
    }[];
}

// ─── Coaches ─────────────────────────────────────────────

export const COACHES: Coach[] = [
    {
        id: 'glib',
        name: 'Glib Miasoed',
        title: 'FM',
        specialties: ['Tactics', 'Beginner Training', 'Youth Coaching'],
        languages: ['en', 'ua', 'pl'],
        bio: 'FIDE Master specializing in beginner and youth chess education. Patient, structured approach.',
    },
    {
        id: 'maria',
        name: 'Maria Kowalska',
        title: 'WIM',
        specialties: ['Endgames', 'Strategy', 'Tournament Prep'],
        languages: ['en', 'pl', 'zh'],
        bio: 'Woman International Master focused on endgame mastery and tournament preparation.',
    },
    {
        id: 'daniel',
        name: 'Daniel Fischer',
        title: 'IM',
        specialties: ['Openings', 'Time Management', 'Advanced Theory'],
        languages: ['en', 'zh'],
        bio: 'International Master with deep opening knowledge and competitive time management coaching.',
    },
];

export const getCoachById = (id: string): Coach | undefined => COACHES.find(c => c.id === id);

// ─── Language helpers ────────────────────────────────────

export const LANGUAGE_FLAGS: Record<string, string> = {
    en: '🇬🇧',
    ua: '🇺🇦',
    pl: '🇵🇱',
    zh: '🇨🇳',
};

export const LANGUAGE_LABELS: Record<string, string> = {
    en: 'English',
    ua: 'Українська',
    pl: 'Polski',
    zh: '中文',
};

// ─── Curricula ───────────────────────────────────────────

export const BEGINNER_CURRICULUM: Curriculum = {
    level: 'beginner',
    lessons: [
        { number: 1, topic: 'How the Pieces Move & Board Setup', reportCategory: 'entry', isEntryPoint: true },
        { number: 2, topic: 'Check, Checkmate & Stalemate', reportCategory: 'blunder-rate' },
        { number: 3, topic: 'Piece Values & Captures', reportCategory: 'accuracy' },
        { number: 4, topic: 'Basic Tactics: Forks', reportCategory: 'tactics', isEntryPoint: true },
        { number: 5, topic: 'Basic Tactics: Pins & Skewers', reportCategory: 'tactics' },
        { number: 6, topic: 'Safe Squares & Hanging Pieces', reportCategory: 'board-vision' },
        { number: 7, topic: 'Opening Principles', reportCategory: 'opening-accuracy', isEntryPoint: true },
        { number: 8, topic: 'Simple Checkmate Patterns', reportCategory: 'endgame' },
        { number: 9, topic: 'Intro to Pawn Endings', reportCategory: 'endgame' },
    ],
};

export const INTERMEDIATE_CURRICULUM: Curriculum = {
    level: 'intermediate',
    lessons: [
        { number: 1, topic: 'Time Management Basics', reportCategory: 'time-management', isEntryPoint: true },
        { number: 2, topic: 'Your First Full Game', reportCategory: 'accuracy' },
        { number: 3, topic: 'Review & Mini-Tournament', reportCategory: 'all' },
        { number: 4, topic: 'Tactical Combinations', reportCategory: 'tactics', isEntryPoint: true },
        { number: 5, topic: 'Advanced Pins & Deflections', reportCategory: 'tactics' },
        { number: 6, topic: 'Opening Repertoire: Solid White', reportCategory: 'opening-accuracy', isEntryPoint: true },
        { number: 7, topic: 'Opening Repertoire: Solid Black', reportCategory: 'opening-accuracy' },
        { number: 8, topic: 'Middlegame: Weak Squares & Outposts', reportCategory: 'middlegame', isEntryPoint: true },
        { number: 9, topic: 'Middlegame: Pawn Structure', reportCategory: 'middlegame' },
        { number: 10, topic: 'Rook Endgames: Lucena & Philidor', reportCategory: 'endgame', isEntryPoint: true },
        { number: 11, topic: 'Complex Endgames: Passed Pawns', reportCategory: 'endgame' },
        { number: 12, topic: 'Time Management Under Pressure', reportCategory: 'time-management' },
        { number: 13, topic: 'Calculation & Visualization', reportCategory: 'accuracy' },
        { number: 14, topic: 'Positional Sacrifices & Attack', reportCategory: 'middlegame' },
        { number: 15, topic: 'Tournament Game Review', reportCategory: 'all' },
    ],
};

// ─── Weekly Schedule Template ────────────────────────────

interface WeeklySlotTemplate {
    dayOfWeek: number; // 0=Sun, 1=Mon ... 6=Sat
    time: string;
    group: string;
    level: 'beginner' | 'intermediate' | 'all';
    coachId: string;
    language: string;
    curriculum: Curriculum;
    seatsTotal: number;
    format: 'group' | 'individual';
}

const WEEKLY_TEMPLATE: WeeklySlotTemplate[] = [
    // Monday — Group
    { dayOfWeek: 1, time: '10:00', group: 'Complete Beginner A', level: 'beginner', coachId: 'glib', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 1, time: '14:00', group: 'Intermediate Strategy', level: 'intermediate', coachId: 'maria', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 1, time: '18:00', group: 'Beginner Tactics (Evening)', level: 'beginner', coachId: 'daniel', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    // Monday — Individual
    { dayOfWeek: 1, time: '11:00', group: 'Individual Beginner', level: 'beginner', coachId: 'glib', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 1, format: 'individual' },
    { dayOfWeek: 1, time: '16:00', group: 'Individual Intermediate', level: 'intermediate', coachId: 'maria', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 1, format: 'individual' },
    // Tuesday — Group
    { dayOfWeek: 2, time: '10:00', group: 'Intermediate Openings', level: 'intermediate', coachId: 'daniel', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 2, time: '14:00', group: 'Beginner Tactics A', level: 'beginner', coachId: 'glib', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 2, time: '18:00', group: 'Intermediate Endgames', level: 'intermediate', coachId: 'maria', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 4, format: 'group' },
    // Tuesday — Individual
    { dayOfWeek: 2, time: '12:00', group: 'Individual Intermediate (Tue)', level: 'intermediate', coachId: 'daniel', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 1, format: 'individual' },
    // Wednesday — Group
    { dayOfWeek: 3, time: '10:00', group: 'Complete Beginner B', level: 'beginner', coachId: 'glib', language: 'ua', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 3, time: '14:00', group: 'Beginner Vision & Safety', level: 'beginner', coachId: 'maria', language: 'pl', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 3, time: '18:00', group: 'Intermediate Time Mgmt', level: 'intermediate', coachId: 'daniel', language: 'zh', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 4, format: 'group' },
    // Wednesday — Individual
    { dayOfWeek: 3, time: '11:00', group: 'Individual Beginner (Wed)', level: 'beginner', coachId: 'glib', language: 'ua', curriculum: BEGINNER_CURRICULUM, seatsTotal: 1, format: 'individual' },
    { dayOfWeek: 3, time: '16:00', group: 'Individual Intermediate (Wed)', level: 'intermediate', coachId: 'maria', language: 'pl', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 1, format: 'individual' },
    // Thursday — Group
    { dayOfWeek: 4, time: '10:00', group: 'Beginner Tactics B', level: 'beginner', coachId: 'daniel', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 4, time: '14:00', group: 'Complete Beginner C', level: 'beginner', coachId: 'glib', language: 'pl', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 4, time: '18:00', group: 'Intermediate Combinations', level: 'intermediate', coachId: 'maria', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 4, format: 'group' },
    // Thursday — Individual
    { dayOfWeek: 4, time: '15:00', group: 'Individual Intermediate (Thu)', level: 'intermediate', coachId: 'daniel', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 1, format: 'individual' },
    { dayOfWeek: 4, time: '20:00', group: 'Individual Beginner (Thu)', level: 'beginner', coachId: 'glib', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 1, format: 'individual' },
    // Friday — Group
    { dayOfWeek: 5, time: '10:00', group: 'Beginner Endgames', level: 'beginner', coachId: 'maria', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 5, time: '14:00', group: 'Intermediate Calculation', level: 'intermediate', coachId: 'daniel', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 5, time: '18:00', group: 'Beginner Practical Play', level: 'beginner', coachId: 'glib', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    // Friday — Individual
    { dayOfWeek: 5, time: '11:00', group: 'Individual Beginner (Fri)', level: 'beginner', coachId: 'glib', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 1, format: 'individual' },
    { dayOfWeek: 5, time: '16:00', group: 'Individual Intermediate (Fri)', level: 'intermediate', coachId: 'maria', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 1, format: 'individual' },
    // Saturday — Group
    { dayOfWeek: 6, time: '10:00', group: 'Complete Beginner (Weekend)', level: 'beginner', coachId: 'maria', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 6, time: '14:00', group: 'Intermediate Strategy (Weekend)', level: 'intermediate', coachId: 'daniel', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 6, time: '16:00', group: 'Beginner Tactics (Weekend)', level: 'beginner', coachId: 'glib', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    // Saturday — Individual
    { dayOfWeek: 6, time: '11:00', group: 'Individual Beginner (Sat)', level: 'beginner', coachId: 'maria', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 1, format: 'individual' },
    { dayOfWeek: 6, time: '15:00', group: 'Individual Intermediate (Sat)', level: 'intermediate', coachId: 'daniel', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 1, format: 'individual' },
    // Sunday — Group
    { dayOfWeek: 0, time: '10:00', group: 'Beginner Review & Tournament', level: 'beginner', coachId: 'glib', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 0, time: '14:00', group: 'Intermediate Review & Tournament', level: 'intermediate', coachId: 'maria', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 4, format: 'group' },
    { dayOfWeek: 0, time: '16:00', group: 'Open Practice Session', level: 'beginner', coachId: 'daniel', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 4, format: 'group' },
    // Sunday — Individual
    { dayOfWeek: 0, time: '11:00', group: 'Individual Beginner (Sun)', level: 'beginner', coachId: 'glib', language: 'en', curriculum: BEGINNER_CURRICULUM, seatsTotal: 1, format: 'individual' },
    { dayOfWeek: 0, time: '15:00', group: 'Individual Intermediate (Sun)', level: 'intermediate', coachId: 'maria', language: 'en', curriculum: INTERMEDIATE_CURRICULUM, seatsTotal: 1, format: 'individual' },
];

// ─── Generate concrete lesson slots for a date range ─────

function getDayOfWeekISO(date: Date): number {
    return date.getDay(); // 0=Sun, 1=Mon ... 6=Sat
}

// Each group tracks its own lesson counter independently
const groupCounters: Record<string, number> = {};

export function generateLessonSlots(startDate: string, endDate: string): LessonSlot[] {
    const slots: LessonSlot[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Reset counters
    Object.keys(groupCounters).forEach(k => delete groupCounters[k]);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = getDayOfWeekISO(d);
        const dateStr = d.toISOString().split('T')[0];

        const daySlots = WEEKLY_TEMPLATE.filter(t => t.dayOfWeek === dayOfWeek);

        for (const template of daySlots) {
            if (!groupCounters[template.group]) {
                groupCounters[template.group] = 0;
            }
            groupCounters[template.group]++;

            const isIndividual = template.format === 'individual';

            let topic: string;
            let lessonNumber: number;

            const totalLessons = template.curriculum.lessons.length;
            const lessonIndex = (groupCounters[template.group] - 1) % totalLessons;
            const lesson = template.curriculum.lessons[lessonIndex];
            topic = lesson.topic;
            lessonNumber = lesson.number;

            // Simulate some seats taken (deterministic based on date)
            const dateSeed = d.getDate() + d.getMonth() * 31;
            const seatsTaken = isIndividual
                ? 0
                : Math.min(template.seatsTotal - 1, Math.floor((dateSeed * 7 + template.time.charCodeAt(0)) % (template.seatsTotal)));

            slots.push({
                id: `${dateStr}-${template.time}-${template.group.replace(/\s+/g, '-').toLowerCase()}`,
                date: dateStr,
                dayOfWeek,
                time: template.time,
                duration: 50,
                group: template.group,
                level: template.level,
                lessonNumber,
                totalLessons,
                topic,
                coachId: template.coachId,
                seatsTotal: template.seatsTotal,
                seatsTaken,
                language: template.language,
                // Use the explicit isEntryPoint flag on the curriculum lesson
                isEntryPoint: !!lesson.isEntryPoint,
                format: template.format,
            });
        }
    }

    return slots;
}

// Pre-generated slots for Feb 19 – Mar 31, 2026
export const ALL_LESSON_SLOTS = generateLessonSlots('2026-02-19', '2026-03-31');

// ─── Pricing ─────────────────────────────────────────────

export const PRICING = {
    group: {
        monthly: 99,
        trialDays: 7,
        currency: '€',
        label: 'Group Lessons',
        features: [
            '4×50-minute live small-group coaching per month',
            'Beginner + Intermediate curriculum',
            'Interactive training platform (puzzles, drills)',
            'Progress tracking & training roadmap',
            'Coach support between lessons (Q&A)',
            'Weekly level-based tournaments',
        ],
    },
    individual: {
        monthly: 159,
        single: 49,
        currency: '€',
        label: 'Individual Lessons',
        features: [
            '4×50-minute private 1:1 coaching per month',
            'Fully personalized training plan',
            'Direct coach access between sessions',
            'All Group Lessons benefits included',
            'Game analysis & homework review',
            'Priority scheduling',
        ],
    },
};
