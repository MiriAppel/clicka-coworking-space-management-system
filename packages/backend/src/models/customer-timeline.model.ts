import { CustomerTimeline, DateRangeFilter, TimelineEvent, TimelineEventType } from '../types/customer';

export class CustomerTimelineModel implements CustomerTimeline {

  customerId: string;
  events: TimelineEvent[];
  totalEvents: number;
  dateRange?: DateRangeFilter;

  constructor(
    customerId: string,
    events: TimelineEvent[],
    totalEvents: number,
    dateRange?: DateRangeFilter
  ) {
    this.customerId = customerId;
    this.events = events;
    this.totalEvents = totalEvents;
    this.dateRange = dateRange;
  }

  toDatabaseFormat() {
    return {
      customerId: this.customerId,
      events: this.events.map(event => ({
        id: event.id,
        type: event.type,
        date: event.date,
        title: event.title,
        description: event.description,
        relatedId: event.relatedId
      })),
      totalEvents: this.totalEvents,
      dateRange: this.dateRange ? {
        startDate: this.dateRange.startDate,
        endDate: this.dateRange.endDate
      } : undefined
    };
  }
}

export class TimelineEventModel implements TimelineEvent {

  id: string;
  type: TimelineEventType;
  date: string;
  title: string;
  description?: string;
  relatedId?: string;

  constructor(
    id: string,
    type: TimelineEventType,
    date: string,
    title: string,
    description?: string,
    relatedId?: string
  ) {
    this.id = id;
    this.type = type;
    this.date = date;
    this.title = title;
    this.description = description;
    this.relatedId = relatedId;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      type: this.type,
      date: this.date,
      title: this.title,
      description: this.description,
      relatedId: this.relatedId
    };
  }
}

export class DateRangeFilterModel implements DateRangeFilter {

  startDate?: string;
  endDate?: string;

  constructor(startDate?: string, endDate?: string) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  toDatabaseFormat() {
    return {
      startDate: this.startDate,
      endDate: this.endDate
    };
  }
  
}
