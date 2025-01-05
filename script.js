const portfolioData = {
    about: "hi, i'm a software developer with a passion for creating elegant and efficient solutions.",
    skills: ["javascript", "html", "css", "python", "node.js", "sql"],
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

class TerminalPortfolio {
    constructor() {
        this.outputElement = null;
        this.inputElement = null;
        this.formElement = null;
        this.initialOptionsElement = null;
        this.commandHistory = [];
        this.historyIndex = -1;

        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.outputElement = document.getElementById('output');
            this.inputElement = document.getElementById('input');
            this.formElement = document.getElementById('input-form');
            this.initialOptionsElement = document.getElementById('initial-options');

            if (this.initialOptionsElement) {
                this.populateInitialOptions();
            }

            this.addEventListeners();
        });
    }

    populateInitialOptions() {
        initialOptions.forEach(option => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${option.command}</span> - ${option.description}`;
            this.initialOptionsElement.appendChild(li);
        });
    }

    addEventListeners() {
        if (this.formElement) {
            this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
        }
        if (this.inputElement) {
            this.inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        }
    }

    addOutput(text) {
        if (this.outputElement) {
            const line = document.createElement('div');
            line.textContent = text;
            line.className = 'output-line';
            line.addEventListener('click', () => {
                document.querySelectorAll('.output-line').forEach(el => el.classList.remove('selected'));
                line.classList.add('selected');
            });
            this.outputElement.appendChild(line);
            this.outputElement.scrollTop = this.outputElement.scrollHeight;
        }
    }

    handleCommand(command) {
        this.addOutput(`$ ${command}`);

        switch (command.trim()) {
            case 'help':
                this.addOutput('available commands: about, skills, projects, contact, clear');
                break;
            case 'about':
                this.addOutput(portfolioData.about);
                break;
            case 'skills':
                this.addOutput('skills:');
                portfolioData.skills.forEach(skill => this.addOutput(`- ${skill}`));
                break;
            case 'projects':
                this.addOutput('projects:');
                portfolioData.projects.forEach(project => {
                    this.addOutput(`- ${project.name}: ${project.description}`);
                });
                break;
            case 'contact':
                this.addOutput(portfolioData.contact);
                break;
            case 'clear':
                if (this.outputElement) {
                    this.outputElement.innerHTML = '';
                }
                break;
            default:
                this.addOutput(`command not found: ${command}. type 'help' for available commands.`);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const command = this.inputElement.value.toLowerCase();
        if (command) {
            this.commandHistory.unshift(command);
            this.historyIndex = -1;
            this.handleCommand(command);
            this.inputElement.value = '';
        }
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.inputElement.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex > -1) {
                this.historyIndex--;
                this.inputElement.value = this.historyIndex === -1 ? '' : this.commandHistory[this.historyIndex];
            }
        }
    }
}

// Create and export an instance of TerminalPortfolio
const terminalPortfolio = new TerminalPortfolio();
export default terminalPortfolio;

