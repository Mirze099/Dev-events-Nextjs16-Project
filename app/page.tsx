import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/exploreBtn";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
import events from "@/lib/constans";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  "use cache";
  cacheLife("hours");
  // const response = await fetch(`${BASE_URL}/api/events`);
  // const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">
        The hub for every <br /> Event You Can't Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups and Conferences, All in one Place
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ol className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))}
        </ol>
      </div>
    </section>
  );
};

export default Page;
