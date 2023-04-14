import type { IEventCategory } from "@/ts/interfaces/event-category";

export interface IEvent {
  id: number;
  attributes: {
    title: string;
    cover: any;
    event_category: {
      data: IEventCategory;
    };
    datetime: string;
    min_price: number;
    max_price: number | undefined;
    location: string;
    address: string;
    description: string;
    tickets_link: string;
  };
}
