import type { IEventCategory } from "@/ts/interfaces/event-category";

export interface IEvent {
  id: number;
  attributes: {
    title: string;
    subtitle?: string;
    cover: any;
    event_category: {
      data: IEventCategory;
    };
    datetime: string;
    min_price: number;
    max_price: number | undefined;
    location_name: string;
    location_address: string;
    description: string;
    short_description: string;
    tickets_link: string;
    youtube_video?: string;
  };
}
