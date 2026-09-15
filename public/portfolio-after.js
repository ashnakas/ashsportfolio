const work = document.createElement('section');
work.id = 'work';
work.className = 'portfolio-work';
work.innerHTML = `<header><span>SELECTED WORK / ASHNA KASIREDDY</span><a href="mailto:akasireddy3@gatech.edu">LET’S TALK ↗</a></header>
<div class="portfolio-work-title"><h2>Selected work<span> (04)</span></h2><p>Product design. Interaction. Accessibility.</p></div>
<div class="portfolio-grid">
<a href="/recart"><img src="/projects/recart.png" alt="ReCart marketplace search"><span>PRODUCT DESIGN · DEVELOPMENT</span><h3>ReCart ↗</h3><p>Four resale marketplaces. One place to find your next thing.</p></a>
<a href="/pinwheels"><img src="/projects/pinwheels.png" alt="Pinwheels product concept"><span>PRODUCT CONCEPT · INTERACTION DESIGN</span><h3>Pinwheels ↗</h3><p>Turning passive scrolling into purposeful discovery.</p></a>
<article><img src="/projects/showability.png" alt="SHOWAbility accessibility concept"><span>ACCESSIBILITY · EXPERIENCE DESIGN</span><h3>SHOWAbility</h3><p>Making digital experiences more inclusive. Case study coming soon.</p></article>
<article><img src="/projects/cnn.png" alt="CNN Academy broadcast concept"><span>STORYTELLING · EXPERIENCE DESIGN</span><h3>CNN Academy</h3><p>Clarity and collaboration under a live deadline. Case study coming soon.</p></article>
</div><footer><a href="#">↑ Back to the city</a><span>Ashna Kasireddy · Product design</span></footer>`;
document.querySelector('main')?.append(work);
