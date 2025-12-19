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
    };
    return allData;
  } catch (e) {
    showError("Failed to gather data from storage. Some data might be corrupt.");
    return null;
  }
};