import { Application, Filters } from '../types';
import { isDateInRange, isDateWithinDays } from './dateHelpers';

export function filterApplications(applications: Application[], filters: Filters): Application[] {
  return applications.filter((app) => {
    if (filters.naics && app.naics !== filters.naics) {
      return false;
    }

    if (filters.setAside.length > 0) {
      const hasMatchingSetAside = filters.setAside.some((setAside) =>
        app.setAside.includes(setAside)
      );
      if (!hasMatchingSetAside) {
        return false;
      }
    }

    if (filters.vehicle && app.vehicle !== filters.vehicle) {
      return false;
    }

    if (filters.agency.length > 0 && !filters.agency.includes(app.agency)) {
      return false;
    }

    if (filters.periodType === 'quick' && filters.quickPeriod !== null) {
      if (!isDateWithinDays(app.dueDate, filters.quickPeriod)) {
        return false;
      }
    }

    if (filters.periodType === 'custom' && (filters.startDate || filters.endDate)) {
      if (!isDateInRange(app.dueDate, filters.startDate, filters.endDate)) {
        return false;
      }
    }

    const minCeiling = filters.minCeiling ? parseFloat(filters.minCeiling) : null;
    const maxCeiling = filters.maxCeiling ? parseFloat(filters.maxCeiling) : null;

    if (minCeiling !== null && app.ceiling < minCeiling) {
      return false;
    }

    if (maxCeiling !== null && app.ceiling > maxCeiling) {
      return false;
    }

    if (filters.keywords.length > 0) {
      const hasMatchingKeyword = filters.keywords.some((keyword) => {
        const lowerKeyword = keyword.toLowerCase();
        return (
          app.title.toLowerCase().includes(lowerKeyword) ||
          app.keywords.some((k) => k.toLowerCase().includes(lowerKeyword))
        );
      });
      if (!hasMatchingKeyword) {
        return false;
      }
    }

    return true;
  });
}
