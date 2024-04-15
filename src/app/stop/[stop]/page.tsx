import type { Metadata } from "next";
export const dynamic = "force-dynamic";

import supabase from "@/utils/supabase";
import Image from "next/image";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { stop: string };
}): Promise<Metadata> {
  const { stop } = params;

  return {
    title: `${stop}th Street - CCNY Bus Tracker`,
    description: "View the last 50 times the bus was spotted at this stop.",
    keywords: [
      "CCNY",
      "ccny",
      "city college",
      "city college of new york",
      "shuttle",
      "bus",
      "shuttle bus",
      "tracker",
      "campus",
      "transportation",
      "schedule",
      "route",
      "live",
      "real-time",
      "map",
      "GPS",
      "location",
      "service",
      "timetable",
      "stop",
      "arrival",
      "departure",
      "status",
      "update",
      "mobile",
      "students",
      "faculty",
    ]
  };
}

export default async function Stop({ params }: { params: { stop: string } }) {
  const { stop } = params;

  if (!["125", "145"].includes(stop)) {
    redirect("/");
  }

  const date = new Date();

  // Convert to EST date with custom format YYYY_MM_DD
  const estDate = date
    .toLocaleDateString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/");

  const folderPath = `${estDate.at(2)}_${estDate.at(0)}_${estDate.at(1)}/${stop}`;

  const { data } = await supabase.storage.from("predictions").list(folderPath, {
    limit: 50,
    sortBy: { column: "name", order: "desc" },
  });

  const images = data!.filter((image) => image.metadata !== null);

  return (
    <div className="pb-8">
      <div className="mt-4 text-2xl font-bold">
        {stop}
      </div>

      <div className="flex flex-col gap-8">
        {images.length === 0 && (
          <div className="">no buses spotted today</div>
        )}
        {images.map((image, i) => {
          return (
            <div key={i} className="">
              {image.name}
              <Image
                width={352}
                height={240}
                src={
                  "https://xgxntawymgcwzpgmkuzk.supabase.co/storage/v1/object/public/predictions/" +
                  folderPath +
                  "/" +
                  image.name
                }
                unoptimized={true}
                alt=""
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
