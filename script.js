// ----------------------
// APP STATE
// ----------------------
let energyLevel = 2; // 1-low,2-med,3-high default
let lastLogin = localStorage.getItem('lastLogin') || Date.now();
let flameBrightness = parseFloat(localStorage.getItem('flameBrightness')) || 1;
let tasksCompleted = JSON.parse(localStorage.getItem('tasksCompleted')) || [];
let flameCanvas = document.getElementById('flameCanvas');
let ctx = flameCanvas.getContext('2d');

// ----------------------
// LANDING PAGE
// ----------------------
document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('questionnaire').classList.remove('hidden');
  generateQuestions();
});

// ----------------------
// QUESTIONNAIRE (Natural Questions)
// ----------------------
const questions = [
  { q: "How's your energy right now? (Low/Medium/High)", type: "select", options:["Low","Medium","High"] },
  { q: "How stressed or overwhelmed do you feel? (Low/Medium/High)", type: "select", options:["Low","Medium","High"] },
  { q: "How well did you sleep last night? (Poor/Okay/Great)", type: "select", options:["Poor","Okay","Great"] },
  { q: "How focused do you feel today? (Not at all/Somewhat/Very)", type: "select", options:["Not at all","Somewhat","Very"] },
  { q: "How much time can you dedicate to your reset today?", type: "select", options:["5 min","10 min","20 min","30+ min"] },
  { q: "What's weighing on you most right now?", type: "text" },
  { q: "What's one thing you've been avoiding?", type: "text" },
  { q: "How would you describe your mood today?", type: "text" },
  { q: "What feels most out of balance in your life?", type: "text" },
  { q: "What do you miss about how you used to feel?", type: "text" },
  { q: "Do you prefer tasks that are gentle or slightly challenging?", type: "select", options:["Gentle","Slightly Challenging"] },
  { q: "Do you enjoy moving around or sitting still for tasks?", type: "select", options:["Moving","Sitting Still"] },
  { q: "Do you prefer tasks indoors or outdoors?", type: "select", options:["Indoors","Outdoors"] },
  { q: "Do you feel more alert in the morning or evening?", type: "select", options:["Morning","Evening"] },
  { q: "How much decision-making do you like in your tasks?", type: "select", options:["None","Some","A lot"] },
  { q: "What's one thing you'd like to feel more of in the next month?", type:"text"},
  { q: "What's one thing you'd like to feel less of?", type:"text"},
  { q: "How would a 'better day' look for you?", type:"text"},
  { q: "If today went perfectly, what would you accomplish?", type:"text"},
  { q: "One small habit you'd like to try this week?", type:"text"}
];

function generateQuestions(){
  const container = document.getElementById('questionsContainer');
  container.innerHTML = "";
  questions.forEach((q,i)=>{
    const div = document.createElement('div');
    div.innerHTML = `<label>${q.q}</label><br>`;
    if(q.type==="number"){
      div.innerHTML += `<input type="number" id="q${i}" min="${q.min}" max="${q.max}" required>`;
    } else if(q.type==="select"){
      let options = q.options.map(opt=>`<option value="${opt}">${opt}</option>`).join('');
      div.innerHTML += `<select id="q${i}" required>${options}</select>`;
    } else {
      div.innerHTML += `<input type="text" id="q${i}" required>`;
    }
    container.appendChild(div);
  });
}

document.getElementById('questionForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const energy = document.getElementById('q0').value;
  if(energy==="Low") energyLevel=1;
  else if(energy==="Medium") energyLevel=2;
  else energyLevel=3;
  
  localStorage.setItem('lastLogin', Date.now());
  localStorage.setItem('energyLevel', energyLevel);
  showFlamePage();
});

// ----------------------
// FLAME PAGE
// ----------------------
function showFlamePage(){
  document.getElementById('questionnaire').classList.add('hidden');
  document.getElementById('flamePage').classList.remove('hidden');
  drawFlame();
  loadDailyTask();
}

function loadDailyTask(){
  const taskText = document.getElementById('taskText');

  const lowTasks = [
    "Drink a glass of water and stretch your arms gently.",
    "Open a window and take 2 deep breaths.",
    "Sit somewhere quiet and notice 3 things you can see.",
    "Write one word about how you’re feeling right now."
  ];

  const medTasks = [
    "Tidy a small area in your space, like your desk or a shelf.",
    "Take a quick shower and put on something comfortable.",
    "Write 3 sentences about what happened today or how you feel.",
    "Take a short walk around your home or yard."
  ];

  const highTasks = [
    "Organize one part of your room that bothers you.",
    "Plan tomorrow: 3 small things you want to accomplish.",
    "Apply for or explore one opportunity you’ve been avoiding.",
    "Try a new activity or task that feels productive but enjoyable."
  ];

  let task;
  if(energyLevel==1) task = lowTasks[Math.floor(Math.random()*lowTasks.length)];
  else if(energyLevel==2) task = medTasks[Math.floor(Math.random()*medTasks.length)];
  else task = highTasks[Math.floor(Math.random()*highTasks.length)];

  taskText.innerText = task;
}

document.getElementById('completeTaskBtn').addEventListener('click', ()=>{
  flameBrightness = 1.5;
  drawFlame();
  setTimeout(()=>{flameBrightness=1; drawFlame();},1000);
  tasksCompleted.push({date: Date.now(), task: document.getElementById('taskText').innerText});
  localStorage.setItem('tasksCompleted', JSON.stringify(tasksCompleted));
});

// ----------------------
// FLAME DRAWING (Fade/Burst)
// ----------------------
function drawFlame(){
  const now = Date.now();
  const daysSince = Math.floor((now - lastLogin)/(1000*60*60*24));
  let fadeFactor = 1;
  if(daysSince>0){
    fadeFactor = Math.max(0.3, 1 - daysSince*0.2);
  }
  localStorage.setItem('flameBrightness', flameBrightness*fadeFactor);

  ctx.clearRect(0,0,flameCanvas.width,flameCanvas.height);
  let gradient = ctx.createRadialGradient(100,100,10,100,100,80);
  gradient.addColorStop(0,"rgba(255,160,80," + flameBrightness*fadeFactor + ")");
  gradient.addColorStop(1,"rgba(255,80,0,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(100,100,80,0,2*Math.PI);
  ctx.fill();

  requestAnimationFrame(drawFlame);
}

drawFlame();
