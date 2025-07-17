"use client";

import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useState } from "react";
import { Column } from "./column";
import { isCardData, isCardDropTargetData, TColumn } from "./data";

export function Board({ initial }: { initial: TColumn }) {
  const [column, setColumn] = useState(initial);

  useEffect(() => {
    return combine(
      // Monitor for card dragging events - handles when cards are dropped
      monitorForElements({
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

          // Find the index of the dragged card in its home column
          const cardIndexInHome = column.cards.findIndex(
            (card) => card.id === dragging.card.id
          );

          // CASE 1: Dropping on another card (reordering within same column or moving between columns)
          if (isCardDropTargetData(dropTargetData)) {
            // Reordering within the same column
            // Find the target card's position
            const cardFinishIndex = column.cards.findIndex(
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
              list: column.cards,
              startIndex: cardIndexInHome,
              indexOfTarget: cardFinishIndex,
              closestEdgeOfTarget: closestEdge,
            });

            // Update the column
            const updated: TColumn = {
              ...column,
              cards: reordered,
            };
            setColumn(updated);
            return;
          }
        },
      })
    );
  }, [column]);

  return <Column key={column.id} column={column} />;
}
