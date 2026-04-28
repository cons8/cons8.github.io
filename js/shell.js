// Shell Terminal Logic
const COMMANDS = ['help', 'list', 'fe', 'be', 'about', 'clear', 'tools'];

function initShell() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  const help = [
    '<span class="cmd">help</span>      - Show available commands',
    '<span class="cmd">list</span>      - List all technologies',
    '<span class="cmd">fe</span>        - Show frontend tech',
    '<span class="cmd">be</span>        - Show backend tech',
    '<span class="cmd">about</span>     - About this site',
    '<span class="cmd">tools</span>     - Show developer tools',
    '<span class="cmd">json</span>      - Format/validate JSON',
    '<span class="cmd">clear</span>     - Clear terminal'
  ].join('\n');

  const commands = {
    help,
    list: formatTech(),
    fe: formatTech('frontend'),
    be: formatTech('backend'),
    frontend: formatTech('frontend'),
    backend: formatTech('backend'),
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
    tools: `<span class="section-head"># 开发工具 / Dev Tools</span>
<div class="item-row">
  <span class="item-bullet">◉</span>
  <span class="item-name">base64</span>
  <span class="item-desc">Base64 编解码</span>
</div>
<div class="item-row sub">
  <span class="item-hint">Usage: base64 encode|decode &lt;text&gt;</span>
</div>
<div class="item-gap"></div>
<div class="item-row">
  <span class="item-bullet">◉</span>
  <span class="item-name">url</span>
  <span class="item-desc">URL 编解码</span>
</div>
<div class="item-row sub">
  <span class="item-hint">Usage: url encode|decode &lt;text&gt;</span>
</div>
<div class="item-gap"></div>
<div class="item-row">
  <span class="item-bullet">◉</span>
  <span class="item-name">uuid</span>
  <span class="item-desc">生成 UUID</span>
</div>
<div class="item-row sub">
  <span class="item-hint">Usage: uuid</span>
</div>
<div class="item-gap"></div>
<div class="item-row">
  <span class="item-bullet">◉</span>
  <span class="item-name">pwd</span>
  <span class="item-desc">生成随机密码</span>
</div>
<div class="item-row sub">
  <span class="item-hint">Usage: pwd [length]</span>
</div>
<div class="item-gap"></div>
<div class="item-row">
  <span class="item-bullet">◉</span>
  <span class="item-name">hash</span>
  <span class="item-desc">计算哈希 (MD5/SHA)</span>
</div>
<div class="item-row sub">
  <span class="item-hint">Usage: hash md5|sha1|sha256 &lt;text&gt;</span>
</div>
<div class="item-gap"></div>
<div class="item-row">
  <span class="item-bullet">◉</span>
  <span class="item-name">color</span>
  <span class="item-desc">颜色转换 (HEX ⇄ RGB)</span>
</div>
<div class="item-row sub">
  <span class="item-hint">Usage: color hex|rgb &lt;value&gt;</span>
</div>
<div class="item-gap"></div>
<div class="item-row">
  <span class="item-bullet">◉</span>
  <span class="item-name">json</span>
  <span class="item-desc">JSON 格式化与校验</span>
</div>
<div class="item-row sub">
  <span class="item-hint">Usage: json format|validate &lt;text&gt;</span>
</div>`
  };

  // 小工具函数
  function toolBase64(action, text) {
    try {
      if (action === 'encode') {
        return btoa(unescape(encodeURIComponent(text)));
      } else if (action === 'decode') {
        return decodeURIComponent(escape(atob(text)));
      }
    } catch (e) {
      return 'Error: Invalid input';
    }
    return 'Usage: base64 encode|decode <text>';
  }

  function toolUrl(action, text) {
    try {
      if (action === 'encode') {
        return encodeURIComponent(text);
      } else if (action === 'decode') {
        return decodeURIComponent(text);
      }
    } catch (e) {
      return 'Error: Invalid input';
    }
    return 'Usage: url encode|decode <text>';
  }

  function toolUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function toolPwd(len = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function toolHash(type, text) {
    if (!text) return 'Usage: hash md5|sha1|sha256 <text>';
    // 简单的 JavaScript 哈希实现
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const chr = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `hash:${type} = ${hex}`;
  }

  function toolColor(type, value) {
    if (type === 'hex' && value) {
      const match = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
    } else if (type === 'rgb' && value) {
      const match = value.match(/^#([0-9a-fA-F]{6})$/);
      if (match) {
        const r = parseInt(match[1].substring(0, 2), 16);
        const g = parseInt(match[1].substring(2, 4), 16);
        const b = parseInt(match[1].substring(4, 6), 16);
        return `rgb(${r}, ${g}, ${b})`;
      }
    }
    return 'Usage: color hex|rgb <value>';
  }

  function toolJson(action, text) {
    if (!text) return 'Usage: json format|validate <text>';
    try {
      const parsed = JSON.parse(text);
      if (action === 'validate') {
        return `Valid JSON ✓<br>Type: ${Array.isArray(parsed) ? 'Array' : 'Object'}`;
      }
      const formatted = JSON.stringify(parsed, null, 2);
      return `<div class="code-block"><pre>${formatted}</pre></div>`;
    } catch (e) {
      return `Invalid JSON ✗<br>Error: ${e.message}`;
    }
  }

  // 处理工具命令
  function handleToolCommand(cmd) {
    const parts = cmd.split(' ');
    const tool = parts[0];
    const action = parts[1];

    // 对于 json 命令，从第一个 { 开始截取，兼容含空格的 JSON
    let text = '';
    if (tool === 'json') {
      const jsonStart = cmd.indexOf('{');
      text = jsonStart >= 0 ? cmd.slice(jsonStart) : '';
    } else {
      text = parts.slice(2).join(' ');
    }

    let result = '';
    switch (tool) {
      case 'base64':
        result = toolBase64(action, text);
        break;
      case 'url':
        result = toolUrl(action, text);
        break;
      case 'uuid':
        result = toolUuid();
        break;
      case 'pwd':
        result = toolPwd(parseInt(text) || 16);
        break;
      case 'hash':
        result = toolHash(action, text);
        break;
      case 'color':
        result = toolColor(action, text);
        break;
      case 'json':
        result = toolJson(action, text);
        break;
      default:
        result = 'Unknown tool. Type <span class="cmd">tools</span> to see available tools.';
    }
    return result;
  }

  // 命令历史记录
  const history = [];
  let historyIndex = -1;

  const hint = document.getElementById('input-hint');

  function updateHint() {
    const partial = input.value.trim().toLowerCase();
    if (partial) {
      const matches = COMMANDS.filter(c => c.startsWith(partial));
      if (matches.length === 1 && matches[0] !== input.value.toLowerCase()) {
        hint.textContent = matches[0].slice(partial.length);
        // 计算提示位置
        const charWidth = 7.8; // 单字符宽度(px)，基于13px monospace
        hint.style.left = (partial.length * charWidth) + 'px';
      } else {
        hint.textContent = '';
        hint.style.left = '0';
      }
    } else {
      hint.textContent = '';
      hint.style.left = '0';
    }
  }

  // 执行命令的函数
  function executeCommand(cmd) {
    addLine(`<span class="echo-prompt">tech@stack:~$</span> ${cmd}`, 'line-input');

    const cmdLower = cmd.toLowerCase();

    if (cmdLower === 'clear') {
      output.innerHTML = '';
    } else if (commands[cmdLower]) {
      addLine(commands[cmdLower], 'line-result');
    } else if (['base64', 'url', 'uuid', 'pwd', 'hash', 'color', 'json'].includes(cmdLower.split(' ')[0])) {
      const result = handleToolCommand(cmd);
      addLine(`<span class="cmd-result">${result}</span>`, 'line-result');
    } else if (cmd.trim()) {
      addLine(`command not found: ${cmd}`, 'line-error');
    }

    // 保存历史
    if (cmd.trim()) {
      history.unshift(cmd);
      historyIndex = -1;
    }
  }

  // 输入框事件
  input.addEventListener('input', updateHint);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      hint.textContent = '';
      const cmd = input.value.trim();
      executeCommand(cmd);
      input.value = '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      hint.textContent = '';
      const partial = input.value.trim().toLowerCase();
      if (partial) {
        const matches = COMMANDS.filter(c => c.startsWith(partial));
        if (matches.length === 1) {
          input.value = matches[0];
        } else if (matches.length > 1) {
          // 显示所有匹配项
          addLine(`<span class="echo-prompt">tech@stack:~$</span> ${partial}`, 'line-input');
          addLine(matches.join('    '), 'line-result');
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
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

  // 快捷按钮事件
  document.querySelectorAll('.shortcut-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      hint.textContent = '';
      const cmd = btn.dataset.cmd;
      executeCommand(cmd);
    });
  });

  input.focus();
}

function formatTech(type = 'all') {
  let result = '';

  if (type === 'all' || type === 'frontend') {
    result += '<span class="section-head"># Frontend</span>';
    SITE_DATA.frontEndLinks.forEach(link => {
      result += `<div class="item-row">
        <span class="item-bullet">◉</span>
        <span class="item-name">${link.title}</span>
        <span class="item-desc">${link.tag}</span>
        <a href="${link.url}" class="item-link" target="_blank">[docs]</a>
      </div>`;
    });
  }

  if (type === 'all' || type === 'backend') {
    result += '<span class="section-head"># Backend</span>';
    SITE_DATA.backEndLinks.forEach(link => {
      result += `<div class="item-row">
        <span class="item-bullet">◉</span>
        <span class="item-name">${link.title}</span>
        <span class="item-desc">${link.tag}</span>
        <a href="${link.url}" class="item-link" target="_blank">[docs]</a>
      </div>`;
    });
  }

  return result;
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