"use server";

import { cache } from "react";
import { Event, IEvent } from "@/database";
import connectDB from "../mongodb";

export type SimilarEventPreview = Pick<
  IEvent,
  "title" | "slug" | "image" | "location" | "date" | "time"
>;

export type EventDetail = Pick<
  IEvent,
  | "title"
  | "slug"
  | "description"
  | "overview"
  | "image"
  | "location"
  | "date"
  | "time"
  | "mode"
  | "agenda"
  | "audience"
  | "organizer"
  | "tags"
> & { _id: string };

const getAllEventsImpl = async (): Promise<SimilarEventPreview[]> => {
  try {
    await connectDB();

    const events = (await Event.find()
      .sort({ createdAt: -1 })
      .select({ title: 1, slug: 1, image: 1, location: 1, date: 1, time: 1 })
      .lean()) as unknown as SimilarEventPreview[];

    return events;
  } catch {
    return [];
  }
};

const getEventBySlugImpl = async (
  slug: string,
): Promise<EventDetail | null> => {
  try {
    await connectDB();

    const event = (await Event.findOne({ slug })
      .select({
        title: 1,
        slug: 1,
        description: 1,
        overview: 1,
        image: 1,
        location: 1,
        date: 1,
        time: 1,
        mode: 1,
        agenda: 1,
        audience: 1,
        organizer: 1,
        tags: 1,
      })
      .lean()) as unknown as EventDetail | null;

    return event;
  } catch {
    return null;
  }
};

const getSimilarEventsBySlugImpl = async (
  slug: string,
): Promise<SimilarEventPreview[]> => {
  try {
    await connectDB();

    const event = (await Event.findOne({ slug }).lean()) as IEvent | null;
    if (!event) return [];

    const similar = (await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags || [] },
    })
      .select({ title: 1, slug: 1, image: 1, location: 1, date: 1, time: 1 })
      .lean()) as unknown as SimilarEventPreview[];

    return similar;
  } catch {
    return [];
  }
};

export const getAllEvents = cache(getAllEventsImpl);
export const getEventBySlug = cache(getEventBySlugImpl);
export const getSimilarEventsBySlug = cache(getSimilarEventsBySlugImpl);
