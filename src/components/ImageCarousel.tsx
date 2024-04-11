import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import supabase from "@/utils/supabase";
import Image from "next/image";

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
    limit: 20,
    sortBy: { column: "name", order: "desc" },
  });

  const images = data!.filter((image) => image.metadata !== null);

  if (images.length === 0) {
    return (
      <div className="mt-4 flex flex-col gap-8">
        <div className="text-2xl">no buses spotted today</div>
      </div>
    )
  }


  return (
    <div className="static">
      <Carousel className="max-w-[352px]">
        <CarouselContent>
          {images.map((image, i) => {
            return (
              <CarouselItem key={i}>
                <div key={i} className="text-xl">
                  <Image
                    width={352}
                    height={240}
                    priority={true}
                    quality={10}
                    src={
                      "https://xgxntawymgcwzpgmkuzk.supabase.co/storage/v1/object/public/predictions/" +
                      folderPath +
                      "/" +
                      image.name
                    }
                    alt=""
                  />
                  {image.name}
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
    </div>
  );
}
