import {
    BedDouble,
    CheckSquare2,
    Dumbbell,
    Flame,
    GlassWater,
    Utensils,
} from "lucide-react";
import React, { useEffect, useState } from 'react';

const CustomLoadingSpinner: React.FC<{ className?: string }> = ({ className = "" }) => {
    const icons = [Flame, Dumbbell, GlassWater, Utensils, BedDouble, CheckSquare2];
    const [activeIconIndex, setActiveIconIndex] = useState(0);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setActiveIconIndex((current) => (current + 1) % icons.length);
        }, 500);

        return () => window.clearInterval(interval);
    }, [icons.length]);

    const ActiveIcon = icons[activeIconIndex];

    return <ActiveIcon size={32} className={`${className} text-brand-accent animate-pulse`} />;
}

export default CustomLoadingSpinner;