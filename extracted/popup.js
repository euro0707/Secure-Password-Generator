const symbols = "!@#$%^&*()_+-=[]{}";
const excludeChars = /[0OIl1]/g;
const historyLimit = 10;

function generatePassword(length, useSymbols, useUppercase) {
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const nums = "23456789";
  const syms = "!@#$%^&*";

  let chars = lower + nums;
  if (useUppercase) chars += upper;
  if (useSymbols) chars += syms;

  let password = "";
  password += lower.charAt(Math.floor(Math.random() * lower.length));

  for (let i = 1; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password.replace(excludeChars, "");
}

function updateStrengthBar(pw) {
  const bar = document.getElementById("strengthBar");
  const length = pw.length;
  const score = (/[A-Z]/.test(pw) ? 1 : 0) + (/[!@#\$%^&*]/.test(pw) ? 1 : 0) + (/[0-9]/.test(pw) ? 1 : 0);
  let strength = "弱";
  if (length >= 16 && score >= 2) strength = "中";
  if (length >= 20 && score === 3) strength = "強";
  bar.textContent = `強度: ${strength}`;
}

function saveToHistory(pw) {
  const history = JSON.parse(localStorage.getItem("passwordHistory") || "[]");
  history.unshift(pw);
  const trimmed = history.slice(0, historyLimit);
  localStorage.setItem("passwordHistory", JSON.stringify(trimmed));
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("passwordHistory") || "[]");
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  history.forEach((pw, index) => {
    const li = document.createElement("li");
    
    const passwordSpan = document.createElement("span");
    passwordSpan.className = "password-text";
    passwordSpan.textContent = pw;

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "コピー";
    copyBtn.onclick = () => navigator.clipboard.writeText(pw);

    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.onclick = () => {
      history.splice(index, 1);
      localStorage.setItem("passwordHistory", JSON.stringify(history));
      loadHistory();
    };

    buttonGroup.appendChild(copyBtn);
    buttonGroup.appendChild(delBtn);
    
    li.appendChild(passwordSpan);
    li.appendChild(buttonGroup);
    list.appendChild(li);
  });
}

document.getElementById("generateBtn").onclick = () => {
  const length = parseInt(document.getElementById("lengthSlider").value);
  const useSymbols = document.getElementById("includeSymbols").checked;
  const useUpper = document.getElementById("includeUppercase").checked;

  const pw = generatePassword(length, useSymbols, useUpper);
  document.getElementById("generatedPassword").textContent = pw;
  updateStrengthBar(pw);
  saveToHistory(pw);
};

document.getElementById("lengthSlider").oninput = (e) => {
  document.getElementById("lengthValue").textContent = e.target.value;
};

document.getElementById("copyBtn").onclick = () => {
  const passwordText = document.getElementById("generatedPassword").textContent;
  if (passwordText) {
    navigator.clipboard.writeText(passwordText);
  }
};

window.onload = loadHistory;
