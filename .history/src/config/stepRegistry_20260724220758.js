import Step1LoanType from '../components/steps/Step1LoanType';
import Step2PersonalInfo from '../components/steps/Step2PersonalInfo';
import Step3KYC from '../components/steps/Step3KYC';
import Step4Address from '../components/steps/Step4Address';
import Step5Employment from '../components/steps/Step5Employment';
import Step6CoApplicant from '../components/steps/Step6CoApplicant';
import Step7Documents from '../components/steps/Step7Documents';
import Step8Review from '../components/steps/Step8Review';

export const STEP_CONFIG = [
  { id: 1, label: 'Loan & Basic Info', component: Step1LoanType },
  { id: 2, label: 'Personal Info', component: Step2PersonalInfo },
  { id: 3, label: 'KYC Verification', component: Step3KYC },
  { id: 4, label: 'Address Details', component: Step4Address },
  { id: 5, label: 'Employment & Income', component: Step5Employment },
  { id: 6, label: 'Co-Applicant', component: Step6CoApplicant },
  { id: 7, label: 'Documents & E-Sign', component: Step7Documents },
  { id: 8, label: 'Review & Submit', component: Step8Review },
];