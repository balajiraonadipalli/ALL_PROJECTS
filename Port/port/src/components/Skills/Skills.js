import React, { useState } from "react";
import "./Skills.css";

const skillsData = {
    "Frontend": ["HTML5", "CSS3", "Tailwind CSS", "NativeWind", "React.js", "React Native", "Responsive Design"],
    "Backend": ["Node.js", "Express.js", "RESTful API", "JWT/Auth", "Rate Limiting"],
    "Database": ["MongoDB", "MySQL", "Schema Design"],
    "DevOps": ["GitHub Actions", "Google Cloud", "Vercel", "Render", "CI/CD"],
    "Tools": ["Git", "GitHub", "VS Code", "Postman"],
    "Languages": ["JavaScript (ES6+)", "TypeScript", "Java", "Python", "C"]
};

const Skills = () => {
    const [showSkills, setShowSkills] = useState(false);

    return (
        <section className="skills-section" id="skills">
            <div className="skills-container">
                <h2 className="section-title">My Technical Arsenal</h2>

                {!showSkills && (
                    <div className="skills-intro">
                        <button
                            className="show-skills-btn"
                            onClick={() => setShowSkills(true)}
                        >
                            Show My Skills 🚀
                        </button>
                    </div>
                )}

                {showSkills && (
                    <div className="buckets-container">
                        {Object.entries(skillsData).map(([category, skills], catIndex) => (
                            <div key={category} className="bucket">
                                <h3 className="bucket-title">{category}</h3>
                                <div className="bucket-content">
                                    {skills.map((skill, index) => {
                                        // Random start position for "fly-in" effect
                                        // We set these as CSS variables
                                        const randomX = Math.floor(Math.random() * 2000) - 1000; // -1000px to 1000px
                                        const randomY = Math.floor(Math.random() * 1000) - 500;  // -500px to 500px

                                        return (
                                            <span
                                                key={skill}
                                                className="skill-badge"
                                                style={{
                                                    "--x": `${randomX}px`,
                                                    "--y": `${randomY}px`,
                                                    "--i": index + (catIndex * 5) // Stagger delay
                                                }}
                                            >
                                                {skill}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;
