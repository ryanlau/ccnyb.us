
import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'


import supabase from "@/utils/supabase";

export const metadata: Metadata = {
  title: 'CCNY Bus Tracker',
  description: "Never guess when the shuttle bus is coming again.",
}

export default async function Home() {
  const { data } = await supabase.storage.from("predictions").list('', {
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
        {images.map((image, i) => {
          return (
            <div key={i} className="text-2xl">
              {image.name}
              <img src={"https://xgxntawymgcwzpgmkuzk.supabase.co/storage/v1/object/public/predictions/" + image.name} alt="" />
            </div>
          )
        })}
      </div>
    </div>
  );
}
