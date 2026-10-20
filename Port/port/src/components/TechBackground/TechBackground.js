import React, { useEffect, useState } from 'react';
import './TechBackground.css';

const allTerms = [
    "HTML", "CSS", "JavaScript", "React", "Node.js",
    "MongoDB", "Firebase", "Python", "Git", "Docker",
    "API", "Algorithms", "Data Structures", "Redux", "Hooks",
    "SaaS", "Cloud", "DevOps", "JSON", "REST", "GraphQL",
    "Webpack", "Babel", "Vite", "Next.js", "Express", "SQL"
];

const TechBackground = () => {
    const [terms, setTerms] = useState([]);

    useEffect(() => {
        // Responsive count: fewer on mobile
        const count = window.innerWidth < 768 ? 12 : 25;

        // Create random particles
        const newTerms = [];
        for (let i = 0; i < count; i++) {
            const term = allTerms[i % allTerms.length];

            // Random Start Position (0-100%)
            const top = Math.random() * 100;
            const left = Math.random() * 100;

            // Random Movement Vector (-200px to +200px)
            const moveX = (Math.random() - 0.5) * 400;
            const moveY = (Math.random() - 0.5) * 400;

            // Random Duration & Delay
            const duration = 20 + Math.random() * 20; // 20-40s (Very slow)
            const delay = Math.random() * -20; // Start midway

            // Random Opacity & Size
            const opacity = 0.15 + Math.random() * 0.25; // 0.15 to 0.40 (More visible)
            const fontSize = 0.8 + Math.random() * 1.5; // 0.8rem to 2.3rem

            newTerms.push({
                id: i,
                text: term,
                style: {
                    top: `${top}%`,
                    left: `${left}%`,
                    '--moveX': `${moveX}px`,
                    '--moveY': `${moveY}px`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                    opacity: opacity,
                    fontSize: `${fontSize}rem`
                }
            });
        }
        setTerms(newTerms);

    }, []);

    return (
        <div className="tech-background">
            {terms.map((item) => (
                <span key={item.id} className="tech-word" style={item.style}>
                    {item.text}
                </span>
            ))}
        </div>
    );
};

export default TechBackground;
