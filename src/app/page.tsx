import supabase from "@/utils/supabase";

export default async function Home() {
  const { data } = await supabase.storage.from("predictions").list('', {
    limit: 100,
    sortBy: { column: 'name', order: 'desc' },
  })

  console.log(data)

  return (
    <div className="p-8">
      <div className="text-4xl font-bold tracking-wide">
        these are the times i saw the bus
      </div>

      <div className="mt-4 flex flex-col gap-8">
        {data!.map((image, i) => {
          if (image.metadata.mimetype === 'application/octet-stream') return
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
