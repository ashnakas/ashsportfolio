import './case-study.css';

export type ProjectKey = 'recart' | 'pinwheels' | 'showability' | 'moonbase' | 'seatscore' | 'opslens' | 'cnn';
type Decision = { title: string; choice: string; tradeoff: string };
type Project = {
  key: ProjectKey; title: string; eyebrow: string; subtitle: string; summary: string;
  role: string; team: string; timeline: string; status: string; prototype?: string;
  question: string; problem: string; insight: string; process: { title: string; text: string }[];
  decisions: Decision[]; outcome: string; limitation: string; evaluation: string[];
  next: { href: string; name: string };
};

export const projects: Record<ProjectKey, Project> = {
  recart: {
    key:'recart',title:'ReCart',eyebrow:'Product design + front-end prototype',subtitle:'Search once. Compare in context.',
    summary:'A secondhand shopping concept that brings discovery, filtering, and comparison into one interface.',
    role:'Product design · Front-end',team:'Independent project',timeline:'2026',status:'Interactive prototype',
    prototype:'https://www.figma.com/make/5uGcxR1qXfcRsH35Zhni7g/Secondhand-Shopping-Platform--Copy-?code-node-id=0-9&p=f&t=4mRie6Ai8Nt8FDYA-0&fullscreen=1',
    question:'What information should stay consistent when the inventory comes from different places?',
    problem:'Secondhand shoppers repeat searches across platforms with different filters, labels, and listing formats. Comparing an item means carrying its price, condition, and source from one tab to the next.',
    insight:'The opportunity sits between marketplaces: one comparison model that preserves enough source context to make a decision.',
    process:[
      {title:'Locate the repeated work',text:'The cross-marketplace journey became the starting point: entering the same query, applying filters again, and remembering the differences between listings.'},
      {title:'Define a shared listing model',text:'Search, price, condition, source, and saved finds form the common interface. Source identity stays attached to each result rather than disappearing into a generic catalog.'},
      {title:'Make the flow tangible',text:'The responsive prototype connects discovery, filtering, and comparison. Building the interaction makes states such as filtering and empty results concrete enough to inspect.'}
    ],
    decisions:[
      {title:'One query, several sources',choice:'Bring the search entry point together so comparison can begin in one place.',tradeoff:'A shared interface needs consistent attributes. It cannot assume every marketplace describes an item the same way.'},
      {title:'Keep the source in view',choice:'Include marketplace context alongside price and condition.',tradeoff:'A denser result preserves information people need to evaluate a seller or follow a listing back to its origin.'},
      {title:'Filter without losing the task',choice:'Keep the results visible as criteria change.',tradeoff:'The interface needs a clear empty state and a way to recover when a combination becomes too restrictive.'}
    ],
    outcome:'An end-to-end interactive concept for a fragmented shopping journey.',
    limitation:'This is a product prototype. The portfolio does not establish live inventory integrations, completed transactions, or measured time savings.',
    evaluation:['Ask shoppers to compare the same items across separate tabs and the unified prototype.','Observe which source details they need before trusting a result.','Check how they recover from an empty result and whether they understand what is being filtered.'],
    next:{href:'/pinwheels',name:'Pinwheels'}
  },
  pinwheels:{
    key:'pinwheels',title:'Pinwheels',eyebrow:'Independent Pinterest concept',subtitle:'Let people steer the next idea.',
    summary:'A discovery concept that connects a short-form inspiration feed with explicit direction, visual exploration, and saving.',
    role:'Product strategy · UI/UX',team:'Independent concept',timeline:'Fall 2026',status:'Concept prototype',
    question:'What if discovering an idea also helped you decide where to take it?',
    problem:'A feed can produce a lot of inspiration while leaving the next step unclear. Someone thinking about their room, outfit, or next project has an intention that a passive stream may not capture.',
    insight:'Make that intention an input: a small “Spin” action gives the person a way to influence what comes next.',
    process:[
      {title:'Start with an intention',text:'The concept reframes discovery around questions such as what a room could look like, rather than treating watch time as the whole experience.'},
      {title:'Create a lightweight direction step',text:'“Spin this idea” offers explicit choices such as more colorful, under $500, or more vintage. The person can refine an idea without starting a new search.'},
      {title:'Connect discovery to a useful artifact',text:'The concept flow moves through saving, a personalized direction, visual search, related ideas, and board creation. The existing board below documents the screen sequence.'}
    ],
    decisions:[
      {title:'Visible intent',choice:'Use an explicit choice to steer discovery instead of relying entirely on inferred preferences.',tradeoff:'The extra action has to feel useful enough to justify interrupting the feed.'},
      {title:'Keep the idea as context',choice:'Refine from the current inspiration so the next results have a recognizable starting point.',tradeoff:'People need to understand what changed and how to undo a direction that feels wrong.'},
      {title:'End with something saved',choice:'Connect exploration to a board, object, or plan that can be revisited.',tradeoff:'Saving alone does not prove the experience was useful. Evaluation should check whether the saved result fits the original intention.'}
    ],
    outcome:'A screen-level interaction model for discover → direct → act.',
    limitation:'This is an independent concept, with no affiliation to Pinterest. Quantitative testing claims are omitted here because participant count, task definitions, and baseline are not documented in the available material.',
    evaluation:['Ask people to pursue a specific inspiration goal using the concept.','Observe whether “Spin” is understood without an explanation.','Compare the relevance and usefulness of saved results, and document participants, tasks, and baseline before reporting a change.'],
    next:{href:'/projects/showability',name:'SHOWAbility'}
  },
  showability:{
    key:'showability',title:'SHOWAbility',eyebrow:'Accessible experience + content systems',subtitle:'A clearer way to participate.',
    summary:'A website redesign for a disability-led performing arts nonprofit, connecting information architecture, accessibility, and maintainable content.',
    role:'UX/UI · Digital strategy',team:'Georgia Tech + SHOWAbility',timeline:'2025–present',status:'Collaborative redesign',
    prototype:'https://www.figma.com/make/BnNmnC7MDA17ftxzjwFOW3/Website-Redesign-for-SHOWAbility?code-node-id=0-9&p=f&t=MBfT3lvoA95ZwZnF-0&fullscreen=1',
    question:'How can the website make the next step clearer—and leave the organization able to maintain it?',
    problem:'Programs, opportunities, donations, and community information need to serve different visitors. Scattered content and unclear routes add barriers before someone can participate.',
    insight:'Accessibility shapes the information model as well as the interface. Clear priorities, direct language, and an understandable route to action belong in the same system.',
    process:[
      {title:'Audit the routes and barriers',text:'Accessibility and content review informed the redesign. WCAG and WAVE findings helped turn broad concerns into concrete questions about hierarchy, navigation, and contrast.'},
      {title:'Organize around visitor intentions',text:'Programs, participation, impact, and support became clearer routes through the content. The design centers performing artists and creative agency.'},
      {title:'Design for continuity',text:'The visual system and publishing guidance give a volunteer-run team a way to keep the experience coherent after handoff.'}
    ],
    decisions:[
      {title:'Creative agency first',choice:'Lead with artists, performances, and participation.',tradeoff:'Represent the community through its work while ensuring practical access information remains easy to find.'},
      {title:'Plain paths to action',choice:'Make programs, involvement, contact, and support recognizable in the navigation.',tradeoff:'Different intentions need distinct routes without making the menu unnecessarily complex.'},
      {title:'A system the team can own',choice:'Include content and brand guidance alongside interface decisions.',tradeoff:'The design must fit maintenance capacity, so consistency and clear publishing rules matter beyond delivery.'}
    ],
    outcome:'Research, accessibility review, and content thinking translated into a redesign and handoff guidance.',
    limitation:'This is collaborative work. The prototype shows the proposed experience; the available artifacts do not establish a causal engagement or retention improvement.',
    evaluation:['Evaluate key paths with disabled artists and other intended visitors.','Check keyboard navigation, headings, contrast, and screen-reader behavior in the implemented site.','Observe whether the team can publish and update content using the guidance.'],
    next:{href:'/projects/moonbase',name:'Save the Moon Base'}
  },
  moonbase:{
    key:'moonbase',title:'Save the Moon Base',eyebrow:'Creative technology + embodied interaction',subtitle:'Make a system something you can explore.',
    summary:'An independent browser prototype developed in response to a NASA GVIS outreach discussion: aim a solar array or explore a Gateway-inspired station with hand, mouse, or touch controls.',
    role:'Interaction design · Prototyping',team:'Independent experiment',timeline:'October 2026',status:'Browser proof of concept',
    prototype:'https://ashnakas.github.io/save-the-moon-base/',
    question:'Can movement and visible feedback make a technical system easier to understand?',
    problem:'A short lab visit needs an immediate way in. A conventional repair game creates stakes, but the interaction also needs to help someone understand what a visualization makes visible.',
    insight:'Build the learning into the response: change an angle, see the output, and connect the action to what the system does.',
    process:[
      {title:'Begin with conventional controls',text:'The initial concept used a lunar emergency and familiar repair controls. It gave the experience a goal and a small scope for a browser proof of concept.'},
      {title:'Explore movement as an input',text:'The next direction introduced webcam hand input alongside mouse and touch. Input recognition and immediate feedback became central design questions.'},
      {title:'Separate experiment from mission',text:'Solar Emergency starts with comparing two array positions before the mission. The output display distinguishes current solar output from stored power.'},
      {title:'Make the visit navigable',text:'The experience now opens with two missions: Solar Emergency and a Gateway-inspired explorer. Mission selection, return navigation, and a one-screen layout became part of the exhibit flow.'}
    ],
    decisions:[
      {title:'Camera optional',choice:'Offer hand controls and a mouse/touch route into the same experience.',tradeoff:'Gesture input adds an engaging possibility, but access to the lesson cannot depend on permission or reliable tracking.'},
      {title:'Immediate system response',choice:'Show angle, solar output, and mission state as the user acts.',tradeoff:'The feedback needs to distinguish what the person controls from what the simulation calculates.'},
      {title:'A focused learning loop',choice:'Compare angles, restore power, and connect the result to the system.',tradeoff:'The model must be simplified enough for a short interaction while communicating that it is a simulation.'}
    ],
    outcome:'A working independent prototype with two missions and multiple input routes.',
    limitation:'This is a proof of concept, not a NASA deployment or scientifically validated training simulation. Browser-based gesture work is documented here; it is not evidence of a completed TouchDesigner installation or visitor study.',
    evaluation:['Observe whether a first-time visitor can start without a facilitator.','Check whether they can tell when tracking understands their movement.','Ask what they learned about angle and solar output, then test input recovery and switching missions.'],
    next:{href:'/projects/cnn',name:'CNN Academy'}
  },
  cnn:{
    key:'cnn',title:'CNN Academy',eyebrow:'Live experience design',subtitle:'Information, delivered at the right moment.',
    summary:'Experience design for a multi-stage newsroom simulation serving more than 100 global participants.',
    role:'Simulation writing · Facilitation',team:'CNN Academy team',timeline:'2024–2026',status:'Delivered program',
    question:'How much should a participant know—and when should they know it?',
    problem:'A live newsroom simulation combines assignments, changing information, verification, and deadlines. Giving every instruction upfront can create overload; withholding too much can make the task confusing.',
    insight:'The participant journey is an information system: scenario, timing, facilitation, and the release of updates shape what someone can decide.',
    process:[
      {title:'Set context and stakes',text:'Scenario writing establishes the situation participants enter and the decisions they need to make.'},
      {title:'Sequence information',text:'The timing and release of information shape the reporting and verification task. Character roles and facilitation make the scenario responsive in a live setting.'},
      {title:'Support the experience in real time',text:'Instructions, communication, and facilitation need to stay coordinated as participants respond under a deadline.'}
    ],
    decisions:[
      {title:'Orient before pressure builds',choice:'Give participants a mental model of the task before increasing its complexity.',tradeoff:'The setup should support action without explaining away the discovery in the simulation.'},
      {title:'Make verification matter',choice:'Let incoming information affect what participants need to check.',tradeoff:'Ambiguity can be part of the exercise, but instructions and facilitation still need to be clear.'},
      {title:'Treat timing as design',choice:'Consider when an update becomes useful in the participant journey.',tradeoff:'A live experience needs enough structure to stay coherent and enough flexibility to respond to the room.'}
    ],
    outcome:'A live participant experience delivered within a global CNN Academy program.',
    limitation:'The program scale is context, not a usability or learning-effectiveness metric. Scenario artifacts and a detailed individual contribution breakdown would strengthen this case study.',
    evaluation:['Document where participants needed clarification or missed an instruction.','Compare the intended timeline with what happened during delivery.','Use those observations to refine the next run’s information sequence.'],
    next:{href:'/recart',name:'ReCart'}
  },
  opslens:{
    key:'opslens',title:'OpsLens',eyebrow:'Systems + data exploration',subtitle:'What changes when one stage changes?',
    summary:'A scenario-analysis dashboard using more than 50,000 synthetic workflow events to explore routing, staffing, and automation.',
    role:'Product thinking · Data',team:'Self-directed',timeline:'2026',status:'Dashboard prototype',
    question:'How can a dashboard help someone compare interventions rather than only observe a bottleneck?',
    problem:'Validation, review, escalation, and resolution depend on one another. Improving a single stage can move the bottleneck downstream.',
    insight:'Make the intervention part of the interface, and keep the model’s assumptions visible.',
    process:[{title:'Model a workflow',text:'Synthetic events represent operational stages without using private customer data.'},{title:'Look for dependencies',text:'Python and SQL analysis explore queue buildup, rework, and stage relationships.'},{title:'Compare interventions',text:'The Streamlit dashboard considers staffing, routing, and automation scenarios.'}],
    decisions:[{title:'Synthetic inputs',choice:'Use generated workflow events for exploration.',tradeoff:'Patterns in synthetic data do not establish a real operational outcome.'},{title:'Scenarios in context',choice:'Connect each intervention to downstream stages.',tradeoff:'A useful comparison depends on the assumptions and constraints of the model.'},{title:'Support a recommendation',choice:'Bring impact and effort into the decision.',tradeoff:'Sensitivity and uncertainty need to stay visible as the model develops.'}],
    outcome:'A dashboard and decision-oriented exploration of workflow interventions.',limitation:'All workflow data is synthetic. The project does not establish customer outcomes or validated operational predictions.',evaluation:['Add sensitivity ranges around assumptions.','Check whether someone can explain why a scenario changes the result.','Validate the model against an appropriate real workflow before making operational claims.'],next:{href:'/recart',name:'ReCart'}
  },
  seatscore:{
    key:'seatscore',title:'AI SeatScore',eyebrow:'Archived recommendation concept',subtitle:'A recommendation with a reason.',summary:'A seat-selection prototype that makes priorities and ranking rationale visible.',role:'Product design · React',team:'Independent project',timeline:'2026',status:'Archived prototype',
    question:'How can someone understand and adjust a seat recommendation?',problem:'Seat maps show availability but leave people to compare price, view, distance, and accessibility.',insight:'A recommendation needs understandable priorities and a visible explanation.',
    process:[{title:'Define priorities',text:'Preferences and seat attributes frame the recommendation.'},{title:'Connect ranking to the flow',text:'A scoring model produces a starting suggestion.'},{title:'Show the reason',text:'The interface explains the recommendation and allows priorities to change.'}],
    decisions:[{title:'A small starting point',choice:'Limit the initial set of inputs.',tradeoff:'A useful default still needs a route to adjustment.'},{title:'Explain the score',choice:'Make recommendation rationale visible.',tradeoff:'A simple explanation cannot imply greater certainty than the model supports.'},{title:'Keep control',choice:'Let someone change the priorities.',tradeoff:'Changes need immediate, understandable feedback.'}],outcome:'A recommendation prototype preserved as supporting work.',limitation:'The portfolio does not establish a live AI service, booking system, or measured recommendation accuracy.',evaluation:['Check whether people understand the score.','Observe when they disagree with the recommendation.','Test whether explanations improve decisions.'],next:{href:'/pinwheels',name:'Pinwheels'}
  }
};

function Artifact({ project }: { project: ProjectKey }) {
  if(project==='pinwheels') return <figure className="artifact"><div className="board-crop"><img src="/pinwheels/case-study-board.png" alt="Existing Pinwheels concept board showing inspiration screens, direction choices, visual search, and board creation" width="1076" height="1620" loading="lazy" /></div><figcaption>Existing concept artifact. The visible screen sequence connects inspiration, direction, visual search, and saving. The original board’s quantitative impact panel is excluded from this presentation because its test methodology is not documented.</figcaption></figure>;
  if(project==='moonbase') return <div className="artifact-map moon-map"><p>THE INTERACTION LOOP</p><div><span><b>01</b>Change an angle</span><i>→</i><span><b>02</b>See the output</span><i>→</i><span><b>03</b>Compare positions</span></div><p>A simplified system response becomes something a visitor can inspect.</p></div>;
  if(project==='recart') return <div className="artifact-map recart-map"><p>THE COMMON LISTING MODEL / SCHEMATIC</p><div className="source-row"><span>Source A</span><span>Source B</span><span>Source C</span></div><div className="shared-model"><b>One comparison surface</b><span>Query / Price / Condition / Source / Save</span></div><p>Keep the origin visible while reducing repeated comparison work.</p></div>;
  if(project==='showability') return <div className="artifact-map show-map"><p>VISITOR INTENT / PROPOSED CONTENT ROUTES</p><div><span><b>Participate</b>Programs + opportunities</span><span><b>Support</b>Mission + ways to give</span><span><b>Connect</b>Community + contact</span></div><p>Clear routes depend on recognizable language and maintainable content.</p></div>;
  if(project==='cnn') return <div className="artifact-map cnn-map"><p>EXPERIENCE SEQUENCE / SCHEMATIC</p><div><span><b>Context</b>Understand the assignment</span><span><b>Information</b>Encounter an update</span><span><b>Judgment</b>Verify + decide</span><span><b>Action</b>Work to the deadline</span></div><p>The sequence illustrates the design problem; it is not a reproduction of the original scenario.</p></div>;
  return <div className="artifact-map"><p>PROJECT SCOPE</p><strong>{project==='opslens'?'Synthetic inputs → scenario → comparison':'Priorities → ranking → explanation'}</strong><p>A schematic of the project’s core decision flow.</p></div>;
}

export default function CaseStudyTemplate({project}: {project: Project}) {
  return <main className={`case-study ${project.key}-case`}>
    <nav className="case-top" aria-label="Portfolio navigation"><a href="/#work">← Selected work</a><a href="/">Ashna Kasireddy</a><a href="mailto:akasireddy3@gatech.edu">Contact ↗</a></nav>
    <nav className="stage-nav" aria-label="Case study sections"><a href="#overview">01 Overview</a><a href="#question">02 Question</a><a href="#process">03 Process</a><a href="#decisions">04 Decisions</a><a href="#next">05 What’s next</a></nav>
    <header className="case-hero"><p className="eyebrow">{project.eyebrow} / {project.timeline}</p><h1>{project.title}</h1><h2>{project.subtitle}</h2><div className="hero-bottom"><p>{project.summary}</p>{project.prototype&&<a className="prototype-link" href={project.prototype} target="_blank" rel="noreferrer">{project.key==='moonbase'?'Try the missions':'Open the prototype'} ↗</a>}</div></header>
    <section id="overview" className="case-section overview"><p className="section-label">01 / CONTEXT</p><div><dl>{[['My role',project.role],['Team',project.team],['Timeline',project.timeline],['Status',project.status]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><Artifact project={project.key}/></div></section>
    <section id="question" className="case-section"><p className="section-label">02 / THE DESIGN QUESTION</p><div><h3>{project.question}</h3><p className="lead-copy">{project.problem}</p><blockquote>{project.insight}</blockquote></div></section>
    <section id="process" className="case-section"><p className="section-label">03 / HOW THE IDEA DEVELOPED</p><div><h3>{project.key==='moonbase'?'From familiar controls to movement.':project.key==='cnn'?'Designing what happens between instructions.':'Make the reasoning visible.'}</h3><ol className="process-list">{project.process.map((step,index)=><li key={step.title}><span>0{index+1}</span><div><h4>{step.title}</h4><p>{step.text}</p></div></li>)}</ol>{project.key==='moonbase'&&<a className="inline-link" href="/making/moon-base">Read the experiment journal ↗</a>}</div></section>
    <section id="decisions" className="case-section decisions"><p className="section-label">04 / DECISIONS + TRADEOFFS</p><div><h3>{project.key==='pinwheels'?'What changes when intent becomes an input?':project.key==='showability'?'Access also depends on what happens after handoff.':'What the interaction needs to make clear.'}</h3>{project.decisions.map((decision,index)=><article className="decision" key={decision.title}><span>0{index+1}</span><div><h4>{decision.title}</h4><p>{decision.choice}</p><p className="tradeoff"><b>The tradeoff</b>{decision.tradeoff}</p></div></article>)}</div></section>
    <section id="next" className="case-section outcome"><p className="section-label">05 / OUTCOME + NEXT QUESTIONS</p><div><h3>{project.outcome}</h3><p className="scope-note">{project.limitation}</p><h4>What I would evaluate next</h4><ul>{project.evaluation.map(item=><li key={item}>{item}</li>)}</ul></div></section>
    <footer className="case-next"><p className="section-label">NEXT PROJECT</p><a href={project.next.href}>{project.next.name} <span>↗</span></a><a className="all-work" href="/#work">All selected work ←</a></footer>
  </main>;
}
