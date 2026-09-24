import CaseStudyTemplate,{projects} from '../case-study-template';
export const metadata={title:'Pinwheels — Ashna Kasireddy',description:projects.pinwheels.summary};
export default function PinwheelsPage(){return <CaseStudyTemplate project={projects.pinwheels}/>}
