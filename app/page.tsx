import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/exploreBtn";
import { cacheLife } from "next/cache";
import { getAllEvents, SimilarEventPreview } from "@/lib/actions/event.actions";

const Page = async () => {
  "use cache";
  cacheLife("hours");

  const events = await getAllEvents();

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
            events.map((event: SimilarEventPreview) => (
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
