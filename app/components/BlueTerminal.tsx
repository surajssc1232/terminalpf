'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './BlueTerminal.module.css';

const portfolioData = {
  about: "hi, i'm a software developer with a passion for creating elegant and efficient solutions.",
  skills: ["SpringBoot", "Java", "Python", "Flask", "Docker", "PostgreSQL"],
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
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  let iteration = 0;
  const maxIterations = 12;

  const interval = setInterval(() => {
    setter(
      text.split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('')
    );

    iteration += 1/3;

    if (iteration >= text.length) {
      clearInterval(interval);
      setter(text);
    }
  }, 50);

  return () => clearInterval(interval);
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
  const [lastTouchY, setLastTouchY] = useState<number | null>(null);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedContentIndex, setSelectedContentIndex] = useState(-1);

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
      const cleanup = scrambleText('Suraj Singh', setHeading);
      return cleanup;
    }, 5000); // Increased interval to 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 2000);
    return () => clearTimeout(timer);
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
        setSelectedContentIndex(-1);
      } else {
        const contentLines = output.filter(line => line.startsWith('- '));
        if (contentLines.length > 0) {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedContentIndex(prev => (prev > 0 ? prev - 1 : contentLines.length - 1));
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedContentIndex(prev => (prev < contentLines.length - 1 ? prev + 1 : 0));
          } else if (e.key === 'Enter' && selectedContentIndex !== -1) {
            e.preventDefault();
            const selectedLine = contentLines[selectedContentIndex];
            
            if (output.includes('CONTACT')) {
              const contactLinks = [
                `mailto:${portfolioData.contact.email}`,
                portfolioData.contact.github,
                `https://${portfolioData.contact.linkedin}`
              ];
              window.open(contactLinks[selectedContentIndex], '_blank');
            } else if (output.includes('PROJECTS')) {
              // Extract the project name from the selected line
              const projectName = selectedLine.split(':')[0].replace('- ', '').trim();
              const project = portfolioData.projects.find(p => p.name === projectName);
              if (project) {
                window.open(project.github, '_blank');
              }
            } else if (output.includes('ARTICLES')) {
              const articleTitle = selectedLine.split(':')[0].replace('- ', '').trim();
              const article = portfolioData.articles.find(a => a.title === articleTitle);
              if (article) {
                window.open(article.link, '_blank');
              }
            }
          }
        }
      }
    }
  };

  const handleContentSelect = (selectedLine: string) => {
    if (output.includes('CONTACT')) {
      const contactLinks = [
        `mailto:${portfolioData.contact.email}`,
        portfolioData.contact.github,
        `https://${portfolioData.contact.linkedin}`
      ];
      window.open(contactLinks[selectedContentIndex], '_blank');
    } else if (output.includes('PROJECTS')) {
      window.open(portfolioData.projects[selectedContentIndex].github, '_blank');
    } else if (output.includes('ARTICLES')) {
      window.open(portfolioData.articles[selectedContentIndex].link, '_blank');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setLastTouchY(touch.clientY);
  };

const handleTouchMove = (e: React.TouchEvent) => {
  if (!lastTouchY) return;
  
  const touch = e.touches[0];
  const currentY = touch.clientY;
  const diff = lastTouchY - currentY;
  const threshold = 20;

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // Swipe up
      if (currentView === 'menu') {
        setSelectedIndex(prev => (prev < initialOptions.length - 1 ? prev + 1 : 0));
      } else {
        const contentLines = output.filter(line => line.startsWith('- '));
        if (contentLines.length > 0) {
          setSelectedContentIndex(prev => (prev < contentLines.length - 1 ? prev + 1 : 0));
        }
      }
    } else {
      // Swipe down
      if (currentView === 'menu') {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : initialOptions.length - 1));
      } else {
        const contentLines = output.filter(line => line.startsWith('- '));
        if (contentLines.length > 0) {
          setSelectedContentIndex(prev => (prev > 0 ? prev - 1 : contentLines.length - 1));
        }
      }
    }
    setLastTouchY(currentY);
  }
};

const handleTouchEnd = () => {
  setLastTouchY(null);
};

const handleTap = (e: React.TouchEvent) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTapTime;
  
  if (tapLength < 500 && tapLength > 0) {
    if (currentView === 'menu') {
      handleCommand(initialOptions[selectedIndex].command);
      setCurrentView('content');
    } else {
      const contentLines = output.filter(line => line.startsWith('- '));
      if (contentLines.length > 0 && selectedContentIndex !== -1) {
        const selectedLine = contentLines[selectedContentIndex];
        handleContentSelect(selectedLine);
      }
    }
  }
  setLastTapTime(currentTime);
};

  const handleCommand = (command: string) => {
    switch (command.trim()) {
      case 'about':
        setOutput(prev => [
          'ABOUT',
          portfolioData.about
        ]);
        break;
      case 'skills':
        setOutput(prev => [
          'SKILLS',
          ...portfolioData.skills.map(skill => `- ${skill}`)
        ]);
        break;
      case 'projects':
        setOutput(prev => [
          'PROJECTS',
          ...portfolioData.projects.map(project => `- ${project.name}: ${project.description}`)
        ]);
        break;
      case 'contact':
        setOutput(prev => [
          'CONTACT',
          '- Email',
          '- GitHub',
          '- LinkedIn'
        ]);
        break;
      case 'articles':
        setOutput(prev => [
          'ARTICLES',
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
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClick={handleTap}
    >
      {showInstructions && (
        <div className={styles.instructions}>
          <span>↕️ swipe up/down to navigate</span>
          <span>👆 double tap to select</span>
        </div>
      )}
      {currentView === 'content' && (
        <button onClick={handleBack} className={styles.backButton}>
          ←
        </button>
      )}
      {currentView === 'menu' && (
        <h1 className={styles.heading}>
          {heading}
        </h1>
      )}
      {currentView === 'menu' ? (
        <div className={styles.intro}>
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
            if (['ABOUT', 'SKILLS', 'PROJECTS', 'CONTACT', 'ARTICLES'].includes(line)) {
              return <h2 key={index} className={styles.sectionHeading}>{line}</h2>;
            }
            if (line.startsWith('- ')) {
              const contentIndex = output.filter(l => l.startsWith('- ')).indexOf(line);
              return (
                <div 
                  key={index} 
                  className={`${styles.contentLine} ${contentIndex === selectedContentIndex ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedContentIndex(contentIndex);
                    handleContentSelect(line);
                  }}
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

