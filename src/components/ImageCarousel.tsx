import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import supabase from "@/utils/supabase";
import moment from "moment-timezone";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import clsx from "clsx";

function convertFilenameToTime(filename: string) {
  // Step 1: Remove the '.jpg' extension and split by '_'
  const parts = filename.replace(".jpg", "").split("_");

  // Make sure the filename is in the correct format
  if (parts.length !== 3) {
    return "Invalid filename format";
  }

  // Step 2: Parse the hours, minutes, and seconds
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const seconds = parts[2];

  // Step 3: Convert 24-hour time to 12-hour time
  const isPM = hours >= 12;
  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12; // Convert 00 to 12 for 12-hour format
  }

  // Step 4: Construct the new time string with AM/PM
  const timeString = `${hours}:${minutes}:${seconds}${isPM ? "pm" : "am"}`;

  return timeString;
}

function calculateTimeDifference(filename: string) {
  // Extract hours, minutes, and seconds from the filename
  const [hours, minutes, seconds] = filename
    .split(".")[0]
    .split("_")
    .map(Number);

  // for some reason we must manually specify the current date in EST to create a correct moment time later...
  const dateEST = moment.tz("America/New_York")
  const month = dateEST.month(); // month is 0-indexed
  const date = dateEST.date();
  const year = dateEST.year();

  // Use moment-timezone to create a moment for the file time in EST
  const fileTime = moment.tz(
    { month: month, date: date, year: year, hour: hours, minute: minutes, second: seconds },
    "America/New_York",
  );

  // Generate the human-readable, relative time difference
  const result = fileTime.fromNow();

  return result;
}

function calculateETA(filename: string) {
  // Extract hours, minutes, and seconds from the filename
  const [hours, minutes, seconds] = filename
    .split(".")[0]
    .split("_")
    .map(Number);


  // for some reason we must manually specify the current date in EST to create a correct moment time later...
  const dateEST = moment.tz("America/New_York")
  const month = dateEST.month(); // month is 0-indexed
  const date = dateEST.date();
  const year = dateEST.year();

  // Use moment-timezone to create a moment for the file time in EST
  const fileTime = moment.tz(
    { month: month, date: date, year: year, hour: hours, minute: minutes, second: seconds },
    "America/New_York",
  );
  fileTime.add(15, "minutes");

  // Generate the human-readable, relative time difference
  const result = fileTime.fromNow();

  return result;
}

export default async function ImageCarousel({ stop }: { stop: string }) {
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
    limit: 10,
    sortBy: { column: "name", order: "desc" },
  });

  const images = data!.filter((image) => image.metadata !== null);

  if (images.length === 0) {
    return (
      <div className="">no buses spotted today</div>
    );
  }

  const lastSeen = calculateTimeDifference(images[0].name);
  const eta = calculateETA(images[0].name);

  return (
    <div className="static">
      <div className="text-lg"> last seen: {lastSeen} </div>
      <div className="text-lg"> eta: {" "}
        <span className={clsx(eta.includes("ago") ? "text-red-600" : "")}>
          {eta}
        </span>
      </div>

      <Accordion className="max-w-[352px]" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg pt-0 pb-1">
            proof
          </AccordionTrigger>
          <AccordionContent>
            <Carousel className="max-w-[352px]">
              <CarouselContent>
                {images.map((image, i) => {
                  const delta = calculateTimeDifference(image.name);
                  return (
                    <CarouselItem key={i}>
                      <div key={i} className="text-sm">
                        <Image
                          width={352}
                          height={240}
                          priority={true}
                          quality={30}
                          src={
                            "https://xgxntawymgcwzpgmkuzk.supabase.co/storage/v1/object/public/predictions/" +
                            folderPath +
                            "/" +
                            image.name
                          }
                          unoptimized={true}
                          alt=""
                        />
                        {delta}
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="absolute bottom-10 left-2 flex gap-2 flex-nowrap">
                <CarouselPrevious className="static shrink-0 translate-y-0" />
                <CarouselNext className="static shrink-0 translate-y-0" />
              </div>
            </Carousel>

            <div className="font-normal text-sm underline text-gray-600  dark:text-gray-400">
              <Link href={`/${stop}`}> view more photos </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
