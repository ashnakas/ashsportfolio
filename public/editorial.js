const work=document.createElement('section');
work.id='work';work.className='portfolio-work';

const projects=[
  {
    slug:'recart',number:'01',name:'ReCart',eyebrow:'Product design + development · 2026',
    premise:'One search across four secondhand marketplaces.',
    challenge:'Finding one item meant repeating the same search across disconnected platforms.',
    move:'I designed and built one search flow for discovery, comparison, and saving.',
    result:'An end-to-end product prototype that makes fragmented inventory feel like one catalog.',
    className:'recart-project',
    visual:`<div class="browser-ui"><div class="browser-bar"><i></i><i></i><i></i><span>recart / search</span></div><div class="search-command"><span>vintage leather jacket</span><b>⌕</b></div><div class="market-row"><span>Depop</span><span>eBay</span><span>Poshmark</span><span>ThredUp</span></div><div class="result-grid"><i></i><i></i><i></i><i></i></div></div>`
  },
  {
    slug:'pinwheels',number:'02',name:'Pinwheels',eyebrow:'Product concept · 2026',
    premise:'Turn passive scrolling into directed discovery.',
    challenge:'Short-form feeds inspire people, but rarely help them turn inspiration into action.',
    move:'I added a “spin” interaction that lets people steer an idea, explore visually, and save with intent.',
    result:'Prototype testing indicated more idea saves, more boards created, and higher task completion.',
    className:'pinwheels-project',
    visual:`<div class="phone-stage"><div class="mini-phone"><span>For you</span><div class="idea-image one"></div><b>Save</b></div><div class="mini-phone focus"><span>Where should<br>this idea go?</span><div class="choice">More colorful</div><div class="choice">Under $500</div><div class="choice">More vintage</div></div><div class="mini-phone"><span>Your board</span><div class="board-grid"><i></i><i></i><i></i><i></i></div><b>Create board</b></div></div>`
  },
  {
    slug:'projects/showability',number:'03',name:'SHOWAbility',eyebrow:'Research + accessible experience · 2025–now',
    premise:'Make participation easier to find and act on.',
    challenge:'People encountered unclear paths, scattered information, and unnecessary barriers to participation.',
    move:'I combined stakeholder interviews, analytics, information architecture, and clearer user flows.',
    result:'The redesign contributed to +42% qualified engagement and +27% repeat-visitor retention.',
    className:'showability-project',
    visual:`<div class="access-ui"><div class="access-nav">SHOWAbility <span>Opportunities&nbsp;&nbsp; Resources&nbsp;&nbsp; Join</span></div><div class="access-hero"><small>ACCESS STARTS WITH CLARITY</small><strong>Find your<br>next step.</strong><button>Explore opportunities →</button></div><div class="access-stats"><span><b>+42%</b> qualified engagement</span><span><b>+27%</b> repeat visitors</span></div></div>`
  },
  {
    slug:'projects/seatscore',number:'04',name:'AI SeatScore',eyebrow:'React recommendation prototype · 2026',
    premise:'A seat recommendation based on what matters to you.',
    challenge:'Seat maps show availability, but leave people to decode sightlines, distance, and accessibility alone.',
    move:'I built a recommendation flow that weighs view, distance, accessibility, and personal preferences.',
    result:'A working React prototype refined through structured user feedback.',
    className:'seat-project',
    visual:`<div class="seat-ui"><div class="stage-label">STAGE</div><div class="seat-map">${Array.from({length:48},(_,i)=>`<i${[18,19,26].includes(i)?' class="selected"':''}></i>`).join('')}</div><div class="seat-panel"><small>YOUR BEST MATCH</small><strong>ORCH · C12</strong><span>Clear view</span><span>Low walking distance</span><span>Accessible route</span></div></div>`
  }
];

const projectMarkup=projects.map(project=>`<article class="case-card ${project.className}">
  <a class="case-visual" href="/${project.slug}" aria-label="Open the full ${project.name} case study">${project.visual}<span class="case-open">Full case study ↗</span></a>
  <div class="case-heading"><span>${project.number}</span><div><p>${project.eyebrow}</p><h3>${project.name}</h3><h4>${project.premise}</h4></div></div>
  <div class="case-story"><div><span>Context</span><p>${project.challenge}</p></div><div><span>What I did</span><p>${project.move}</p></div><div><span>Outcome</span><p>${project.result}</p></div></div>
</article>`).join('');

work.innerHTML=`<div class="work-heading"><span>01 / SELECTED WORK</span><div><p>PRODUCT · RESEARCH · CODE</p><h2>Work you can<br>understand at a glance.</h2></div></div>
<div class="editorial-projects">${projectMarkup}</div>
<section class="more-work" aria-labelledby="more-title"><h2 id="more-title">More work, same approach.</h2>
  <a href="/projects/opslens"><span>OpsLens</span><span>Mapped 50k+ synthetic operational events into decisions about routing, staffing, and automation.</span><span>Python / SQL · 2026 ↗</span></a>
  <a href="/projects/cnn"><span>CNN Academy</span><span>Made a complex newsroom simulation clearer for more than 100 global participants.</span><span>Experience strategy · 2024–26 ↗</span></a>
</section>
<section class="about-section" id="about" aria-labelledby="about-title"><span>02 / ABOUT</span><div><h2 id="about-title">I connect the dots<br>and build the thing.</h2><p class="about-lead">I’m a full stack designer and developer at Georgia Tech, working across research, interfaces, and the systems that make them work.</p><p>At SHOWAbility, I bring user research, accessibility, and engagement data into a digital platform redesign. At Corpay, I shipped frontend and backend workflows for fleet and payments products. With CNN Academy, I helped turn a complex simulation into a clear experience for more than 100 participants.</p><p>I’m interested in AI that helps people make decisions—and interfaces that keep people in control.</p><div class="about-facts"><div><h3>Education</h3><p>Georgia Tech<br>B.S. Computational Media · Dec. 2026<br>Minor in Film<br>M.S. Human-Computer Interaction · Incoming 2027</p></div><div><h3>Tools + methods</h3><p>React · TypeScript · Node.js · Python · SQL<br>Figma · Framer · REST APIs<br>User research · Information architecture<br>AI-assisted design and development</p></div></div><a class="text-link" href="https://www.linkedin.com/in/ashnakasireddy/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></section>
<footer class="contact-section" id="contact"><span>03 / GET IN TOUCH</span><h2>Let’s make<br>something useful.</h2><a class="contact-email" href="mailto:akasireddy3@gatech.edu">akasireddy3@gatech.edu ↗</a><div class="footer-bottom"><span>Ashna Kasireddy · Full stack</span><a href="#">Back to the city ↑</a></div></footer>`;
document.querySelector('main')?.append(work);
