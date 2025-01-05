'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './BlueTerminal.module.css';

const portfolioData = {
  about: "hi, i'm a software developer with a passion for creating elegant and efficient solutions.",
  skills: ["javascript", "typescript", "react", "node.js", "python", "sql"],
  projects: [
    { 
      name: "TuneMerge", 
      description: "a web application for managing tasks and projects.",
      github: "https://github.com/surajssc1232/TuneMerge"
    },
    { 
      name: "RoyalAi", 
      description: "a mobile app for tracking fitness goals and progress.",
      github: "https://github.com/surajssc1232/RoyalAi"
    },
    { 
      name: "Weather Dashboard", 
      description: "a machine learning model for predicting stock prices.",
      github: "https://github.com/surajssc1232/WeatherDashboard"
    },
  ],
  contact: {
    email: "surajssc1232@gmail.com",
    github: "https://github.com/surajssc1232",
    linkedin: "linkedin.com/in/developer"
  },
  articles: [
    { title: "Understanding React Hooks", link: "https://example.com/react-hooks" },
    { title: "JavaScript ES6 Features", link: "https://example.com/es6-features" },
  ],
};

const initialOptions = [
  { command: 'about', description: 'learn more about me' },
  { command: 'skills', description: 'view my technical skills' },
  { command: 'projects', description: 'see my project portfolio' },
  { command: 'contact', description: 'get in touch with me' },
  { command: 'articles', description: 'read my articles' },
];

const shuffleString = (str: string) => {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
};

const scrambleText = (text: string, setter: (val: string) => void) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let count = 0;
  const total = 10; // total scramble iterations

  const scrambleInterval = setInterval(() => {
    count++;
    if (count >= total) {
      clearInterval(scrambleInterval);
      setter(text);
    } else {
      setter(
        text
          .split('')
          .map(char => (char === ' ' ? ' ' : letters[Math.floor(Math.random() * letters.length)]))
          .join('')
      );
    }
  }, 50);
};

const BlueTerminal: React.FC = () => {
  const [output, setOutput] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentView, setCurrentView] = useState<'menu' | 'content'>('menu');
  const outputRef = useRef<HTMLDivElement>(null);
  const [heading, setHeading] = useState('Suraj Singh');
  const [selectedContactIndex, setSelectedContactIndex] = useState(-1);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(-1);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, currentView, selectedContactIndex, selectedProjectIndex, output]); // Add missing dependencies

  useEffect(() => {
    const interval = setInterval(() => {
      scrambleText('Suraj Singh', setHeading);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (currentView === 'menu') {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : initialOptions.length - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < initialOptions.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleCommand(initialOptions[selectedIndex].command);
        setCurrentView('content');
      }
    } else if (currentView === 'content') {
      if (e.key === 'Escape') {
        e.preventDefault();
        setCurrentView('menu');
        setOutput([]);
        setSelectedContactIndex(-1);
        setSelectedProjectIndex(-1);
      } else if (output.includes('contact:')) {
        // Contact page navigation
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedContactIndex(prev => (prev > 0 ? prev - 1 : 2));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedContactIndex(prev => (prev < 2 ? prev + 1 : 0));
        } else if (e.key === 'Enter' && selectedContactIndex !== -1) {
          e.preventDefault();
          const contactLinks = [
            `mailto:${portfolioData.contact.email}`,
            portfolioData.contact.github,
            `https://${portfolioData.contact.linkedin}`
          ];
          window.open(contactLinks[selectedContactIndex], '_blank');
        }
      } else if (output.includes('projects:')) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedProjectIndex(prev => (prev > 0 ? prev - 1 : portfolioData.projects.length - 1));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedProjectIndex(prev => (prev < portfolioData.projects.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'Enter' && selectedProjectIndex !== -1) {
          e.preventDefault();
          window.open(portfolioData.projects[selectedProjectIndex].github, '_blank');
        }
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const touchY = touch.clientY;
    setTouchStart(touchY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const currentY = touch.clientY;
    const diff = touchStart - currentY;

    if (Math.abs(diff) > 50) { // threshold of 50px
      if (diff > 0) {
        // Swipe up
        if (currentView === 'menu') {
          setSelectedIndex(prev => (prev < initialOptions.length - 1 ? prev + 1 : 0));
        } else if (output.includes('contact:')) {
          setSelectedContactIndex(prev => (prev < 2 ? prev + 1 : 0));
        } else if (output.includes('projects:')) {
          setSelectedProjectIndex(prev => 
            (prev < portfolioData.projects.length - 1 ? prev + 1 : 0)
          );
        }
      } else {
        // Swipe down
        if (currentView === 'menu') {
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : initialOptions.length - 1));
        } else if (output.includes('contact:')) {
          setSelectedContactIndex(prev => (prev > 0 ? prev - 1 : 2));
        } else if (output.includes('projects:')) {
          setSelectedProjectIndex(prev => 
            (prev > 0 ? prev - 1 : portfolioData.projects.length - 1)
          );
        }
      }
      setTouchStart(null);
    }
  };

  const handleCommand = (command: string) => {
    setOutput(prev => [...prev, `$ ${command}`]);

    switch (command.trim()) {
      case 'about':
        setOutput(prev => [...prev, portfolioData.about]);
        break;
      case 'skills':
        setOutput(prev => [
          ...prev,
          'skills:',
          ...portfolioData.skills.map(skill => `- ${skill}`)
        ]);
        break;
      case 'projects':
        setOutput(prev => [
          ...prev,
          'projects:',
          ...portfolioData.projects.map(project => `- ${project.name}: ${project.description}`)
        ]);
        break;
      case 'contact':
        setOutput(prev => [
          ...prev,
          'contact:',
          'Use arrow keys to navigate and Enter to open link:',
          'email: Send Email',
          'github: GitHub Profile',
          'linkedin: LinkedIn Profile'
        ]);
        break;
      case 'articles':
        setOutput(prev => [
          ...prev,
          'articles:',
          ...portfolioData.articles.map(article => `- ${article.title}: ${article.link}`)
        ]);
        break;
      default:
        setOutput(prev => [...prev, `command not found: ${command}. use arrow keys to navigate and enter to select.`]);
    }
  };

  const handleBack = () => {
    setCurrentView('menu');
    setOutput([]);
    setSelectedContactIndex(-1);
    setSelectedProjectIndex(-1);
  };

  return (
    <div 
      className={`${styles.terminal} ${styles.responsive}`} 
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {currentView === 'content' && (
        <button onClick={handleBack} className={styles.backButton}>
          ← Back to Menu
        </button>
      )}
      <h1 className={styles.heading}>
        {heading}
      </h1>
      {currentView === 'menu' ? (
        <div className={styles.intro}>
          <p>welcome to my blue terminal portfolio. use arrow keys to navigate and enter to select an option.</p>
          <p>options:</p>
          <ul>
            {initialOptions.map((option, index) => (
              <li key={index} className={index === selectedIndex ? styles.selected : ''}>
                <span>{option.command}</span> - {option.description}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div ref={outputRef} className={styles.output}>
          {output.map((line, index) => {
            if (line.startsWith('- ')) {
              const projectIndex = output.indexOf(line) - 2; // Adjust for header lines
              return (
                <div 
                  key={index} 
                  className={`${styles.projectLine} ${projectIndex === selectedProjectIndex ? styles.selected : ''}`}
                >
                  {line}
                </div>
              );
            }
            if (line.includes('email: Send')) {
              return (
                <a key={index} 
                   href={`mailto:${portfolioData.contact.email}`} 
                   className={`${styles.contactLine} ${selectedContactIndex === 0 ? styles.selected : ''}`}>
                  Send Email
                </a>
              );
            }
            if (line.includes('github: GitHub')) {
              return (
                <a key={index} 
                   href={portfolioData.contact.github} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className={`${styles.contactLine} ${selectedContactIndex === 1 ? styles.selected : ''}`}>
                  GitHub Profile
                </a>
              );
            }
            if (line.includes('linkedin: LinkedIn')) {
              return (
                <a key={index} 
                   href={`https://${portfolioData.contact.linkedin}`} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className={`${styles.contactLine} ${selectedContactIndex === 2 ? styles.selected : ''}`}>
                  LinkedIn Profile
                </a>
              );
            }
            return <div key={index} className={styles.outputLine}>{line}</div>;
          })}
          <p className={styles.hint}>press esc to return to the main menu</p>
        </div>
      )}
    </div>
  );
};

export default BlueTerminal;

