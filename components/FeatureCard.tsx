import React, { ReactNode, useEffect, useRef } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onClick }) => {
    const cardRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const createSparkle = () => {
            const sparkle = document.createElement('span');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.animationDelay = `${Math.random() * 1.5}s`;
            sparkle.style.animationDuration = `${1 + Math.random()}s`;
            card.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, 1500);
        };

        const intervalId = setInterval(createSparkle, 500);
        return () => clearInterval(intervalId);

    }, []);

    return (
        <button 
            ref={cardRef} 
            onClick={onClick} 
            className={`sparkle-effect relative w-full h-full bg-[#262626] border border-[#666666] rounded-[8px] p-6 text-left hover:border-[#FF8C00] transition-all duration-300 transform hover:-translate-y-1`}
        >
             <div className="absolute top-4 right-4 text-white/50">
                <SparklesIcon className="w-5 h-5" />
             </div>
             <div className="relative">
                <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-[#1A1A1A] border border-[#666666]">
                    {icon}
                </div>
                <h3 className="font-['Montserrat'] font-semibold text-white">{title}</h3>
                <p className="text-[#F0F0F0] text-sm mt-1">{description}</p>
             </div>
        </button>
    );
};