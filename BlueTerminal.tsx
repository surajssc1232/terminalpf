import React, { useState, useEffect, useRef } from 'react';
import styles from './BlueTerminal.module.css';

const portfolioData = {
  about: "hi, i'm a software developer with a passion for creating elegant and efficient solutions.",
  skills: ["javascript", "typescript", "react", "node.js", "python", "sql"],
  projects: [
    { name: "project a", description: "a web application for managing tasks and projects." },
    { name: "project b", description: "a mobile app for tracking fitness goals and progress." },
    { name: "project c", description: "a machine learning model for predicting stock prices." },
  ],
  contact: "email: developer@example.com | github: github.com/developer | linkedin: linkedin.com/in/developer",
};

const initialOptions = [
  { command: 'about', description: 'learn more about me' },
  { command: 'skills', description: 'view my technical skills' },
  { command: 'projects', description: 'see my project portfolio' },
  { command: 'contact', description: 'get in touch with me' },
];

const BlueTerminal: React.FC = () => {
  const [output, setOutput] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = (command: string) => {
    setOutput(prev => [...prev, `$ ${command}`]);

    switch (command.trim()) {
      case 'help':
        setOutput(prev => [...prev, 'available commands: about, skills, projects, contact, clear']);
        break;
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
        setOutput(prev => [...prev, portfolioData.contact]);
        break;
      case 'clear':
        setOutput([]);
        break;
      default:
        setOutput(prev => [...prev, `command not found: ${command}. type 'help' for available commands.`]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      handleCommand(input);
      setHistory(prev => [input, ...prev]);
      setInput('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistoryIndex(prev => {
        const newIndex = Math.min(prev + 1, history.length - 1);
        setInput(history[newIndex] || '');
        return newIndex;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistoryIndex(prev => {
        const newIndex = Math.max(prev - 1, -1);
        setInput(newIndex === -1 ? '' : history[newIndex]);
        return newIndex;
      });
    }
  };

  return (
    <div className={styles.terminal}>

      <div className={styles.intro}>
        
        <p>initial options:</p>
        <br />
        <ul>
          {initialOptions.map((option, index) => (
            <li key={index}>
              <span>{option.command}</span> - {option.description}
            </li>
          ))}
        </ul>
      </div>
      <div ref={outputRef} className={styles.output}>
        {output.map((line, index) => (
          <div key={index} className={styles.outputLine}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.inputLine}>
        <span className={styles.prompt}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toLowerCase())}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
      </form>
    </div>
  );
};

export default BlueTerminal;

