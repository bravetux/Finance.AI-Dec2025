"use client";

import { showError } from "@/utils/toast";

export const safeJSONParse = (key: string, defaultValue: any = {}) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Failed to parse JSON for key: ${key}`, e);
    return defaultValue;
  }
};

// Helper to get raw string data (used for encrypted FIDOK data)
const getRawData = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error(`Failed to get raw data for key: ${key}`, e);
    return null;
  }
};

export const gatherAllData = () => {
  try {
    const allData = {
      // Planning
      cashflow: safeJSONParse('finance-data', {}),
      netWorth: safeJSONParse('netWorthData', {}),
      goals: safeJSONParse('goalsData', []),
      expensePlanner: safeJSONParse('expenseTrackerData', []),
      
      // Retirement
      retirementDashboard: safeJSONParse('retirementData', {}),
      fireCalculator: safeJSONParse('fireCalculatorData', {}),
      canYouRetireNow: safeJSONParse('canRetireNowData', {}),
      projectedCashflow: {
        settings: safeJSONParse('projectedCashflowSettings', {}),
        corpus: safeJSONParse('projectedAccumulatedCorpus', 0),
      },
      postRetirementStrategy: {
        settings: safeJSONParse('postRetirementStrategyPageSettings', {}),
      },
      futureValueCalculator: safeJSONParse('future-value-data', []),

      // Assets
      assets: {
        realEstate: {
          properties: safeJSONParse('realEstatePropertyValues', []),
          rentals: safeJSONParse('realEstateRentalProperties', []),
          reit: safeJSONParse('realEstateReitValue', 0),
        },
        equity: {
          domesticStocks: safeJSONParse('domesticEquityStocks', []),
          usEquity: safeJSONParse('usEquityData', []),
        },
        funds: {
          mutualFundAllocation: safeJSONParse('mutualFundAllocationEntries', []),
          mutualFundSips: safeJSONParse('mutualFundSIPEntries', []),
          sipOutflow: safeJSONParse('sipOutflowData', 0),
          smallCases: safeJSONParse('smallCaseData', []),
        },
        debt: {
          liquid: safeJSONParse('debtLiquidAssets', []),
          fixedDeposits: safeJSONParse('debtFixedDeposits', []),
          debtFunds: safeJSONParse('debtDebtFunds', []),
          govInvestments: safeJSONParse('debtGovInvestments', []),
        },
        preciousMetals: {
          gold: safeJSONParse('goldData', []),
          silver: safeJSONParse('silverData', []),
          platinum: safeJSONParse('platinumData', []),
          diamond: safeJSONParse('diamondData', []),
        },
      },
      
      // Calculators State
      calculators: {
        advanceTax: safeJSONParse('advanceTaxCalculatorState', {}),
        carAffordable: safeJSONParse('carAffordableCalculatorData', {}),
        p2pLending: safeJSONParse('p2pCalculatorState', {}),
        rentVacate: safeJSONParse('rentVacateCalculatorData', {}),
        goldPrice: safeJSONParse('goldPrice', 0),
        silverPrice: safeJSONParse('silverPrice', 0),
        platinumPrice: safeJSONParse('platinumPrice', 0),
        // New calculator states
        buyVsRent: safeJSONParse('buyVsRentCalculatorState', {}),
        childEducationFund: safeJSONParse('childEducationFundCalculatorState', {}),
        hlv: safeJSONParse('hlvCalculatorState', {}),
        healthInsurance: safeJSONParse('healthInsuranceCalculatorState', {}),
        inflationImpact: safeJSONParse('inflationImpactCalculatorState', {}),
      },

      // FIDOK Data (Stored as encrypted strings)
      fidok: {
        familyMembers: getRawData('fidokFamilyMembers'),
        importantContacts: getRawData('fidokImportantContacts'),
        bankAccounts: getRawData('fidokBankAccounts'),
        financialDocuments: getRawData('fidokFinancialDocuments'),
        lockerDetails: getRawData('fidokLockerDetails'),
        onlinePasswords: getRawData('fidokOnlinePasswords'),
        insurancePolicies: getRawData('fidokInsurancePolicies'),
        cards: getRawData('fidokCards'),
        propertyDetails: getRawData('fidokPropertyDetails'),
        liabilityDetails: getRawData('fidokLiabilityDetails'),
        investments1: getRawData('fidokInvestments1'),
        investments2: getRawData('fidokInvestments2'),
      }
    };
    return allData;
  } catch (e) {
    showError("Failed to gather data from storage. Some data might be corrupt.");
    return null;
  }
};