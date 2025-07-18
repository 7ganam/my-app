"use client";
import { Column } from "./shared/column";

const initial2 = [
  {
    id: "column:aa",
    title: "Column AA",
    cards: [
      {
        id: "card:1111",
        content: <div className=" text-blue-500">fsdf</div>,
      },
      {
        id: "card:2222",
        content: <div className=" text-red-500">11111</div>,
      },
    ],
  },
];

export default function List2() {
  return (
    <div className="flex h-full flex-row justify-center">
      <Column initial={initial2[0]} />
    </div>
  );
}
