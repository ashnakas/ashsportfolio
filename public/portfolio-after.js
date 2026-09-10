const work = document.createElement('section');
work.id = 'work';
work.className = 'portfolio-work';
work.innerHTML = `<header><span>01 / SELECTED WORK</span><a href="mailto:akasireddy3@gatech.edu">LET’S TALK ↗</a></header>
<div class="portfolio-work-title"><h2>Good questions.<br><em>Useful outcomes.</em></h2><p>Exploring the space between human needs,<br>emerging technology, and thoughtful design.</p></div>
<div class="portfolio-grid">
<a href="/pinwheels"><img src="/projects/pinwheels.png" alt="Pinwheels product concept"><span>PRODUCT CONCEPT · INTERACTION DESIGN</span><h3>Pinwheels ↗</h3><p>Turning passive scrolling into purposeful discovery.</p></a>
<a href="/recart"><img src="/projects/recart.png" alt="ReCart marketplace search"><span>PRODUCT DESIGN · DEVELOPMENT</span><h3>ReCart ↗</h3><p>Four resale marketplaces. One place to find your next thing.</p></a>
<article><img src="/projects/showability.png" alt="SHOWAbility accessibility concept"><span>ACCESSIBILITY · EXPERIENCE DESIGN</span><h3>SHOWAbility</h3><p>Making digital experiences more inclusive. Case study coming soon.</p></article>
<article><img src="/projects/cnn.png" alt="CNN Academy broadcast concept"><span>STORYTELLING · EXPERIENCE DESIGN</span><h3>CNN Academy</h3><p>Clarity and collaboration under a live deadline. Case study coming soon.</p></article>
</div>`;
document.querySelector('main')?.append(work);
const jump = document.createElement('a');
jump.className = 'portfolio-jump';
jump.href = '#work';
jump.textContent = 'SKIP TO WORK ↘';
document.body.append(jump);
