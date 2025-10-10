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
      if (!hasMatchingSetAside) return false;
    }

    if (filters.vehicle && app.vehicle !== filters.vehicle) {
      return false;
    }

    if (filters.agency.length > 0) {
      if (!filters.agency.includes(app.agency)) {
        return false;
      }
    }

    if (filters.periodQuick) {
      const days = parseInt(filters.periodQuick);
      if (!isDateWithinDays(app.dueDate, days)) {
        return false;
      }
    } else if (filters.periodStart || filters.periodEnd) {
      if (!isDateInRange(app.dueDate, filters.periodStart, filters.periodEnd)) {
        return false;
      }
    }

    if (filters.ceilingMin || filters.ceilingMax) {
      const min = filters.ceilingMin ? parseFloat(filters.ceilingMin) : 0;
      const max = filters.ceilingMax ? parseFloat(filters.ceilingMax) : Infinity;

      if (app.ceiling < min || app.ceiling > max) {
        return false;
      }
    }

    if (filters.keywords.length > 0) {
      const searchText = filters.keywords.map(k => k.toLowerCase());
      const titleMatch = searchText.some(keyword =>
        app.title.toLowerCase().includes(keyword)
      );
      const keywordMatch = searchText.some(keyword =>
        app.keywords.some(appKeyword => appKeyword.toLowerCase().includes(keyword))
      );

      if (!titleMatch && !keywordMatch) {
        return false;
      }
    }

    return true;
  });
}
