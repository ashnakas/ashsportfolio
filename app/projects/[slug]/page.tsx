import {notFound} from 'next/navigation';
import CaseStudyTemplate,{projects,type ProjectKey} from '../../case-study-template';
const allowed:ProjectKey[]=['showability','seatscore','opslens','cnn'];
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const slug=(await params).slug as ProjectKey;const project=allowed.includes(slug)?projects[slug]:null;return{title:project?`${project.title} — Ashna Kasireddy`:'Project not found',description:project?.summary};}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){const slug=(await params).slug as ProjectKey;if(!allowed.includes(slug))notFound();return <CaseStudyTemplate project={projects[slug]}/>}
