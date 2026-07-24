export const calculateEMI = (principal, loanType, tenureMonths) => {
  // Interest rates per the spec
  let annualRate = 0;
  if (loanType === 'Personal') annualRate = 10.5;
  else if (loanType === 'Home') annualRate = 8.5;
  else if (loanType === 'Business') annualRate = 14;
  else annualRate = 10.5;

  const monthlyRate = annualRate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;
  
  // Processing Fee: 1% of loan amount, min 2000, max 25000
  let processingFee = principal * 0.01;
  if (processingFee < 2000) processingFee = 2000;
  if (processingFee > 25000) processingFee = 25000;

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    processingFee: Math.round(processingFee),
    annualRate
  };
};