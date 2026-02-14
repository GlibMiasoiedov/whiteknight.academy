/**
 * WK Calendar Widget - Pre-compiled (No Babel Required)
 * Converted from JSX to pure JavaScript for performance
 */
(function () {
    'use strict';

    const containers = document.querySelectorAll('.wk-calendar-widget-container');
    let rootElement = null;

    for (let i = 0; i < containers.length; i++) {
        if (!containers[i].dataset.reactInitialized) {
            rootElement = containers[i];
            break;
        }
    }
    if (!rootElement) return;
    rootElement.dataset.reactInitialized = "true";

    const { useState, useEffect, useRef, useMemo, createElement: h } = React;

    const API_BASE_URL = "https://whiteknight.academy/wp-json/tribe/events/v1/events";

    const CATEGORY_CONFIG = {
        beginner: { dotClass: 'green', badgeClass: 'beginner', url: 'https://whiteknight.academy/courses/chess-online-lessons-standard-plan/', label: 'Beginner' },
        middle: { dotClass: 'pink', badgeClass: 'middle', url: 'https://whiteknight.academy/courses/chess-online-lessons-standard-plan/', label: 'Middle' },
        elite: { dotClass: 'yellow', badgeClass: 'elite', url: 'https://whiteknight.academy/courses/chess-online-lessons-elite-plan/', label: 'Elite' },
        trial: { dotClass: 'slate', badgeClass: 'trial', url: 'https://whiteknight.academy/courses/chess-online-lessons-trial-class/', label: 'Trial' },
        default: { dotClass: 'accent', badgeClass: 'trial', url: null, label: 'Event' }
    };

    const TABS = [
        { slug: 'all', label: 'All', dotClass: 'all' },
        { slug: 'beginner', label: 'Beginner', dotClass: 'green' },
        { slug: 'middle', label: 'Middle', dotClass: 'pink' },
        { slug: 'elite', label: 'Elite', dotClass: 'yellow' },
        { slug: 'trial', label: 'Trial', dotClass: 'slate' },
    ];

    const TIMEZONE_CITIES = [
        { city: 'Los Angeles', value: 'America/Los_Angeles' },
        { city: 'New York', value: 'America/New_York' },
        { city: 'London', value: 'Europe/London' },
        { city: 'Warsaw', value: 'Europe/Warsaw' },
        { city: 'Kyiv', value: 'Europe/Kyiv' },
        { city: 'Dubai', value: 'Asia/Dubai' },
        { city: 'Singapore', value: 'Asia/Singapore' },
        { city: 'Tokyo', value: 'Asia/Tokyo' },
        { city: 'Sydney', value: 'Australia/Sydney' },
    ];

    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // SVG Icons as functions
    const ChevronLeftIcon = () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'm15 18-6-6 6-6' })
    );

    const ChevronRightIcon = () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'm9 18 6-6-6-6' })
    );

    const CalendarIcon = () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'wk-icon' },
        h('rect', { width: 18, height: 18, x: 3, y: 4, rx: 2, ry: 2 }),
        h('line', { x1: 16, x2: 16, y1: 2, y2: 6 }),
        h('line', { x1: 8, x2: 8, y1: 2, y2: 6 }),
        h('line', { x1: 3, x2: 21, y1: 10, y2: 10 })
    );

    const ClockIcon = () => h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'wk-icon' },
        h('circle', { cx: 12, cy: 12, r: 10 }),
        h('polyline', { points: '12 6 12 12 16 14' })
    );

    const MapPinIcon = () => h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'wk-icon' },
        h('path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' }),
        h('circle', { cx: 12, cy: 10, r: 3 })
    );

    const GlobeIcon = () => h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'wk-icon' },
        h('circle', { cx: 12, cy: 12, r: 10 }),
        h('line', { x1: 2, x2: 22, y1: 12, y2: 12 }),
        h('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
    );

    const RefreshIcon = () => h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'wk-spinner' },
        h('path', { d: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' }),
        h('path', { d: 'M21 3v5h-5' }),
        h('path', { d: 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' }),
        h('path', { d: 'M8 16H3v5' })
    );

    const SearchIcon = () => h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('circle', { cx: 11, cy: 11, r: 8 }),
        h('path', { d: 'm21 21-4.3-4.3' })
    );

    const CheckIcon = () => h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'wk-tz-check' },
        h('polyline', { points: '20 6 9 17 4 12' })
    );

    const UserIcon = () => h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'wk-icon' },
        h('path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }),
        h('circle', { cx: 12, cy: 7, r: 4 })
    );

    const LinkIcon = () => h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'wk-icon' },
        h('path', { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }),
        h('path', { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' })
    );

    // Countdown Timer Component
    function CountdownTimer({ targetDate, now }) {
        const timeDiff = targetDate.getTime() - now.getTime();
        if (timeDiff <= 0) return null;

        const seconds = Math.floor((timeDiff / 1000) % 60);
        const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const pad = (n) => n < 10 ? '0' + n : n;

        if (days > 0) {
            return h('span', { className: 'wk-timer' }, 'Starts in: ' + days + 'd ' + pad(hours) + 'h');
        } else {
            return h('span', { className: 'wk-timer urgent' }, 'Starts in: ' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds));
        }
    }

    function App() {
        const [now, setNow] = useState(new Date());
        const [currentDate, setCurrentDate] = useState(new Date());
        const [selectedDate, setSelectedDate] = useState(new Date());
        const [activeCategory, setActiveCategory] = useState(TABS[0].slug);
        const [events, setEvents] = useState([]);
        const [loading, setLoading] = useState(true);
        const [selectedTimezone, setSelectedTimezone] = useState('Europe/Warsaw');
        const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
        const timezoneRef = useRef(null);

        useEffect(() => {
            const interval = setInterval(() => setNow(new Date()), 1000);
            return () => clearInterval(interval);
        }, []);

        const getTimezoneLabel = (timezoneValue, cityName) => {
            try {
                const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezoneValue, timeZoneName: 'shortOffset' }).formatToParts(new Date());
                const offsetPart = parts.find(p => p.type === 'timeZoneName');
                let utcOffset = (offsetPart ? offsetPart.value : '').replace('GMT', 'UTC');
                if (utcOffset === 'UTC') utcOffset = 'UTC+0';
                return utcOffset + ' ' + cityName;
            } catch (e) { return cityName; }
        };

        const timezoneOptions = useMemo(() => TIMEZONE_CITIES.map(tz => ({ ...tz, label: getTimezoneLabel(tz.value, tz.city) })), []);

        useEffect(() => { fetchEvents(); }, [currentDate.getMonth(), activeCategory]);

        useEffect(() => {
            function handleClickOutside(event) {
                if (timezoneRef.current && !timezoneRef.current.contains(event.target)) setIsTimezoneOpen(false);
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, [timezoneRef]);

        const getStyleAndLinkForEvent = (categories) => {
            if (!categories || categories.length === 0) return CATEGORY_CONFIG.default;
            const slugs = categories.map(c => c.slug.toLowerCase());
            const names = categories.map(c => c.name);
            if (slugs.some(s => s.includes('trial'))) return { ...CATEGORY_CONFIG.trial, labelName: 'Trial' };
            if (slugs.some(s => s.includes('elite'))) return { ...CATEGORY_CONFIG.elite, labelName: 'Elite' };
            if (slugs.some(s => s.includes('middle'))) return { ...CATEGORY_CONFIG.middle, labelName: 'Middle' };
            if (slugs.some(s => s.includes('beginner'))) return { ...CATEGORY_CONFIG.beginner, labelName: 'Beginner' };
            return { ...CATEGORY_CONFIG.default, labelName: names[0] };
        };

        const formatTimeInZone = (date, timezone) => {
            try {
                return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: timezone, hour12: false }).format(date);
            } catch (e) { return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); }
        };

        const parseEventDateManual = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return new Date();
            const parts = dateStr.split(/[- :T]/).map(p => parseInt(p, 10));
            if (parts.length >= 3 && !parts.some(isNaN)) {
                return new Date(parts[0], parts[1] - 1, parts[2], parts[3] || 0, parts[4] || 0, parts[5] || 0);
            }
            return new Date();
        };

        const fetchEvents = async () => {
            setLoading(true);
            try {
                let url = API_BASE_URL + '?per_page=100';
                if (activeCategory !== 'all') url += '&categories=' + activeCategory;
                const response = await fetch(url);
                if (!response.ok) throw new Error("API Error");
                const data = await response.json();

                if (data.events) {
                    const stripHtml = (html) => { const tmp = document.createElement("DIV"); tmp.innerHTML = html; return tmp.textContent || tmp.innerText || ""; };
                    const formattedEvents = data.events.map(event => {
                        const startDate = parseEventDateManual(event.start_date);
                        const endDate = parseEventDateManual(event.end_date);
                        const styleConfig = getStyleAndLinkForEvent(event.categories);
                        let description = event.excerpt ? stripHtml(event.excerpt) : (event.description ? stripHtml(event.description) : '');
                        description = description.replace(/\s+/g, ' ').trim();
                        let organizer = event.organizer && event.organizer.length > 0 ? event.organizer.map(o => o.organizer).join(', ') : null;
                        let customFields = [];
                        if (event.custom_fields) {
                            Object.entries(event.custom_fields).forEach(([key, value]) => {
                                if (value && value !== '0' && value !== 0) customFields.push({ key, value });
                            });
                        }
                        return {
                            id: event.id, title: event.title, rawStartDate: startDate, rawEndDate: endDate, date: startDate,
                            categoryLabel: styleConfig.labelName, badgeClass: styleConfig.badgeClass, dotClass: styleConfig.dotClass,
                            url: styleConfig.url || event.url, location: event.venue ? event.venue.venue : null,
                            description, organizer, website: event.website || null, customFields
                        };
                    });
                    setEvents(formattedEvents);
                } else { setEvents([]); }
            } catch (err) { console.error("Fetch error:", err); }
            finally { setLoading(false); }
        };

        const upcomingEvents = useMemo(() => events.filter(ev => ev.rawStartDate.getTime() > now.getTime()), [events, now]);

        const jumpToNextEvent = () => {
            const futureEvents = upcomingEvents.sort((a, b) => a.date - b.date);
            if (futureEvents.length > 0) {
                const nextEvent = futureEvents[0];
                setCurrentDate(new Date(nextEvent.date));
                setSelectedDate(new Date(nextEvent.date));
            } else {
                const nextMonth = new Date(currentDate);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setCurrentDate(nextMonth);
            }
        };

        const getDaysInMonth = (date) => {
            const year = date.getFullYear(), month = date.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            let firstDayOfWeek = new Date(year, month, 1).getDay();
            if (firstDayOfWeek === 0) firstDayOfWeek = 7;
            const emptySlots = firstDayOfWeek - 1;
            const days = [];
            for (let i = 0; i < emptySlots; i++) days.push(null);
            for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
            return days;
        };

        const days = getDaysInMonth(currentDate);
        const isSameDay = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
        const isPastDate = (date) => { if (!date) return false; const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0); const checkDate = new Date(date); checkDate.setHours(0, 0, 0, 0); return checkDate < todayStart; };
        const isToday = (date) => date && isSameDay(date, now);
        const isSelected = (date) => date && isSameDay(date, selectedDate);
        const getEventsForDate = (date) => date ? upcomingEvents.filter(event => isSameDay(event.date, date)) : [];

        const selectedDayEvents = getEventsForDate(selectedDate);
        const formattedSelectedDate = selectedDate.getDate() + ' ' + MONTHS[selectedDate.getMonth()].slice(0, 3) + ', ' + WEEKDAYS[(selectedDate.getDay() + 6) % 7];
        const activeOption = timezoneOptions.find(tz => tz.value === selectedTimezone);
        const activeTimezoneLabel = activeOption ? activeOption.label : selectedTimezone;

        // Render calendar days
        const renderDays = () => days.map((date, index) => {
            if (!date) return h('div', { key: 'empty-' + index, className: 'wk-day empty' });
            const dayEvents = getEventsForDate(date);
            const hasEvents = dayEvents.length > 0;
            const isPast = isPastDate(date);
            const uniqueDots = [...new Set(dayEvents.map(e => e.dotClass))];
            const sortOrder = ['green', 'pink', 'yellow', 'slate', 'accent'];
            uniqueDots.sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b));
            let cellClass = 'wk-day';
            if (isPast) cellClass += ' past';
            else if (isSelected(date)) cellClass += ' selected';
            else if (isToday(date)) cellClass += ' today';

            return h('button', { key: index, className: cellClass, onClick: () => !isPast && setSelectedDate(date) },
                h('span', { className: 'wk-day-num' }, date.getDate()),
                hasEvents && !isPast && h('div', { className: 'wk-dots' },
                    uniqueDots.slice(0, 4).map((dotClass, i) => h('span', { key: i, className: 'wk-dot ' + dotClass }))
                )
            );
        });

        // Render event cards
        const renderEventCards = () => selectedDayEvents.map(event => {
            const timeString = formatTimeInZone(event.rawStartDate, selectedTimezone) + ' - ' + formatTimeInZone(event.rawEndDate, selectedTimezone);
            return h('a', { href: event.url, target: '_blank', rel: 'noopener noreferrer', key: event.id, className: 'wk-card' },
                h('div', { className: 'wk-card-header' },
                    h('span', { className: 'wk-badge ' + event.badgeClass }, event.categoryLabel),
                    h(CountdownTimer, { targetDate: event.rawStartDate, now })
                ),
                h('h4', { className: 'wk-card-title' }, event.title),
                event.description && h('p', { className: 'wk-card-desc' }, event.description),
                h('div', { className: 'wk-card-info' },
                    h('div', { className: 'wk-info-item' }, h(ClockIcon), h('span', null, timeString)),
                    event.location && h('div', { className: 'wk-info-item' }, h(MapPinIcon), h('span', null, event.location)),
                    event.organizer && h('div', { className: 'wk-info-item' }, h(UserIcon), h('span', null, event.organizer)),
                    event.website && h('div', { className: 'wk-info-item' }, h(LinkIcon), h('span', null, 'Website'))
                ),
                event.customFields && event.customFields.length > 0 && h('div', { className: 'wk-custom-fields' },
                    event.customFields.map((field, idx) => h('div', { key: idx, className: 'wk-custom-field' },
                        h('span', { className: 'wk-cf-label' }, field.key.replace(/_/g, ' ')),
                        h('span', { className: 'wk-cf-value' }, field.value)
                    ))
                )
            );
        });

        return h('div', { className: 'wk-main' },
            // LEFT PANEL
            h('div', { className: 'wk-left' },
                h('div', { className: 'wk-header' },
                    h('div', { className: 'wk-header-top' },
                        h('div', null,
                            h('h2', { className: 'wk-title' }, MONTHS[currentDate.getMonth()] + ' ' + currentDate.getFullYear()),
                            h('p', { className: 'wk-subtitle' }, loading ? 'Syncing...' : 'Select a date')
                        ),
                        h('div', { className: 'wk-controls' },
                            h('div', { className: 'wk-nav' },
                                h('button', { className: 'wk-nav-btn', onClick: () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)) }, h(ChevronLeftIcon)),
                                h('button', { className: 'wk-today-btn', onClick: () => { const t = new Date(); setCurrentDate(t); setSelectedDate(t); } }, 'Today'),
                                h('button', { className: 'wk-nav-btn', onClick: () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)) }, h(ChevronRightIcon))
                            ),
                            h('div', { className: 'wk-tz-wrap', ref: timezoneRef },
                                h('button', { className: 'wk-tz-btn', onClick: () => setIsTimezoneOpen(!isTimezoneOpen) },
                                    h('span', { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
                                        h(GlobeIcon),
                                        h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, activeTimezoneLabel)
                                    ),
                                    h('span', { style: { transform: isTimezoneOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', fontSize: '12px' } }, '›')
                                ),
                                isTimezoneOpen && h('div', { className: 'wk-tz-dropdown' },
                                    timezoneOptions.map(tz => h('button', { key: tz.value, className: 'wk-tz-option' + (selectedTimezone === tz.value ? ' active' : ''), onClick: () => { setSelectedTimezone(tz.value); setIsTimezoneOpen(false); } },
                                        h('span', null, tz.label),
                                        selectedTimezone === tz.value && h(CheckIcon)
                                    ))
                                )
                            )
                        )
                    )
                ),
                h('div', { className: 'wk-tabs' },
                    TABS.map(cat => h('button', { key: cat.slug, className: 'wk-tab' + (activeCategory === cat.slug ? ' active' : ''), onClick: () => setActiveCategory(cat.slug) },
                        h('span', { className: 'wk-tab-dot ' + cat.dotClass }),
                        cat.label
                    ))
                ),
                h('div', { className: 'wk-weekdays' },
                    WEEKDAYS.map((day, index) => h('div', { key: index, className: 'wk-weekday' + (index >= 5 ? ' weekend' : '') }, day))
                ),
                h('div', { className: 'wk-grid' }, renderDays())
            ),
            // RIGHT PANEL
            h('div', { className: 'wk-right' },
                h('div', { className: 'wk-schedule-header' },
                    h('h3', { className: 'wk-schedule-title' }, h(CalendarIcon), ' Schedule'),
                    h('span', { className: 'wk-date-badge' }, formattedSelectedDate)
                ),
                loading && selectedDayEvents.length === 0
                    ? h('div', { className: 'wk-loading' }, h(RefreshIcon), h('span', { style: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' } }, 'Loading...'))
                    : selectedDayEvents.length > 0
                        ? h('div', { className: 'wk-events' }, renderEventCards())
                        : h('div', { className: 'wk-empty' },
                            h('div', { className: 'wk-empty-icon' }, h(CalendarIcon)),
                            h('p', { className: 'wk-empty-title' }, 'No events'),
                            h('p', { className: 'wk-empty-text' }, isToday(selectedDate) ? 'No upcoming classes today' : 'Select another date'),
                            h('button', { onClick: jumpToNextEvent, className: 'wk-find-btn' }, h(SearchIcon), ' Find Next Class')
                        ),
                h('div', { className: 'wk-footer' }, 'White Knight Academy © ' + new Date().getFullYear())
            )
        );
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(h(App));
})();
