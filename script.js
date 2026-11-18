const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealTargets = document.querySelectorAll('.statement-content, .section-head, .project, .photo-copy, .secondary-photo, .about-layout, .lab-board, .process-list, .contact-main');
revealTargets.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => observer.observe(el));

const modal = document.querySelector('.project-modal');
const modalTitle = document.querySelector('#modal-title');
const modalDescription = document.querySelector('#modal-description');
const modalGithub = document.querySelector('#modal-github');
const modalClose = document.querySelector('.modal-close');
const modalStatus = document.querySelector('#modal-status');
const modalType = document.querySelector('#modal-type');
const modalRole = document.querySelector('#modal-role');
const modalFocus = document.querySelector('#modal-focus');
const modalCopy = document.querySelector('#modal-copy');

const projectData = {
  'Pikup': {
    status: 'BUILDING', type: 'PRODUCT / DELIVERY', role: 'CONCEPT + DEVELOPMENT', focus: 'Local delivery systems',
    description: 'A local delivery platform concept connecting customers, merchants and riders. I started it from a real problem: delivery around Buea can be unreliable, especially when there is no backup when a rider is unavailable.',
    github: 'https://github.com/staren02'
  },
  'Auto Elite': {
    status: 'CLIENT PROJECT', type: 'WEB / VEHICLES', role: 'WEB DEVELOPMENT', focus: 'Browsing + inventory',
    description: 'A real-world vehicle dealership and rental website. The main goal was straightforward: make the vehicles easy to discover, understand and browse without turning the site into a complicated catalogue.',
    github: 'https://github.com/staren02/autoelite'
  },
  'Student Marketplace': {
    status: 'PERSONAL PROJECT', type: 'WEB / COMMUNITY', role: 'DESIGN + DEVELOPMENT', focus: 'Student buying + selling',
    description: 'A marketplace concept built around the everyday buying and selling needs of students. It was one of the projects that helped me think beyond individual pages and more about how people actually move through a product.',
    github: 'https://github.com/staren02'
  }
};

function openProject(name) {
  const data = projectData[name];
  if (!data) return;
  modalTitle.textContent = name;
  modalDescription.textContent = data.description;
  modalGithub.href = data.github;
  modalStatus.textContent = data.status;
  modalType.textContent = data.type;
  modalRole.textContent = data.role;
  modalFocus.textContent = data.focus;
  modal.dataset.project = name;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modalClose?.focus();
}

document.querySelectorAll('.project').forEach(card => {
  const visual = card.querySelector('.project-visual');
  const button = card.querySelector('.project-open');
  const name = card.dataset.project;
  visual?.setAttribute('role', 'button');
  visual?.setAttribute('tabindex', '0');
  visual?.setAttribute('aria-label', `Open notes for ${name}`);
  visual?.addEventListener('click', () => openProject(name));
  visual?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProject(name); }
  });
  button?.addEventListener('click', () => openProject(name));
});

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

modalCopy?.addEventListener('click', async () => {
  const name = modal.dataset.project || 'project';
  const url = `${window.location.href.split('#')[0]}#work`;
  try {
    await navigator.clipboard.writeText(url);
    modalCopy.textContent = 'Copied';
    setTimeout(() => { modalCopy.textContent = 'Copy project link'; }, 1400);
  } catch {
    modalCopy.textContent = 'Link is #work';
    setTimeout(() => { modalCopy.textContent = 'Copy project link'; }, 1400);
  }
});

const sections = ['top', 'work', 'about', 'lab', 'process', 'contact'];
const navIndex = document.querySelector('.nav-index');
function updateNavIndex() {
  const y = window.scrollY + window.innerHeight * 0.35;
  let active = 0;
  sections.forEach((id, index) => {
    const section = document.getElementById(id);
    if (section && y >= section.offsetTop) active = index;
  });
  if (navIndex) navIndex.textContent = `${String(active).padStart(2, '0')} / 06`;
}
window.addEventListener('scroll', updateNavIndex, { passive: true });
updateNavIndex();

const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursorDot);
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
  @media (pointer: fine) {
    .cursor-dot { position: fixed; width: 7px; height: 7px; border-radius: 50%; background: var(--ink); pointer-events: none; z-index: 999; opacity: .65; transform: translate(-50%, -50%); transition: width .2s ease, height .2s ease, opacity .2s ease; }
    body:has(a:hover) .cursor-dot, body:has(button:hover) .cursor-dot { width: 13px; height: 13px; opacity: .35; }
  }
  @media (pointer: coarse) { .cursor-dot { display: none; } }
`;
document.head.appendChild(cursorStyle);
window.addEventListener('pointermove', event => {
  cursorDot.style.left = `${event.clientX}px`;
  cursorDot.style.top = `${event.clientY}px`;
}, { passive: true });

/* V5 interactions */
const progressBar = document.querySelector('.scroll-progress span');
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  if (progressBar) progressBar.style.width = `${ratio * 100}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Small image parallax: subtle enough to preserve the editorial feel.
const portrait = document.querySelector('.portrait-frame img');
const secondary = document.querySelector('.secondary-photo img');
let parallaxTick = false;
function parallax() {
  if (parallaxTick) return;
  parallaxTick = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    if (portrait && window.innerWidth > 900) portrait.style.transform = `scale(1.015) translateY(${Math.min(18, y * 0.012)}px)`;
    if (secondary && window.innerWidth > 900) secondary.style.transform = `translateY(${Math.max(-8, Math.min(8, (y - secondary.getBoundingClientRect().top) * 0.015))}px)`;
    parallaxTick = false;
  });
}
window.addEventListener('scroll', parallax, { passive:true });

// Public GitHub repositories, with a graceful fallback when offline.
const repoFeed = document.querySelector('#repo-feed');
async function loadRepos() {
  if (!repoFeed) return;
  try {
    const response = await fetch('https://api.github.com/users/staren02/repos?per_page=6&sort=updated', { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error('GitHub request failed');
    const repos = await response.json();
    if (!Array.isArray(repos) || !repos.length) throw new Error('No repositories');
    repoFeed.innerHTML = repos.slice(0,4).map(repo => {
      const description = repo.description ? repo.description.replace(/</g,'&lt;').replace(/>/g,'&gt;') : 'Public repository — no description yet.';
      return `<article class="repo-card"><a href="${repo.html_url}" target="_blank" rel="noopener"><h3 class="repo-name">${repo.name}</h3><p class="repo-description">${description}</p><div class="repo-meta"><span>${repo.language || 'CODE'}</span><span>${repo.stargazers_count} ★</span><span>OPEN ↗</span></div></a></article>`;
    }).join('');
  } catch (error) {
    repoFeed.innerHTML = `<div class="repo-card"><a href="https://github.com/staren02" target="_blank" rel="noopener"><h3 class="repo-name">See the full repository list</h3><p class="repo-description">GitHub could not be reached from this visit. The work is still there.</p><div class="repo-meta"><span>GITHUB</span><span>STAREN02</span><span>OPEN ↗</span></div></a></div>`;
  }
}
loadRepos();

// Make the contact email easy to copy without adding another visible control.
const emailLink = document.querySelector('.contact-link');
emailLink?.addEventListener('contextmenu', async () => {
  try { await navigator.clipboard.writeText('staren906@gmail.com'); } catch (_) {}
});


/* V6: persistent Dark Ash / Light theme */
const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("staren-theme");

function applyTheme(dark) {
  document.body.classList.toggle("dark-ash", dark);
  themeToggle?.setAttribute("aria-pressed", String(dark));
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark ash mode");
    const label = themeToggle.querySelector(".theme-label");
    if (label) label.textContent = dark ? "LIGHT" : "DARK ASH";
  }
}

applyTheme(savedTheme === "dark-ash");

themeToggle?.addEventListener("click", () => {
  const dark = !document.body.classList.contains("dark-ash");
  localStorage.setItem("staren-theme", dark ? "dark-ash" : "light");
  applyTheme(dark);
});

/* V6: mobile lab carousel — nearest card gets the dominant state */
const labRail = document.querySelector(".lab-rail");
const labCards = [...document.querySelectorAll(".lab-rail .lab-note")];

function updateLabFocus() {
  if (!labRail || !labCards.length) return;
  const center = labRail.scrollLeft + labRail.clientWidth / 2;

  labCards.forEach(card => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(center - cardCenter);
    card.classList.toggle("is-near", distance < card.offsetWidth * .62);
  });
}

labRail?.addEventListener("scroll", () => requestAnimationFrame(updateLabFocus), { passive: true });
window.addEventListener("resize", updateLabFocus);
window.addEventListener("load", updateLabFocus);
updateLabFocus();

/* V7 music player. Add licensed/owned files in assets/music/:
   staren-01.mp3 through staren-06.mp3 */
const musicTracks = [
  ["01 — After Hours","assets/music/staren-01.mp3"],
  ["02 — Soft Focus","assets/music/staren-02.mp3"],
  ["03 — Late Drive","assets/music/staren-03.mp3"],
  ["04 — Outside","assets/music/staren-04.mp3"],
  ["05 — Slow Motion","assets/music/staren-05.mp3"],
  ["06 — New Ideas","assets/music/staren-06.mp3"]
];
const musicAudio = new Audio();
musicAudio.preload = "metadata";
musicAudio.volume = .48;
const $m = id => document.getElementById(id);
let musicIndex = Math.max(0, Math.min(5, Number(localStorage.getItem("staren-track-index") || 0)));

function renderMusicMenu() {
  const menu = $m("musicMenu");
  menu.innerHTML = "";
  musicTracks.forEach((t,i) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = t[0];
    b.onclick = () => { setMusicTrack(i,true); menu.hidden=true; $m("musicList").setAttribute("aria-expanded","false"); };
    menu.appendChild(b);
  });
}
function setMusicTrack(i, play=false) {
  musicIndex = (i + musicTracks.length) % musicTracks.length;
  musicAudio.src = musicTracks[musicIndex][1];
  $m("musicTitle").textContent = musicTracks[musicIndex][0];
  localStorage.setItem("staren-track-index", musicIndex);
  [...$m("musicMenu").children].forEach((b,n)=>b.classList.toggle("active",n===musicIndex));
  if (play) musicAudio.play().then(()=>setMusicPlaying(true)).catch(()=>{$m("musicStatus").textContent="TAP TO PLAY";});
}
function setMusicPlaying(on) {
  $m("musicStatus").textContent = on ? "PLAYING" : "PAUSED";
  $m("musicPlay").setAttribute("aria-pressed", String(on));
  $m("musicPlay").setAttribute("aria-label", on ? "Pause portfolio music" : "Play portfolio music");
}
function toggleMusic() {
  if (musicAudio.paused) setMusicTrack(musicIndex,true);
  else { musicAudio.pause(); setMusicPlaying(false); }
}
renderMusicMenu(); setMusicTrack(musicIndex);
$m("musicPlay").onclick = toggleMusic;
$m("musicPrev").onclick = () => setMusicTrack(musicIndex-1,true);
$m("musicNext").onclick = () => setMusicTrack(musicIndex+1,true);
musicAudio.onended = () => setMusicTrack(musicIndex+1,true);
$m("musicList").onclick = () => {
  const menu=$m("musicMenu"), open=menu.hidden;
  menu.hidden=!open; $m("musicList").setAttribute("aria-expanded",String(open));
};

/* Browsers commonly block unsolicited autoplay. Scrolling requests playback,
   while the visible player remains available for an explicit tap. */
let scrollAttempted=false;
addEventListener("scroll",()=>{
  if(scrollAttempted || !musicAudio.paused) return;
  scrollAttempted=true;
  musicAudio.play().then(()=>setMusicPlaying(true)).catch(()=>{});
},{passive:true});

/* V7 FIX — local six-track music player */
const musicTracks=[
["01 — Track One","assets/music/staren-01.mp3"],
["02 — Track Two","assets/music/staren-02.mp3"],
["03 — Track Three","assets/music/staren-03.mp3"],
["04 — Track Four","assets/music/staren-04.mp3"],
["05 — Track Five","assets/music/staren-05.mp3"],
["06 — Track Six","assets/music/staren-06.mp3"]
];
const audio=new Audio(); audio.preload="metadata"; audio.volume=.48;
const byId=id=>document.getElementById(id);
let mi=parseInt(localStorage.getItem("staren-track-index")||"0",10);
if(mi<0||mi>5)mi=0;
function loadTrack(i,play=false){
 mi=(i+6)%6; audio.src=musicTracks[mi][1];
 if(byId("musicTitle"))byId("musicTitle").textContent=musicTracks[mi][0];
 localStorage.setItem("staren-track-index",mi); updateMusic();
 if(play)audio.play().then(updateMusic).catch(()=>{if(byId("musicStatus"))byId("musicStatus").textContent="TAP TO PLAY"});
}
function updateMusic(){
 if(byId("musicStatus"))byId("musicStatus").textContent=audio.paused?"READY":"PLAYING";
 if(byId("musicPlay")){byId("musicPlay").setAttribute("aria-pressed",String(!audio.paused));byId("musicPlay").setAttribute("aria-label",audio.paused?"Play portfolio music":"Pause portfolio music")}
}
const menu=byId("musicMenu");
if(menu)musicTracks.forEach((t,i)=>{const b=document.createElement("button");b.type="button";b.textContent=t[0];b.onclick=()=>{loadTrack(i,true);menu.hidden=true};menu.appendChild(b)});
loadTrack(mi);
byId("musicPlay")?.addEventListener("click",()=>audio.paused?loadTrack(mi,true):audio.pause());
byId("musicPrev")?.addEventListener("click",()=>loadTrack(mi-1,true));
byId("musicNext")?.addEventListener("click",()=>loadTrack(mi+1,true));
audio.addEventListener("ended",()=>loadTrack(mi+1,true));
audio.addEventListener("play",updateMusic); audio.addEventListener("pause",updateMusic);
byId("musicList")?.addEventListener("click",()=>{menu.hidden=!menu.hidden});

/* Dark Ash / Light */
function setTheme(dark){
 document.body.classList.toggle("dark-ash",dark);
 document.documentElement.classList.toggle("dark-ash",dark);
 localStorage.setItem("staren-theme",dark?"dark-ash":"light");
 const b=byId("themeToggle");
 if(b){b.setAttribute("aria-pressed",String(dark));b.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark ash mode");const l=b.querySelector(".theme-label");if(l)l.textContent=dark?"LIGHT":"DARK ASH";}
}
setTheme(localStorage.getItem("staren-theme")==="dark-ash");
byId("themeToggle")?.addEventListener("click",()=>setTheme(!document.body.classList.contains("dark-ash")));
