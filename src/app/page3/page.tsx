"use client";
import { Column } from "./shared/column";
import List2 from "./list2";

const initial2 = [
  {
    id: "column:a",
    title: "Column A",
    cards: [
      {
        id: "card:1",
        content: <List2 />,
      },
      {
        id: "card:2",
        content: (
          <div className=" text-red-500">
            Card 2dfafds asdfasdfas dfasdfas asdfasfehgasecasdcvsadf asdfasd
            fsdf
          </div>
        ),
      },
    ],
  },
];

const initial3 = [
  {
    id: "column:b",
    title: "Column B",
    cards: [
      {
        id: "card:11",
        content: (
          <div className=" text-red-500">
            Card 2dfafds asdfasdfas dfasdfas asdfasfehgasecasdcvsadf asdfasd
            fsdf
          </div>
        ),
      },
      {
        id: "card:22",
        content: (
          <div className=" text-red-500">
            Card 2dfafds asdfasdfas dfasdfas asdfasfehgasecasdcvsadf asdfasd
            fsdf
          </div>
        ),
      },
    ],
  },
];

export default function Page() {
  return (
    <div className="flex h-full flex-row justify-center">
      <Column initial={initial2[0]} />
      <Column initial={initial3[0]} />
    </div>
  );
}
