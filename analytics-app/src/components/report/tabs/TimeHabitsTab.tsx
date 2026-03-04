import React from 'react';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import ActivityHeatmap from '../widgets/ActivityHeatmap';
import TimeManagement from '../widgets/TimeManagement';
import ConsistencyTilt from '../widgets/ConsistencyTilt';

interface TimeHabitsTabProps {
    onHint: (hint: string, data?: any) => void;
}

const TimeHabitsTab: React.FC<TimeHabitsTabProps> = ({ onHint }) => {
    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in pb-12">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h2 className={DASHBOARD_FONTS.h2}>Time & Habits</h2>
                <div className={DASHBOARD_FONTS.body + " max-w-3xl"}>
                    Analyze how your time management and playing habits affect your results. Discover your peak performance hours and track your consistency under pressure.
                </div>
            </div>

            {/* Widget Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Activity Heatmap (Large, takes full width on small screens, 8 cols on large) */}
                <div className="col-span-1 xl:col-span-8">
                    <ActivityHeatmap onHint={(data) => onHint('activity', data)} />
                </div>

                {/* Vertical Stack (or Side-by-Side paired) for smaller widgets */}
                {/* On XL screens: these stack in the remaining 4 cols */}
                {/* On <1440px screens: these are placed side-by-side in a 2-col CSS grid to match requested rules */}
                <div className="col-span-1 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    <TimeManagement onHint={() => onHint('time_management')} />
                    <ConsistencyTilt onHint={() => onHint('consistency')} />
                </div>

            </div>
        </div>
    );
};

export default TimeHabitsTab;
