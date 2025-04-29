export interface IEvent {
    _id: string;
    title: string;
    description: string;
    banner: {
        url: string;
        delete_url: string;
        filename: string;
    };
    date: string;
    creators: string[];
    attendees: string[];
}