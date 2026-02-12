import { TimelineEventType } from '../../enums/timeline-event-type.enum';

export interface TimelineItemDto {
    type: TimelineEventType;
    timestamp: string;
    metadata: Record<string, any>;
}

export interface TimelineResponseDto {
    childId: string;
    items: TimelineItemDto[];
}
