export interface IEvent {
    _id: string;
    title: string;
    description: string;
    date: Date;
    creators: string[];
    attendees: string[];
}