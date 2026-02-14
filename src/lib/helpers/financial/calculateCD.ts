/**
 * CD (Certificate of Deposit): maturity value = principal * (1 + apy/100)^(termMonths/12).
 * Interest = maturityValue - principal.
 */

export interface CDInput {
  principal: number;
  apyPercent: number;
  termMonths: number;
}

export interface CDOutput {
  principal: number;
  maturityValue: number;
  interestEarned: number;
  effectiveRate: number;
}

export function calculateCD(input: CDInput): CDOutput {
  const principal = Math.max(0, input.principal);
  const apy = Math.max(0, input.apyPercent) / 100;
  const termMonths = Math.max(1, Math.round(input.termMonths));
  const years = termMonths / 12;

  const maturityValue = principal * Math.pow(1 + apy, years);
  const interestEarned = Math.max(0, maturityValue - principal);
  const effectiveRate = principal > 0 ? (interestEarned / principal) * 100 : 0;

  return {
    principal: Math.round(principal * 100) / 100,
    maturityValue: Math.round(maturityValue * 100) / 100,
    interestEarned: Math.round(interestEarned * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  };
}
