import type { IEvent } from "@/ts/interfaces/event";

export interface IEventCategory {
  id: number;
  attributes: {
    createdAt: string;
    name: string;
    locale: string;
    events: {
      data: IEvent[];
    };
    publishedAt: string;
    updatedAt: string;
  };
}
