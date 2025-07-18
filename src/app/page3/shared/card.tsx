"use client";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import invariant from "tiny-invariant";

import { isSafari } from "./is-safari";
import {
  type Edge,
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  getCardData,
  getCardDropTargetData,
  isCardData,
  isDraggingACard,
  TCard,
} from "./data";
import { isShallowEqual } from "./is-shallow-equal";

type TCardState =
  | {
      type: "idle";
    }
  | {
      type: "is-dragging";
    }
  | {
      type: "is-dragging-and-left-self";
    }
  | {
      type: "is-over";
      dragging: DOMRect;
      closestEdge: Edge;
    }
  | {
      type: "preview";
      container: HTMLElement;
      dragging: DOMRect;
    };

const idle: TCardState = { type: "idle" };

const innerStyles: { [Key in TCardState["type"]]?: string } = {
  idle: "hover:outline outline-2 outline-neutral-50 cursor-grab",
  "is-dragging": "opacity-40",
};

const outerStyles: { [Key in TCardState["type"]]?: string } = {
  // We no longer render the draggable item after we have left it
  // as it's space will be taken up by a shadow on adjacent items.
  // Using `display:none` rather than returning `null` so we can always
  // return refs from this component.
  // Keeping the refs allows us to continue to receive events during the drag.
  "is-dragging-and-left-self": "hidden",
};

export function CardShadow({ dragging }: { dragging: DOMRect }) {
  return (
    <div
      className="flex-shrink-0 rounded bg-slate-900"
      style={{ height: dragging.height }}
    />
  );
}

export function CardDisplay({
  card,
  state,
  outerRef,
  innerRef,
}: {
  card: TCard;
  state: TCardState;
  outerRef?: React.MutableRefObject<HTMLDivElement | null>;
  innerRef?: MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={outerRef}
      className={`flex flex-shrink-0 flex-col gap-2 px-3 py-1 ${
        outerStyles[state.type]
      }`}
    >
      {/* Put a shadow before the item if closer to the top edge */}
      {state.type === "is-over" && state.closestEdge === "top" ? (
        <CardShadow dragging={state.dragging} />
      ) : null}
      <div
        className={`rounded bg-slate-700 p-2 text-slate-300 ${
          innerStyles[state.type]
        }`}
        ref={innerRef}
        style={
          state.type === "preview"
            ? {
                width: state.dragging.width,
                height: state.dragging.height,
                transform: !isSafari() ? "rotate(4deg)" : undefined,
              }
            : undefined
        }
      >
        {card.content}
      </div>
      {/* Put a shadow after the item if closer to the bottom edge */}
      {state.type === "is-over" && state.closestEdge === "bottom" ? (
        <CardShadow dragging={state.dragging} />
      ) : null}
    </div>
  );
}

export function Card({ card, columnId }: { card: TCard; columnId: string }) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TCardState>(idle);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    invariant(outer && inner);

    return combine(
      // 1. MAKE THE CARD DRAGGABLE - allows this card to be dragged
      draggable({
        element: inner, // The card content element (what you click to drag)
        getInitialData: ({ element }) =>
          getCardData({
            card,
            columnId,
            rect: element.getBoundingClientRect(), // Get card's position and size
          }),
        // 2. CREATE CUSTOM DRAG PREVIEW - shows what you're dragging
        onGenerateDragPreview({ nativeSetDragImage, location, source }) {
          const data = source.data;
          invariant(isCardData(data));
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: inner,
              input: location.current.input,
            }),
            render({ container }) {
              // Create a custom preview using React portal
              setState({
                type: "preview",
                container,
                dragging: inner.getBoundingClientRect(),
              });
            },
          });
        },
        // 3. DRAG STATE MANAGEMENT - track when card is being dragged
        onDragStart() {
          setState({ type: "is-dragging" }); // Card becomes semi-transparent
        },
        onDrop() {
          setState(idle); // Reset to normal state
        },
      }),

      // 4. MAKE THE CARD A DROP TARGET - allows other cards to be dropped on this card
      dropTargetForElements({
        element: outer, // The entire card container (drop zone)
        getIsSticky: () => true, // Keep drop target active during drag
        canDrop: isDraggingACard, // Only accept other cards (not columns)
        getData: ({ element, input }) => {
          const data = getCardDropTargetData({ card, columnId });
          // 5. EDGE DETECTION - determine if dropping above/below this card
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"], // Can drop above or below, not left/right
          });
        },

        // 6. VISUAL FEEDBACK WHEN DRAGGING OVER THIS CARD
        onDragEnter({ source, self }) {
          if (!isCardData(source.data)) {
            return; // Exit if not dragging a card
          }
          if (source.data.card.id === card.id) {
            return; // Exit if dragging over itself
          }
          // Only show drop shadows for cards from the same column
          if (source.data.columnId !== columnId) {
            return; // Exit if card is from a different column
          }

          // Get which edge (top/bottom) is closest to the mouse
          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) {
            return;
          }

          // Show visual feedback (shadows, highlights) for the drop zone
          setState({
            type: "is-over",
            dragging: source.data.rect,
            closestEdge, // "top" or "bottom"
          });
        },

        // 7. UPDATE VISUAL FEEDBACK AS MOUSE MOVES
        onDrag({ source, self }) {
          if (!isCardData(source.data)) {
            return;
          }
          if (source.data.card.id === card.id) {
            return;
          }
          // Only show drop shadows for cards from the same column
          if (source.data.columnId !== columnId) {
            return;
          }
          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) {
            return;
          }

          // Optimization: Only update state if something actually changed
          const proposed: TCardState = {
            type: "is-over",
            dragging: source.data.rect,
            closestEdge,
          };
          setState((current) => {
            if (isShallowEqual(proposed, current)) {
              return current; // Don't update if nothing changed
            }
            return proposed;
          });
        },

        // 8. CLEANUP WHEN DRAGGING LEAVES THIS CARD
        onDragLeave({ source }) {
          if (!isCardData(source.data)) {
            return;
          }
          if (source.data.card.id === card.id) {
            // Special case: Card is dragging itself (should become invisible)
            setState({ type: "is-dragging-and-left-self" });
            return;
          }
          // Reset to normal state
          setState(idle);
        },

        // 9. CLEANUP WHEN SOMETHING IS DROPPED ON THIS CARD
        onDrop() {
          setState(idle); // Reset to normal state
        },
      })
    );
  }, [card, columnId]);
  return (
    <>
      <CardDisplay
        outerRef={outerRef}
        innerRef={innerRef}
        state={state}
        card={card}
      />
      {state.type === "preview"
        ? createPortal(
            <CardDisplay state={state} card={card} />,
            state.container
          )
        : null}
    </>
  );
}
