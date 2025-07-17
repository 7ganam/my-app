"use client";

import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { useContext, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Column } from "./column";
import {
  isCardData,
  isCardDropTargetData,
  isDraggingACard,
  TBoard,
  TColumn,
} from "./data";
import { SettingsContext } from "./settings-context";

export function Board({ initial }: { initial: TBoard }) {
  const [data, setData] = useState(initial);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);

    return combine(
      // Monitor for card dragging events - handles when cards are dropped
      monitorForElements({
        canMonitor: isDraggingACard, // Only monitor when dragging cards (not columns)
        onDrop({ source, location }) {
          const dragging = source.data; // Get the card being dragged
          if (!isCardData(dragging)) {
            return; // Exit if not dragging a card
          }

          const innerMost = location.current.dropTargets[0]; // Get the drop target

          if (!innerMost) {
            return; // Exit if no drop target found
          }
          const dropTargetData = innerMost.data; // Get data about where we're dropping

          // Find which column the dragged card belongs to
          const homeColumnIndex = data.columns.findIndex(
            (column) => column.id === dragging.columnId
          );
          const home: TColumn | undefined = data.columns[homeColumnIndex];

          if (!home) {
            return; // Exit if can't find the source column
          }

          // Find the index of the dragged card in its home column
          const cardIndexInHome = home.cards.findIndex(
            (card) => card.id === dragging.card.id
          );

          // CASE 1: Dropping on another card (reordering within same column or moving between columns)
          if (isCardDropTargetData(dropTargetData)) {
            // Find which column we're dropping into
            const destinationColumnIndex = data.columns.findIndex(
              (column) => column.id === dropTargetData.columnId
            );
            const destination = data.columns[destinationColumnIndex];

            // CASE 1A: Reordering within the same column
            if (home === destination) {
              // Find the target card's position
              const cardFinishIndex = home.cards.findIndex(
                (card) => card.id === dropTargetData.card.id
              );

              // Error checking - make sure we found both cards
              if (cardIndexInHome === -1 || cardFinishIndex === -1) {
                return;
              }

              // No change needed if dropping on itself
              if (cardIndexInHome === cardFinishIndex) {
                return;
              }

              // Get which edge of the target card we're closest to (top/bottom)
              const closestEdge = extractClosestEdge(dropTargetData);

              // Reorder the cards using edge-aware positioning
              const reordered = reorderWithEdge({
                axis: "vertical",
                list: home.cards,
                startIndex: cardIndexInHome,
                indexOfTarget: cardFinishIndex,
                closestEdgeOfTarget: closestEdge,
              });

              // Update the column with reordered cards
              const updated: TColumn = {
                ...home,
                cards: reordered,
              };
              const columns = Array.from(data.columns);
              columns[homeColumnIndex] = updated;
              setData({ ...data, columns });
              return;
            }

            // CASE 1B: Moving card from one column to another
            // Check if destination column exists
            if (!destination) {
              return;
            }

            // Find where in the destination column to insert the card
            const indexOfTarget = destination.cards.findIndex(
              (card) => card.id === dropTargetData.card.id
            );

            // Get which edge of the target card we're closest to
            const closestEdge = extractClosestEdge(dropTargetData);
            // If dropping on bottom edge, insert after the target card
            const finalIndex =
              closestEdge === "bottom" ? indexOfTarget + 1 : indexOfTarget;

            // Remove card from source column
            const homeCards = Array.from(home.cards);
            homeCards.splice(cardIndexInHome, 1);

            // Insert card into destination column
            const destinationCards = Array.from(destination.cards);
            destinationCards.splice(finalIndex, 0, dragging.card);

            // Update both columns
            const columns = Array.from(data.columns);
            columns[homeColumnIndex] = {
              ...home,
              cards: homeCards,
            };
            columns[destinationColumnIndex] = {
              ...destination,
              cards: destinationCards,
            };
            setData({ ...data, columns });
            return;
          }
        },
      })
    );
  }, [data, settings]);

  return (
    <div
      className={`flex h-full flex-col ${
        settings.isBoardMoreObvious ? "px-32 py-20" : ""
      }`}
    >
      <div
        className={`flex h-full flex-row gap-3 overflow-x-auto p-3 [scrollbar-color:theme(colors.sky.600)_theme(colors.sky.800)] [scrollbar-width:thin] ${
          settings.isBoardMoreObvious ? "rounded border-2 border-dashed" : ""
        }`}
        ref={scrollableRef}
      >
        {data.columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
}
