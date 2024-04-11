import type { Metadata } from "next";
export const dynamic = "force-dynamic";

import supabase from "@/utils/supabase";
import Image from "next/image";
import ImageCarousel from "@/components/ImageCarousel";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CCNY Bus Tracker",
  description: "Never guess when the shuttle bus is coming again.",
};

export default async function Home() {
  return (
    <div className="p-8">
      <div className="text-4xl font-bold tracking-wide">
        <Link href="/">ccnyb.us</Link>
      </div>

      <div className="mt-4 flex flex-col gap-8">
        <div>
          <div className="flex gap-4 items-baseline">
            <div className="text-2xl font-bold">
              125
            </div>
            {/*
            <div className="font-normal text-base underline text-gray-600 dark:text-gray-400">
              <Link href="/125"> view more photos </Link>
            </div>
            */}
          </div>
          <ImageCarousel stop="125" />
        </div>


        <div>
          <div className="flex gap-4 items-baseline">
            <div className="text-2xl font-bold">
              145
            </div>
            {/*
            <div className="font-normal text-base underline text-gray-600  dark:text-gray-400">
              <Link href="/145"> view more photos </Link>
            </div>
            */}
          </div>
          <ImageCarousel stop="145" />
        </div>


        <div>
          <div className="flex gap-4 items-baseline">
            <div className="text-2xl font-bold">
              nac/marshak
            </div>
          </div>
          support coming soon
        </div>






      </div>
    </div>
  );
}
