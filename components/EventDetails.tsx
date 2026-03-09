import React from "react";
import Image from "next/image";
import { cacheLife } from "next/cache";
import {
  getEventBySlug,
  getSimilarEventsBySlug,
  SimilarEventPreview,
} from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";
import BookEvent from "@/components/BookEvent";
import events from "@/lib/constans";

// Use a relative API path so the server can resolve the route without needing an env var.
const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

const NotFoundContent = () => (
  <div className="text-center py-20">
    <h1 className="text-2xl font-semibold">Event not found</h1>
    <p className="mt-2 text-sm text-gray-600">
      The event you are looking for doesn&apos;t exist or could not be loaded.
    </p>
  </div>
);

const buildFallbackEvent = (slug: string) => {
  const found = events.find((e) => e.slug === slug);
  if (!found) return null;

  return {
    title: found.title,
    slug: found.slug,
    image: found.image,
    location: found.location,
    date: found.date,
    time: found.time,
    description:
      "This is a placeholder description because the event data is not available in the database yet.",
    overview:
      "Event details are being loaded. Please check back later or contact the event organizer.",
    mode: "online",
    agenda: ["Details coming soon"],
    audience: "Everyone",
    tags: ["upcoming"],
    organizer: "TBD",
  };
};

const EventDetails = async ({ slug }: { slug: string }) => {
  "use cache";
  cacheLife("hours");

  let event;
  try {
    event = await getEventBySlug(slug);

    if (!event) {
      event = buildFallbackEvent(slug);
      if (!event) return <NotFoundContent />;
    }
  } catch (error) {
    console.error(
      "Error fetching event:",
      error,
      "- falling back to local data",
    );
    event = buildFallbackEvent(slug);
    if (!event) return <NotFoundContent />;
  }

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = event;

  const safeImage = image || "/icons/logo.png";
  const safeDescription = description || "No description available.";
  const safeOverview = overview || "No overview available.";
  const safeAgenda =
    Array.isArray(agenda) && agenda.length > 0
      ? agenda
      : ["Details coming soon"];
  const safeTags = Array.isArray(tags) && tags.length > 0 ? tags : ["upcoming"];
  const safeAudience = audience || "Everyone";
  const safeOrganizer = organizer || "TBD";

  const bookings = 10;

  const similarEvents = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{safeDescription}</p>
      </div>

      <div className="details">
        {/*    Left Side - Event Content */}
        <div className="content">
          <Image
            src={safeImage}
            alt={safeDescription}
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{safeOverview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={safeAudience}
            />
          </section>

          <EventAgenda agendaItems={safeAgenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{safeOrganizer}</p>
          </section>

          <EventTags tags={safeTags} />
        </div>

        {/*    Right Side - Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}

            <BookEvent />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: SimilarEventPreview) => (
              <EventCard key={similarEvent.title} {...similarEvent} />
            ))}
        </div>
      </div>
    </section>
  );
};
export default EventDetails;
