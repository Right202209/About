import React, { useState, useEffect, useRef } from 'react';
import { personalInfo, claudeBrand, links, contacts, skills, cartoons, books } from './info';


export default function ClaudeTerminal({ theme, onThemeChange }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lines, setLines] = useState([]);
  
  // 终端运行状态
  const [isRunning, setIsRunning] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(null); // 用于保存当前可以被 Ctrl+C 中断的异步任务
  
  // 交互确认（Prompt）状态，例如打开网页或切换主题时的 y/n 确认
  const [awaitingConfirm, setAwaitingConfirm] = useState(null); // { type: string, data: any, resolve: function }

  // 命令行自动补全提示（Ghost Text）
  const [suggestion, setSuggestion] = useState('');

  const outputEndRef = useRef(null);
  const inputRef = useRef(null);

  // 所有的指令列表，用于自动补全
  const availableCommands = [
    'help', 'contact', 'skill', 'cartoon', 'book', 'ascii', 'name', 
    'intro', 'echo', 'open', 'menu', 'resume', '2048',
    '/help', '/clear', '/compact', '/history', '/exit'
  ];

  // 模拟终端启动，执行 bootCmd 'intro'
  useEffect(() => {
    executeCommand('intro', true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 自动滚动到终端底部
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines]);

  // 处理输入变化，计算自动补全建议（Ghost Text）
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (!val.trim()) {
      setSuggestion('');
      return;
    }

    // 只有当用户输入的是以某个已知命令开头时，才显示 Ghost 提示
    const match = availableCommands.find(cmd => cmd.startsWith(val.toLowerCase()) && cmd !== val.toLowerCase());
    if (match) {
      setSuggestion(match.slice(val.length));
    } else {
      setSuggestion('');
    }
  };

  // 聚焦输入框
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      // 避免输入框聚焦时触发浏览器对父级容器的非预期滚动偏移动作
      const desktop = document.querySelector('.desktop');
      if (desktop) {
        desktop.scrollTop = 0;
      }
    }
  };

  // 终端点击时聚焦输入框
  const handleTerminalClick = () => {
    focusInput();
  };

  // 快捷键处理：Tab补全、上下方向键历史记录、Ctrl+C中断
  const handleKeyDown = (e) => {
    // Ctrl + C 中断当前运行
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      if (isRunning || awaitingConfirm) {
        // 中断当前异步进程
        if (currentProcess && currentProcess.cancel) {
          currentProcess.cancel();
        }
        setIsRunning(false);
        setAwaitingConfirm(null);
        setCurrentProcess(null);
        
        setLines(prev => [
          ...prev,
          { id: Math.random().toString(), type: 'system', text: '^C (Aborted by user)' }
        ]);
        setInput('');
        setSuggestion('');
      } else {
        // 如果没有运行的指令，直接另起一行
        setLines(prev => [
          ...prev,
          { id: Math.random().toString(), type: 'input', text: input, dir: claudeBrand.cwd }
        ]);
        setInput('');
        setSuggestion('');
      }
      return;
    }

    // 正在运行且不需要用户二次确认时，禁止其他键盘交互
    if (isRunning && !awaitingConfirm) {
      if (e.key !== 'Enter') {
        e.preventDefault();
        return;
      }
    }

    // Tab 键或右方向键自动补全
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestion) {
      e.preventDefault();
      setInput(prev => prev + suggestion);
      setSuggestion('');
      return;
    }

    // Enter 键执行指令
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedInput = input.trim();
      
      // 如果正在等待 y/n 确认
      if (awaitingConfirm) {
        setLines(prev => [
          ...prev,
          { id: Math.random().toString(), type: 'text', text: input }
        ]);
        const answer = trimmedInput.toLowerCase();
        const resolve = awaitingConfirm.resolve;
        setAwaitingConfirm(null);
        setInput('');
        setSuggestion('');
        if (answer === 'y' || answer === 'yes') {
          resolve(true);
        } else {
          resolve(false);
        }
        return;
      }

      if (!trimmedInput) {
        setLines(prev => [
          ...prev,
          { id: Math.random().toString(), type: 'input', text: '', dir: claudeBrand.cwd }
        ]);
        return;
      }

      // 将指令加入历史记录
      setHistory(prev => [trimmedInput, ...prev.filter(cmd => cmd !== trimmedInput)].slice(0, 50));
      setHistoryIndex(-1);

      // 显示输入的指令行
      setLines(prev => [
        ...prev,
        { id: Math.random().toString(), type: 'input', text: trimmedInput, dir: claudeBrand.cwd }
      ]);

      setInput('');
      setSuggestion('');
      executeCommand(trimmedInput);
    }

    // ArrowUp 历史记录上一条
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < history.length) {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
        setSuggestion('');
      }
    }

    // ArrowDown 历史记录下一条
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
        setSuggestion('');
      } else {
        setHistoryIndex(-1);
        setInput('');
        setSuggestion('');
      }
    }
  };

  // 辅助函数：输出一行
  const printLine = (type, text) => {
    const id = Math.random().toString();
    setLines(prev => [...prev, { id, type, text }]);
    return id;
  };

  // 辅助函数：更新某一行内容
  const updateLine = (id, text, type) => {
    setLines(prev => prev.map(line => line.id === id ? { ...line, text, ...(type ? { type } : {}) } : line));
  };


  // 辅助函数：延时
  const delay = (ms) => new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    // 支持取消延时以响应 Ctrl+C 中断
    if (currentProcess) {
      currentProcess.cancel = () => {
        clearTimeout(timer);
        reject(new Error('cancelled'));
      };
    }
  });

  // 辅助函数：打字效果渲染单行或多行文本
  const typeText = async (text, type = 'text', speed = 10) => {
    const lineId = printLine(type, '');
    let displayed = '';
    for (let i = 0; i < text.length; i++) {
      displayed += text[i];
      updateLine(lineId, displayed);
      await delay(speed);
    }
  };

  // 辅助函数：渲染工具调用模块
  const simulateToolCall = async (toolName, args, resultSummary, duration = 1200) => {
    const lineId = printLine('tool_call', { toolName, args, status: 'running' });
    await delay(duration);
    updateLine(lineId, { toolName, args, status: 'success', resultSummary }, 'tool_call');
    await delay(300);
  };

  // 模拟 y/n 权限确认对话框
  const requestPermission = (message) => {
    return new Promise((resolve) => {
      printLine('system', message);
      setAwaitingConfirm({ resolve });
    });
  };

  // 核心逻辑：执行指令
  const executeCommand = async (fullCommand, isBoot = false) => {
    setIsRunning(true);
    
    // 初始化当前进程的控制对象，用于支持 Ctrl+C 中断
    const processObj = { cancel: () => {} };
    setCurrentProcess(processObj);

    try {
      const parts = fullCommand.trim().split(/\s+/);
      const commandName = parts[0].toLowerCase();
      const argsStr = parts.slice(1).join(' ');

      const startTime = Date.now();

      // 如果是终端启动
      if (isBoot && commandName === 'intro') {
        await typeText(`Welcome to ${personalInfo.name}'s Claude Code CLI.`, 'success', 15);
        await delay(300);
        await simulateToolCall('view_file', { AbsolutePath: '~/Droit/info.js' }, 'Read personal info successfully', 800);
        await typeText('Thanks for your visit, let me introduce myself.', 'info', 15);
        await delay(200);

        // 渲染个人基本信息
        printLine('text', `Name:   ${personalInfo.name}`);
        await delay(100);
        printLine('text', `Sex:    ${personalInfo.sex}`);
        await delay(100);
        printLine('text', `Age:    ${personalInfo.age} years old`);
        await delay(100);
        printLine('text', `Email:  ${personalInfo.email}`);
        await delay(200);

        printLine('info', `Goals (${personalInfo.aims.length}):`);
        for (let i = 0; i < personalInfo.aims.length; i++) {
          await delay(100);
          printLine('text', `  => ${i + 1}. ${personalInfo.aims[i]}`);
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 1,240 sent, 480 received | Cost: $0.0058 | Time: ${elapsed}s`);
        setIsRunning(false);
        setCurrentProcess(null);
        return;
      }

      // 1. Help 指令
      if (commandName === 'help' || commandName === '/help') {
        await simulateToolCall('grep_search', { Query: 'commands', SearchPath: '~/Droit' }, 'Found 13 custom commands', 600);
        
        printLine('info', 'Available Commands:');
        const commandsHelp = [
          { name: 'intro', desc: 'Introduce Droit and his career goals.' },
          { name: 'skill', desc: 'Display Droit\'s technical skills and proficiency.' },
          { name: 'contact', desc: 'Show contact details (GitHub, Email, Twitter).' },
          { name: 'book', desc: 'List Droit\'s reading history and study list.' },
          { name: 'cartoon', desc: 'List cartoons and anime watched by Droit.' },
          { name: 'ascii / name', desc: 'Display a large ASCII art banner of "DROIT".' },
          { name: 'echo [text]', desc: 'Echo the input back to the terminal.' },
          { name: 'open [url]', desc: 'Open any website URL in a new tab (requires approval).' },
          { name: 'resume', desc: 'Open Droit\'s online portfolio page.' },
          { name: '2048', desc: 'Launch a 2048 game in a new browser tab.' },
        ];
        
        commandsHelp.forEach(c => {
          printLine('text', `  ${c.name.padEnd(15)} - ${c.desc}`);
        });

        printLine('info', '\nSlash Commands & Shell Utilities:');
        const slashHelp = [
          { name: '/help', desc: 'Show this comprehensive help screen.' },
          { name: '/clear', desc: 'Clear the terminal output screen.' },
          { name: '/compact', desc: 'Simulate compressing conversation context to save tokens.' },
          { name: '/history', desc: 'Show the log of commands run in this session.' },
          { name: '/exit', desc: 'Simulate exiting Claude Code.' },
        ];

        slashHelp.forEach(c => {
          printLine('text', `  ${c.name.padEnd(15)} - ${c.desc}`);
        });

        printLine('info', '\nKeyboard Shortcuts:');
        printLine('text', '  Tab / ArrowRight  - Auto-complete commands');
        printLine('text', '  ArrowUp / Down    - Navigate command history');
        printLine('text', '  Ctrl + C          - Interrupt current thinking or execution');

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 850 sent, 620 received | Cost: $0.0038 | Time: ${elapsed}s`);
      }
      
      // 2. Skill 指令
      else if (commandName === 'skill') {
        await simulateToolCall('grep_search', { Query: 'skills', SearchPath: '~/Droit/src/info.js' }, 'Found 15 skill items', 900);
        
        printLine('info', 'Technical Skills & Proficiency:');
        
        // 渲染技能进度条
        for (let i = 0; i < skills.length; i++) {
          const item = skills[i];
          const matches = item.content.match(/·\s+(.+)\s+(\d+)\/100/);
          if (matches) {
            const lang = matches[1];
            const score = parseInt(matches[2], 10);
            
            // 绘制进度条
            const barLength = 15;
            const filledLength = Math.round((score / 100) * barLength);
            const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
            
            // 根据熟练度类型设置颜色类型
            let typeColor = 'black';
            if (score >= 50) typeColor = 'success';
            else if (score > 0) typeColor = 'warning';
            else if (item.type === 'error') typeColor = 'error';
            
            printLine(typeColor, `  ${lang.padEnd(12)} [${bar}] ${score}/100`);
            await delay(50);
          } else {
            printLine('text', `  ${item.content}`);
          }
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 780 sent, 550 received | Cost: $0.0034 | Time: ${elapsed}s`);
      }

      // 3. Contact 指令
      else if (commandName === 'contact') {
        await simulateToolCall('view_file', { AbsolutePath: '~/Droit/src/info.js' }, 'Read contact info', 700);
        
        printLine('info', 'Contact Information:');
        contacts.forEach(c => {
          // 清除 content 中的反引号
          const cleanedContent = c.content.replace(/`/g, '');
          printLine('text', `  ${c.label.padEnd(10)} ${cleanedContent}`);
        });

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 520 sent, 240 received | Cost: $0.0018 | Time: ${elapsed}s`);
      }

      // 4. Cartoon 指令
      else if (commandName === 'cartoon') {
        await simulateToolCall('view_file', { AbsolutePath: '~/Droit/src/info.js' }, 'Read cartoon list', 700);
        
        printLine('info', 'Anime & Cartoons Watched:');
        cartoons.forEach(c => {
          printLine('text', `  ${c.trim()}`);
        });

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 600 sent, 380 received | Cost: $0.0024 | Time: ${elapsed}s`);
      }

      // 5. Book 指令
      else if (commandName === 'book') {
        await simulateToolCall('view_file', { AbsolutePath: '~/Droit/src/info.js' }, 'Read book list', 900);
        
        printLine('info', 'Reading List & Study References:');
        books.forEach((b, index) => {
          printLine('text', `  [${index + 1}] ${b.trim()}`);
        });

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 980 sent, 780 received | Cost: $0.0048 | Time: ${elapsed}s`);
      }

      // 6. Ascii / Name 指令
      else if (commandName === 'ascii' || commandName === 'name') {
        await simulateToolCall('view_file', { AbsolutePath: '~/Droit/src/static.js' }, 'Read ASCII art', 500);
        
        const nameAsciiArt = [
          'DDDD   RRRR   OOO    III  TTTTT',
          'D   D  R   R O   O    I     T  ',
          'D   D  RRRR  O   O    I     T  ',
          'D   D  R R   O   O    I     T  ',
          'DDDD   R  RR  OOO    III    T  '
        ];
        
        nameAsciiArt.forEach(line => {
          printLine('success', line);
        });

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 420 sent, 150 received | Cost: $0.0014 | Time: ${elapsed}s`);
      }

      // 7. Echo 指令
      else if (commandName === 'echo') {
        await delay(200);
        printLine('success', argsStr || '');
      }

      // 8. Open 指令
      else if (commandName === 'open') {
        if (!argsStr) {
          printLine('error', 'Error: A URL is required! Usage: open <url>');
          setIsRunning(false);
          setCurrentProcess(null);
          return;
        }

        let targetUrl = argsStr.trim();
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
          targetUrl = 'https://' + targetUrl;
        }

        // 模拟运行命令的权限提示
        await simulateToolCall('run_command', { CommandLine: `start "" "${targetUrl}"` }, 'Prepared to execute command', 600);
        
        const approved = await requestPermission(`? Claude wants to open the URL '${targetUrl}'. Proceed? [y/N]`);
        
        if (approved) {
          printLine('success', 'Permission granted. Opening in a new browser tab...');
          window.open(targetUrl, '_blank');
        } else {
          printLine('warning', 'Permission denied. Command aborted.');
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 520 sent, 180 received | Cost: $0.0018 | Time: ${elapsed}s`);
      }

      // 9. Resume 指令
      else if (commandName === 'resume') {
        await simulateToolCall('run_command', { CommandLine: `start "" "${links.resume}"` }, 'Prepared to open resume', 500);
        
        const approved = await requestPermission(`? Claude wants to open Droit's resume at '${links.resume}'. Proceed? [y/N]`);
        
        if (approved) {
          printLine('success', 'Opening resume...');
          window.open(links.resume, '_blank');
        } else {
          printLine('warning', 'Command aborted.');
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 480 sent, 120 received | Cost: $0.0015 | Time: ${elapsed}s`);
      }

      // 10. Menu 指令
      else if (commandName === 'menu') {
        await simulateToolCall('run_command', { CommandLine: `start "" "${links.menu}"` }, 'Prepared to open menu', 500);
        
        const approved = await requestPermission(`? Claude wants to open Droit's portfolio menu at '${links.menu}'. Proceed? [y/N]`);
        
        if (approved) {
          printLine('success', 'Opening menu...');
          window.open(links.menu, '_blank');
        } else {
          printLine('warning', 'Command aborted.');
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 480 sent, 120 received | Cost: $0.0015 | Time: ${elapsed}s`);
      }

      // 11. 2048 指令
      else if (commandName === '2048') {
        await simulateToolCall('run_command', { CommandLine: `start "" "${links.game2048}"` }, 'Prepared to open game 2048', 500);
        
        const approved = await requestPermission(`? Claude wants to launch the 2048 game in your browser. Proceed? [y/N]`);
        
        if (approved) {
          printLine('success', 'Launching 2048 Game! Have fun!');
          window.open(links.game2048, '_blank');
        } else {
          printLine('warning', 'Game launch cancelled.');
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 480 sent, 120 received | Cost: $0.0015 | Time: ${elapsed}s`);
      }

      // 12. Slash: /clear
      else if (commandName === '/clear') {
        setLines([]);
      }

      // 13. Slash: /compact
      else if (commandName === '/compact') {
        await simulateToolCall('compact_conversation', {}, 'Starting compression...', 600);
        
        const progressId = printLine('info', 'Compacting context: [░░░░░░░░░░░░░░░░░░░░] 0%');
        const steps = 10;
        for (let i = 1; i <= steps; i++) {
          await delay(200);
          const percent = i * 10;
          const filled = '='.repeat(i * 2);
          const empty = '░'.repeat(20 - i * 2);
          updateLine(progressId, `Compacting context: [${filled}${empty}] ${percent}%`);
        }
        await delay(300);
        updateLine(progressId, '✔ Conversation compacted successfully!', 'success');
        printLine('text', 'Reduced context window from 14,850 to 2,970 tokens (80% savings).');
        
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 14,850 sent, 2,970 received | Cost: $0.0520 | Time: ${elapsed}s`);
      }

      // 14. Slash: /history
      else if (commandName === '/history') {
        await delay(200);
        printLine('info', 'Command History (latest first):');
        if (history.length === 0) {
          printLine('text', '  No commands run yet.');
        } else {
          history.forEach((cmd, idx) => {
            printLine('text', `  [${idx + 1}] ${cmd}`);
          });
        }
      }

      // 15. Slash: /exit
      else if (commandName === '/exit') {
        await delay(400);
        printLine('system', 'Closing session connection...');
        await delay(600);
        printLine('error', 'Connection closed. Claude terminal is offline.');
        printLine('system', 'Press any key or click "Restart Terminal" below to reconnect.');
        
        // 渲染重启终端的交互按钮
        printLine('info', {
          isReactNode: true,
          node: (
            <button 
              className="terminal-restart-btn"
              onClick={() => {
                setLines([]);
                executeCommand('intro', true);
              }}
            >
              🔄 Reconnect Claude CLI
            </button>
          )
        });
      }

      // 16. NLP 智能问答兜底 (用户输入任意文本)
      else {
        // 进行自然语言关键词识别
        const question = fullCommand.toLowerCase();
        
        printLine('system', 'Thinking...');
        await delay(1200);
        
        // A. 询问关于 Droit / 个人信息
        if (question.includes('who') || question.includes('droit') || question.includes('about') || question.includes('introduce')) {
          await simulateToolCall('grep_search', { Query: 'personalInfo', SearchPath: '~/Droit/src/info.js' }, 'Found 1 match', 800);
          
          await typeText(`Droit is a passionate junior software developer. Here is what I know about him:\n\n`, 'text', 10);
          printLine('text', `• Name:       ${personalInfo.name}`);
          printLine('text', `• Sex/Age:    ${personalInfo.sex}, ${personalInfo.age} years old`);
          printLine('text', `• Email:      ${personalInfo.email}`);
          printLine('text', `• Goal:       Become a full-stack engineer and actively contribute to the open-source community.`);
          printLine('text', `\nFeel free to type 'skill' to view his full technical profile, or 'contact' to reach out!`);
        } 
        
        // B. 询问项目 / 代码
        else if (question.includes('project') || question.includes('portfolio') || question.includes('code') || question.includes('repo')) {
          await simulateToolCall('list_dir', { DirectoryPath: 'd:/Codes/GP' }, 'Found 3 items', 800);
          
          await typeText(`I scanned the active workspace and found the following items:\n\n`, 'text', 10);
          printLine('text', `📂 About      - Droit's macOS-style React portfolio page (this project).`);
          printLine('text', `📂 2048       - A web-based 2048 game custom-built by Droit.`);
          printLine('text', `📂 @datasets  - Storage folder containing datasets.`);
          printLine('text', `\nYou can run the '2048' command to play the game, or type 'resume' to visit the homepage.`);
        } 
        
        // C. 询问更改主题 / 暗黑模式
        else if (question.includes('theme') || question.includes('dark') || question.includes('light') || question.includes('color')) {
          const targetTheme = (question.includes('light') && !question.includes('dark')) ? 'light' : 'dark';
          
          if (theme === targetTheme) {
            printLine('info', `The current theme is already ${targetTheme} mode.`);
          } else {
            await simulateToolCall('run_command', { CommandLine: `set_theme('${targetTheme}')` }, 'Adjusting stylesheet variables', 700);
            
            const approved = await requestPermission(`? Claude wants to switch the interface theme to ${targetTheme} mode. Proceed? [y/N]`);
            
            if (approved) {
              onThemeChange(targetTheme);
              printLine('success', `Successfully changed theme to ${targetTheme} mode.`);
            } else {
              printLine('warning', 'Theme change cancelled.');
            }
          }
        } 
        
        // D. 程序员笑话
        else if (question.includes('joke') || question.includes('funny')) {
          await delay(300);
          const jokes = [
            "Why do programmers wear glasses?\nBecause they can't C#!",
            "There are 10 types of people in the world:\nthose who understand binary, and those who don't.",
            "What is a programmer's favorite hangout place?\nFoo Bar!",
            "How many programmers does it take to change a light bulb?\nNone, that's a hardware problem."
          ];
          const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
          await typeText(randomJoke, 'success', 12);
        } 
        
        // E. 默认回答
        else {
          await simulateToolCall('web_search', { query: question }, 'Search completed. No matches found', 1000);
          
          await typeText(`I've analyzed your query: "${fullCommand}".\nAs Droit's personal AI agent, I can assist you with running commands like:\n`, 'text', 10);
          printLine('text', '  • skill    - View programming language ratings');
          printLine('text', '  • contact  - View contact cards');
          printLine('text', '  • book     - Read Droit\'s reference book list');
          printLine('text', '  • /help    - Open full guide');
          printLine('text', '\nPlease try entering one of the commands above or type a specific question about Droit.');
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        printLine('meta', `Tokens: 1,450 sent, 680 received | Cost: $0.0145 | Time: ${elapsed}s`);
      }

    } catch (err) {
      if (err.message === 'cancelled') {
        // 已经被 Ctrl+C 捕获，这里不需要额外操作
      } else {
        printLine('error', `An unexpected error occurred: ${err.message}`);
      }
    } finally {
      setIsRunning(false);
      setCurrentProcess(null);
    }
  };

  return (
    <div className="claude-terminal" onClick={handleTerminalClick}>
      {/* 终端输出区 */}
      <div className="claude-terminal__output">
        {lines.map((line) => {
          if (line.type === 'input') {
            return (
              <p key={line.id} className="claude-terminal__line-input">
                <span className="claude-terminal__prompt">{line.dir || '~/Droit'} &gt;</span>
                <span className="claude-terminal__input-echo">{line.text}</span>
              </p>
            );
          }
          
          if (line.type === 'tool_call') {
            const { toolName, args, status, resultSummary } = line.text;
            const isRunning = status === 'running';
            return (
              <div key={line.id} className={`claude-tool-box claude-tool-box--${status}`}>
                <div className="claude-tool-box__header">
                  <span className="claude-tool-box__status-dot"></span>
                  <span className="claude-tool-box__title">
                    {isRunning ? 'Running Tool:' : 'Used Tool:'} <strong>{toolName}</strong>
                  </span>
                  {isRunning && <span className="claude-tool-box__spinner"></span>}
                </div>
                <div className="claude-tool-box__body">
                  <pre>{JSON.stringify(args, null, 2)}</pre>
                </div>
                {!isRunning && resultSummary && (
                  <div className="claude-tool-box__footer">
                    <span>{resultSummary}</span>
                  </div>
                )}
              </div>
            );
          }

          if (line.text && line.text.isReactNode) {
            return (
              <div key={line.id} className="claude-terminal__line-custom-node">
                {line.text.node}
              </div>
            );
          }

          return (
            <p key={line.id} className={`claude-terminal__line-${line.type}`}>
              {line.text}
            </p>
          );
        })}
        {/* 正在思考时的动画指示器 */}
        {isRunning && !awaitingConfirm && !lines.some(l => l.type === 'tool_call' && l.text.status === 'running') && (
          <p className="claude-terminal__thinking">
            Thinking<span className="dots">...</span>
          </p>
        )}
        <div ref={outputEndRef} />
      </div>

      {/* 终端输入区 */}
      <div className="claude-terminal__input-row">
        <span className="claude-terminal__prompt">
          {claudeBrand.cwd} &gt;
        </span>
        <div className="claude-terminal__input-wrapper">
          {/* 自动补全提示的 Ghost Text */}
          <div className="claude-terminal__suggestion-overlay">
            <span className="suggestion-overlay__typed">{input}</span>
            <span className="suggestion-overlay__ghost">{suggestion}</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            className="claude-terminal__input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isRunning && !awaitingConfirm}
            onFocus={() => {
              // 聚焦时重置父级容器滚动距离，防止页面偏移
              const desktop = document.querySelector('.desktop');
              if (desktop) {
                desktop.scrollTop = 0;
              }
            }}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
