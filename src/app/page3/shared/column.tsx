"use client";

import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { memo, useContext, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { unsafeOverflowAutoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

import { Card, CardShadow } from "./card";
import {
  getColumnData,
  isCardData,
  isCardDropTargetData,
  isColumnData,
  isDraggingACard,
  isDraggingAColumn,
  TCardData,
  TColumn,
} from "./data";
import { isShallowEqual } from "./is-shallow-equal";
import { SettingsContext } from "./settings-context";

type TColumnState =
  | {
      type: "is-card-over";
      isOverChildCard: boolean;
      dragging: DOMRect;
    }
  | {
      type: "is-column-over";
    }
  | {
      type: "idle";
    }
  | {
      type: "is-dragging";
    };

const stateStyles: { [Key in TColumnState["type"]]: string } = {
  idle: "cursor-grab",
  "is-card-over": "outline outline-2 outline-neutral-50",
  "is-dragging": "opacity-40",
  "is-column-over": "bg-slate-900",
};

const idle = { type: "idle" } satisfies TColumnState;

/**
 * A memoized component for rendering out the card.
 *
 * Created so that state changes to the column don't require all cards to be rendered
 */
const CardList = memo(function CardList({ column }: { column: TColumn }) {
  return column.cards.map((card) => (
    <Card key={card.id} card={card} columnId={column.id} />
  ));
});

export function Column({ initial }: { initial: TColumn }) {
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const outerFullHeightRef = useRef<HTMLDivElement | null>(null);
  const { settings } = useContext(SettingsContext);
  const [state, setState] = useState<TColumnState>(idle);

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

  useEffect(() => {
    const outer = outerFullHeightRef.current;
    const scrollable = scrollableRef.current;
    invariant(outer);
    invariant(scrollable);

    const data = getColumnData({ column });

    function setIsCardOver({
      data,
      location,
    }: {
      data: TCardData;
      location: DragLocationHistory;
    }) {
      const innerMost = location.current.dropTargets[0];
      const isOverChildCard = Boolean(
        innerMost && isCardDropTargetData(innerMost.data)
      );

      const proposed: TColumnState = {
        type: "is-card-over",
        dragging: data.rect,
        isOverChildCard,
      };
      // optimization - don't update state if we don't need to.
      setState((current) => {
        if (isShallowEqual(proposed, current)) {
          return current;
        }
        return proposed;
      });
    }

    return combine(
      dropTargetForElements({
        element: outer,
        getData: () => data,
        canDrop({ source }) {
          return isDraggingACard({ source }) || isDraggingAColumn({ source });
        },
        getIsSticky: () => true,
        onDragStart({ source, location }) {
          if (isCardData(source.data)) {
            // Only show drop shadows for cards from the same column
            if (source.data.columnId === column.id) {
              setIsCardOver({ data: source.data, location });
            }
          }
        },
        onDragEnter({ source, location }) {
          if (isCardData(source.data)) {
            // Only show drop shadows for cards from the same column
            if (source.data.columnId === column.id) {
              setIsCardOver({ data: source.data, location });
            }
            return;
          }
          if (
            isColumnData(source.data) &&
            source.data.column.id !== column.id
          ) {
            setState({ type: "is-column-over" });
          }
        },
        onDropTargetChange({ source, location }) {
          if (isCardData(source.data)) {
            // Only show drop shadows for cards from the same column
            if (source.data.columnId === column.id) {
              setIsCardOver({ data: source.data, location });
            }
            return;
          }
        },
        onDragLeave({ source }) {
          if (
            isColumnData(source.data) &&
            source.data.column.id === column.id
          ) {
            return;
          }
          setState(idle);
        },
        onDrop() {
          setState(idle);
        },
      }),
      autoScrollForElements({
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) {
            return false;
          }

          return isDraggingACard({ source });
        },
        getConfiguration: () => ({
          maxScrollSpeed: settings.columnScrollSpeed,
        }),
        element: scrollable,
      }),
      unsafeOverflowAutoScrollForElements({
        element: scrollable,
        getConfiguration: () => ({
          maxScrollSpeed: settings.columnScrollSpeed,
        }),
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) {
            return false;
          }

          if (!settings.isOverflowScrollingEnabled) {
            return false;
          }

          return isDraggingACard({ source });
        },
        getOverflow() {
          return {
            forTopEdge: {
              top: 1000,
            },
            forBottomEdge: {
              bottom: 1000,
            },
          };
        },
      })
    );
  }, [column, settings]);

  return (
    <div
      className="flex w-72 flex-shrink-0 select-none flex-col"
      ref={outerFullHeightRef}
    >
      <div
        className="flex flex-col overflow-y-auto [overflow-anchor:none] [scrollbar-color:theme(colors.slate.600)_theme(colors.slate.700)] [scrollbar-width:thin]"
        ref={scrollableRef}
      >
        <CardList column={column} />
        {state.type === "is-card-over" && !state.isOverChildCard ? (
          <div className="flex-shrink-0 px-3 py-1">
            <CardShadow dragging={state.dragging} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
