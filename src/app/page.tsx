import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'

import supabase from "@/utils/supabase";
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'CCNY Bus Tracker',
  description: "Never guess when the shuttle bus is coming again.",
}

export default async function Home() {
  const date = new Date();

  // Convert to EST date with custom format YYYY_MM_DD
  const estDate = date.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split("/");

  const formattedDate = `125/${estDate.at(2)}_${estDate.at(0)}_${estDate.at(1)}`;


  const { data } = await supabase.storage.from("predictions").list(formattedDate, {
    limit: 25,
    sortBy: { column: 'name', order: 'desc' },
  })

  const images = data!.filter((image) => image.metadata !== null)

  return (
    <div className="p-8">
      <div className="text-4xl font-bold tracking-wide">
        these are the times i saw the bus
      </div>

      <div className="mt-4 flex flex-col gap-8">
        {images.length === 0 && (
          <div className="text-2xl">
            no buses spotted today
          </div>
        )}
        {images.map((image, i) => {
          return (
            <div key={i} className="text-2xl">
              {image.name}
              <Image width={352} height={240} src={"https://xgxntawymgcwzpgmkuzk.supabase.co/storage/v1/object/public/predictions/" + formattedDate + "/" + image.name} alt="" />
            </div>
          )
        })}
      </div>
    </div>
  );
}
