import Step1LoanType from '../components/steps/Step1LoanType';
import Step2PersonalInfo from '../components/steps/Step2PersonalInfo';
import Step3KYC from '../components/steps/Step3KYC';
import Step4Address from '../components/steps/Step4Address';
import Step5Employment from '../components/steps/Step5Employment';
import Step6CoApplicant from '../components/steps/Step6CoApplicant';
import Step7Documents from '../components/steps/Step7Documents';
import Step8Review from '../components/steps/Step8Review';

export const STEP_CONFIG = [
  { id: 1, label: 'Loan & Basic Info', component: Step1LoanType, isVisible: () => true },
  { id: 2, label: 'Personal Info', component: Step2PersonalInfo, isVisible: () => true },
  { id: 3, label: 'KYC Verification', component: Step3KYC, isVisible: () => true },
  { id: 4, label: 'Address Details', component: Step4Address, isVisible: () => true },
  { id: 5, label: 'Employment & Income', component: Step5Employment, isVisible: () => true },
  { 
    id: 6, 
    label: 'Co-Applicant', 
    component: Step6CoApplicant, 
    // THIS IS THE DYNAMIC LOGIC FOR STEP 6
    isVisible: (data) => {
      if (!data) return false;
      if (data.loanType === 'Home') return true;
      if (data.loanType === 'Personal' && data.loanAmount > 500000) return true;
      if (data.loanType === 'Business' && data.loanAmount > 2000000) return true;
      return false;
    } 
  },
  { id: 7, label: 'Documents & E-Sign', component: Step7Documents, isVisible: () => true },
  { id: 8, label: 'Review & Submit', component: Step8Review, isVisible: () => true },
];