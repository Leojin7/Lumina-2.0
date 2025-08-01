import React from 'react';
import Card from './Card';
import { useUserStore } from '../stores/useUserStore';
import type { Mood } from '../types';
import { BarChart2 } from 'lucide-react';

const MoodTracker: React.FC = () => {
    const dailyCheckins = useUserStore(state => state.dailyCheckins);

    const moodColors: Record<Mood, string> = {
        awful: 'bg-rose-600',
        bad: 'bg-amber-500',
        ok: 'bg-lime-400',
        good: 'bg-emerald-400',
        great: 'bg-cyan-400',
    };
    
    const moodLegend = [
        { mood: 'awful', color: 'bg-rose-600' },
        { mood: 'bad', color: 'bg-amber-500' },
        { mood: 'ok', color: 'bg-lime-400' },
        { mood: 'good', color: 'bg-emerald-400' },
        { mood: 'great', color: 'bg-cyan-400' },
    ];

    const WEEKS_TO_SHOW = 17; // ~4 months
    const today = new Date();
    // Generate the last N days, from most recent to oldest
    const days = Array.from({ length: WEEKS_TO_SHOW * 7 }, (_, i) => {
        const d = new Date(today);
        d.setHours(0, 0, 0, 0); // Normalize date to prevent timezone issues
        d.setDate(d.getDate() - i);
        return d;
    }).reverse(); // Reverse to have dates from oldest to most recent
    
    const checkinsByDate = Object.fromEntries(dailyCheckins.map(c => [c.date, c]));
    const getDayKey = (date: Date) => date.toISOString().slice(0, 10);

    return (
        <Card title="Mood Flow">
            {dailyCheckins.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
                    <BarChart2 size={40} className="mb-4" />
                    <h3 className="font-semibold text-foreground">Log your mood daily</h3>
                    <p className="text-sm">Complete the daily check-in to see your trends here.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="grid grid-flow-col grid-rows-7 gap-1.5">
                        {days.map(day => {
                            const dayKey = getDayKey(day);
                            const checkin = checkinsByDate[dayKey];
                            const color = checkin ? moodColors[checkin.mood] : 'bg-muted/40';
                            
                            return (
                                <div key={dayKey} className="relative group">
                                    <div className={`w-full aspect-square rounded ${color} ${day > new Date() ? 'opacity-20' : ''}`}></div>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                        {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        {checkin && <span className="capitalize">: {checkin.mood}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-end items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>Less Positive</span>
                        {moodLegend.map(item => <div key={item.mood} className={`w-3 h-3 rounded ${item.color}`}></div>)}
                        <span>More Positive</span>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default MoodTracker;
