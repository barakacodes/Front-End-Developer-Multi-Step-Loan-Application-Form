// Verhoeff Checksum Tables
const d = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,2,3,4,0,6,7,8,9,5],
  [2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],
  [4,0,1,2,3,9,5,6,7,8],
  [5,6,7,8,9,0,1,2,3,4],
  [6,7,8,9,5,1,2,3,4,0],
  [7,8,9,5,6,2,3,4,0,1],
  [8,9,5,6,7,3,4,0,1,2],
  [9,5,6,7,8,4,0,1,2,3]
];
const p = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,5,7,6,2,8,3,0,9,4],
  [5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],
  [4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],
  [7,0,4,6,9,1,3,2,5,8]
];
const inv = [0,4,3,2,1,5,6,7,8,9];

export const validateAadhaar = (aadhaar) => {
  if (!/^\d{12}$/.test(aadhaar)) return false;
  let c = 0;
  const digits = aadhaar.split('').map(Number);
  for (let i = 0; i < digits.length; i++) {
    c = d[c][p[(i + 1) % 8][digits[i]]];
  }
  return c === 0;
};

export const validatePAN = (pan, loanType = 'Personal') => {
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) return false;
  // 4th char indicates entity type. 'P' = Individual, 'C' = Company, 'F' = Firm
  const entityType = pan[3];
  const validEntityTypes = ['P', 'C', 'F']; 
  
  // For Personal & Home loans, strictly only 'P' (Individual) is allowed.
  if (loanType === 'Personal' || loanType === 'Home') {
    return entityType === 'P';
  }
  // For Business loans, P, C, or F are allowed.
  return validEntityTypes.includes(entityType);
};