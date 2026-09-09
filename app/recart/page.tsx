export const metadata = { title: 'ReCart — Ashna Kasireddy', description: 'Product design and development for a unified secondhand marketplace search.' };
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CaseStudyNav from '../case-study-nav';
import '../case-study.css';
import './recart.css';

const STAGES = [
  { id: 'context', label: 'Context' },
  { id: 'problem', label: 'Problem' },
  { id: 'process', label: 'Process' },
  { id: 'solution', label: 'Solution' },
  { id: 'outcome', label: 'Outcome' },
];

export default function ReCartPage() {
  return (
    <main className="recart-page">
      <nav className="rc-nav">
        <Link href="/#work">
          <ArrowLeft size={15} /> Selected work
        </Link>
        <span>ASHNA KASIREDDY</span>
        <a href="mailto:akasireddy3@gatech.edu">Contact ↗</a>
      </nav>

      <CaseStudyNav stages={STAGES} />

      <header className="rc-hero">
        <span>CASE STUDY 02 · SECONDHAND MARKETPLACE SEARCH</span>
        <h1>ReCart</h1>
        <h2>Four apps, one search bar.</h2>
        <p>
          Buying secondhand online means checking multiple marketplaces one
          at a time. ReCart collapses that into a single search — designed,
          systemized, and shipped solo from Figma to production React.
        </p>
        <div className="rc-meta">
          <span>
            <b>ROLE</b>Product Designer &amp; Front-end Engineer
          </span>
          <span>
            <b>TEAM</b>Solo
          </span>
          <span>
            <b>STATUS</b>Shipped
          </span>
          <span>
            <b>STACK</b>Figma, React, Next.js
          </span>
        </div>
        <div className="rc-pills">
          <span>4 marketplaces → 1 search</span>
          <span>2-tap filters</span>
          <span>Figma → production React</span>
        </div>
      </header>

      <section className="rc-section" id="context">
        <span>01 / CONTEXT</span>
        <div>
          <h3>Secondhand shopping means five browser tabs</h3>
          <p>
            Buying secondhand well means checking more than one place — the
            usual spread of resale marketplaces all turn up different
            inventory for the same search. Each has its own layout, its own
            filters, and its own results, and none of them talk to each
            other.
          </p>
        </div>
      </section>

      <section className="rc-section" id="problem">
        <span>02 / PROBLEM</span>
        <div>
          <h3>The friction isn&apos;t any one app. It&apos;s doing it four times.</h3>
          <p>
            Every individual marketplace works fine on its own. The problem
            shows up in the comparison: the same search typed four separate
            times, prices and condition notes held in your head instead of
            side by side, and listings you lose track of between tabs. There
            was no layer above the marketplaces that treated them as one
            inventory.
          </p>
        </div>
      </section>

      <section className="rc-section" id="process">
        <span>03 / PROCESS</span>
        <div>
          <h3>Solo, start to finish</h3>
          <p>
            I designed and built ReCart alone — wireframes and visual design
            in Figma, then a production Next.js/React front end wired up to
            each marketplace. Working solo meant every call, from
            information architecture to how a filter should feel on tap, was
            mine to make and mine to ship. I leaned on AI-assisted tooling
            through the build to move faster from a Figma frame to working
            code, especially for the marketplace integrations and for
            iterating on the search-and-filter UI without slowing the design
            work down.
          </p>
          <ol className="rc-decisions">
            <li>
              <b>01</b>Unify the search — one query, four sources, one
              results view.
            </li>
            <li>
              <b>02</b>Two-tap filters — condition, price, and size without
              leaving the results.
            </li>
            <li>
              <b>03</b>Own the handoff — solo from Figma frame to shipped
              production code.
            </li>
          </ol>
        </div>
      </section>

      <section className="rc-section" id="solution">
        <span>04 / SOLUTION</span>
        <div>
          <h3>One search, four marketplaces, two taps</h3>
          <p>
            Type a search once and ReCart pulls matching listings from all
            four marketplaces into a single results view. Filters for
            condition, price range, and size apply across every source at
            once, in two taps instead of four separate re-navigations.
          </p>
          <div className="rc-diagram" aria-hidden="true">
            <span className="src">Marketplace A</span>
            <span className="src">Marketplace B</span>
            <span className="src">Marketplace C</span>
            <span className="src">Marketplace D</span>
            <span className="arrow">→</span>
            <span className="dest">
              ReCart search
              <i>2-tap filters</i>
            </span>
          </div>
        </div>
      </section>

      <section className="rc-section" id="outcome">
        <span>05 / OUTCOME</span>
        <div>
          <h3>Shipped, not just prototyped</h3>
          <p>
            ReCart is live and in daily use as a production app, not a Figma
            prototype — built and shipped solo from design through
            front-end engineering.
          </p>
          <div className="rc-stats">
            <article>
              <strong>4 → 1</strong>
              <span>MARKETPLACES UNIFIED</span>
            </article>
            <article>
              <strong>2 taps</strong>
              <span>PER FILTER</span>
            </article>
            <article>
              <strong>Solo</strong>
              <span>DESIGN + BUILD</span>
            </article>
          </div>
          <p className="rc-note">
            Next up: saved searches and price-drop alerts across all four
            marketplaces, so the comparison doesn&apos;t stop at the search —
            it keeps working after you close the tab.
          </p>
        </div>
      </section>

      <footer className="rc-footer">
        <Link href="/#work">
          <ArrowLeft size={14} /> Back to all work
        </Link>
        <small>SHOWAbility and CNN Academy case studies — coming soon.</small>
      </footer>
    </main>
  );
}
