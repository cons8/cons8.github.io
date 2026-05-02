// Shell Terminal Logic
const COMMANDS = ['help', 'list', 'fe', 'be', 'devtools', 'about', 'clear', 'tools'];
const TOOLS = ['base64', 'url', 'uuid', 'pwd', 'hash', 'color', 'json'];

// Tab 补全前缀映射（预计算，避免每次过滤）
const prefixMap = COMMANDS.reduce((map, cmd) => {
  for (let i = 1; i <= cmd.length; i++) {
    const prefix = cmd.slice(0, i);
    if (!map[prefix]) map[prefix] = [];
    map[prefix].push(cmd);
  }
  return map;
}, {});

function initShell() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  // 命令处理映射（与 COMMANDS 分离）
  const commandHandlers = {
    help: [
      '<span class="cmd">help</span>      - Show available commands',
      '<span class="cmd">list</span>      - List all technologies',
      '<span class="cmd">fe</span>        - Show frontend tech',
      '<span class="cmd">be</span>        - Show backend tech',
      '<span class="cmd">devtools</span>  - Show dev tools',
      '<span class="cmd">about</span>     - About this site',
      '<span class="cmd">tools</span>     - Show developer tools',
      '<span class="cmd">clear</span>     - Clear terminal'
    ].join('<br>'),
    list: formatTech(),
    fe: formatTech('frontend'),
    be: formatTech('backend'),
    devtools: formatTech('devtools'),
    about: `<span class="section-head"># 关于 / About</span>
<div class="item-row">
  <span class="item-bullet">◉</span>
  <span class="item-name">一个记录学习历程的个人网站</span>
  <span class="item-name">/ A personal website documenting my learning journey</span>
</div>
<div class="item-gap"></div>
<div class="item-row">
  <span class="item-bullet">◉</span>
  <span class="item-name">技术栈 / Tech Stack</span>
</div>
<div class="item-row sub">
  <span class="item-bullet">└</span>
  <span class="item-name">Frontend:</span>
  <span class="item-desc">Vue, React, TypeScript</span>
</div>
<div class="item-row sub">
  <span class="item-bullet">└</span>
  <span class="item-name">Backend:</span>
  <span class="item-desc">Spring, Docker, K8s</span>
</div>`,
    tools: buildToolsHelp()
  };

  // 小工具函数
  function toolBase64(action, text) {
    if (!action || !text) return 'Usage: base64 encode|decode <text>';
    try {
      return action === 'encode'
        ? btoa(unescape(encodeURIComponent(text)))
        : decodeURIComponent(escape(atob(text)));
    } catch {
      return 'Error: Invalid input';
    }
  }

  function toolUrl(action, text) {
    if (!action || !text) return 'Usage: url encode|decode <text>';
    try {
      return action === 'encode'
        ? encodeURIComponent(text)
        : decodeURIComponent(text);
    } catch {
      return 'Error: Invalid input';
    }
  }

  function toolUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function toolPwd(len) {
    const length = Math.min(Math.max(parseInt(len) || 16, 4), 64);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  // 注意：这不是真正的 MD5/SHA 哈希，仅用于演示
  function toolHash(type, text) {
    if (!text) return 'Usage: hash <text>';
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `hash:${type || 'simple'} = ${hex}`;
  }

  function toolColor(type, value) {
    if (!type || !value) return 'Usage: color hex|rgb <value>';
    if (type === 'hex' && /^rgb\(\d+,\s*\d+,\s*\d+\)$/.test(value)) {
      const m = value.match(/\d+/g);
      return '#' + m.map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
    }
    if (type === 'rgb' && /^#([0-9a-fA-F]{6})$/.test(value)) {
      const r = parseInt(value.slice(1, 3), 16);
      const g = parseInt(value.slice(3, 5), 16);
      const b = parseInt(value.slice(5, 7), 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return 'Usage: color hex|rgb <value>';
  }

  function toolJson(action, text) {
    if (!text) return 'Usage: json <json_string>';
    try {
      const parsed = JSON.parse(text);
      if (action === 'validate') {
        return `Valid JSON ✓<br>Type: ${Array.isArray(parsed) ? 'Array' : 'Object'}`;
      }
      return `<div class="code-block"><pre>${JSON.stringify(parsed, null, 2)}</pre></div>`;
    } catch (e) {
      return `Invalid JSON ✗<br>Error: ${e.message}`;
    }
  }

  function handleToolCommand(cmd) {
    const parts = cmd.split(' ');
    const tool = parts[0];
    const action = parts[1];

    let text = '';
    if (tool === 'json') {
      const jsonStart = cmd.indexOf('{');
      text = jsonStart >= 0 ? cmd.slice(jsonStart) : '';
    } else {
      text = parts.slice(2).join(' ');
    }

    const toolFn = { base64: toolBase64, url: toolUrl, uuid: toolUuid, pwd: toolPwd, hash: toolHash, color: toolColor, json: toolJson }[tool];
    return toolFn ? toolFn(action, text) : 'Unknown tool.';
  }

  // 命令历史
  const history = [];
  let historyIndex = -1;

  const hint = document.getElementById('input-hint');

  // 动态计算字符宽度（基于实际字体）
  let charWidth = 0;
  let hintCanvas;
  function getCharWidth() {
    if (!charWidth) {
      hintCanvas = document.createElement('canvas');
      const ctx = hintCanvas.getContext('2d');
      ctx.font = '13px "JetBrains Mono", "SF Mono", "Fira Code", monospace';
      charWidth = ctx.measureText('m').width;
    }
    return charWidth;
  }

  function updateHint() {
    const partial = input.value.trim().toLowerCase();
    if (!partial) {
      hint.textContent = '';
      hint.style.left = '0';
      return;
    }
    const matches = prefixMap[partial] || [];
    if (matches.length === 1) {
      hint.textContent = matches[0].slice(partial.length);
      hint.style.left = (partial.length * getCharWidth()) + 'px';
    } else {
      hint.textContent = '';
      hint.style.left = '0';
    }
  }

  function executeCommand(cmd) {
    addLine(`<span class="echo-prompt">tech@stack:~$</span> ${cmd}`, 'line-input');
    const cmdLower = cmd.toLowerCase();

    if (cmdLower === 'clear') {
      output.innerHTML = '';
    } else if (cmdLower in commandHandlers) {
      addLine(commandHandlers[cmdLower], 'line-result');
    } else if (TOOLS.includes(cmdLower.split(' ')[0])) {
      addLine(`<span class="cmd-result">${handleToolCommand(cmd)}</span>`, 'line-result');
    } else if (cmd.trim()) {
      addLine(`command not found: ${cmd}`, 'line-error');
    }

    if (cmd.trim()) {
      history.unshift(cmd);
      historyIndex = -1;
    }
  }

  input.addEventListener('input', updateHint);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      hint.textContent = '';
      executeCommand(input.value.trim());
      input.value = '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      hint.textContent = '';
      const partial = input.value.trim().toLowerCase();
      if (!partial) return;
      const matches = prefixMap[partial] || [];
      if (matches.length === 1) {
        input.value = matches[0];
      } else if (matches.length > 1) {
        addLine(`<span class="echo-prompt">tech@stack:~$</span> ${partial}`, 'line-input');
        addLine(matches.join('    '), 'line-result');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length && historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      } else if (historyIndex === 0) {
        historyIndex = -1;
        input.value = '';
      }
    }
  });

  document.querySelectorAll('.shortcut-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      hint.textContent = '';
      executeCommand(btn.dataset.cmd);
    });
  });

  input.focus({ preventScroll: true });
}

function buildToolsHelp() {
  const tools = [
    { name: 'base64', desc: 'Base64 编解码', usage: 'base64 encode|decode <text>' },
    { name: 'url', desc: 'URL 编解码', usage: 'url encode|decode <text>' },
    { name: 'uuid', desc: '生成 UUID', usage: 'uuid' },
    { name: 'pwd', desc: '生成随机密码', usage: 'pwd [length]' },
    { name: 'hash', desc: '简单哈希（演示用）', usage: 'hash <text>' },
    { name: 'color', desc: '颜色转换 (HEX ⇄ RGB)', usage: 'color hex|rgb <value>' },
    { name: 'json', desc: 'JSON 格式化与校验', usage: 'json <json_string>' }
  ];
  const rows = [];
  for (const t of tools) {
    rows.push(`<div class="item-row">
  <span class="item-bullet">◉</span>
  <span class="item-name">${t.name}</span>
  <span class="item-desc">${t.desc}</span>
</div>
<div class="item-row sub">
  <span class="item-hint">${t.usage}</span>
</div>
<div class="item-gap"></div>`);
  }
  return `<span class="section-head"># 开发工具 / Dev Tools</span>
${rows.join('')}`.replace(/<div class="item-gap"><\/div>$/, '');
}

function formatTech(type = 'all') {
  const sections = [];
  const addSection = (title, links) => {
    const rows = links.map(link => `<div class="item-row">
  <span class="item-bullet">◉</span>
  <span class="item-name">${link.title}</span>
  <span class="item-desc">${link.tag}</span>
  <a href="${link.url}" class="item-link" target="_blank">[docs]</a>
</div>`);
    sections.push(`<span class="section-head"># ${title}</span>${rows.join('')}`);
  };

  if (type === 'all' || type === 'frontend') addSection('Frontend', SITE_DATA.frontEndLinks);
  if (type === 'all' || type === 'backend') addSection('Backend', SITE_DATA.backEndLinks);
  if (type === 'all' || type === 'devtools') addSection('Dev Tools', SITE_DATA.devToolsLinks);

  return sections.join('');
}

function addLine(content, className) {
  const output = document.getElementById('terminal-output');
  const line = document.createElement('div');
  line.className = className || 'line-result';
  line.innerHTML = content;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

document.addEventListener('DOMContentLoaded', initShell);