import React, { CSSProperties, ReactElement } from "react";
import { colors } from "@atlaskit/theme";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type {
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import QuoteItem from "./quote-item";
import Title from "./title";
import type { Quote } from "../types";

export const getBackgroundColor = (
  isDraggingOver: boolean,
  isDraggingFrom: boolean
): string => {
  if (isDraggingOver) {
    return colors.R50;
  }
  if (isDraggingFrom) {
    return colors.T50;
  }
  return colors.N30;
};

interface Props {
  listId?: string;
  listType?: string;
  quotes: Quote[];
  title?: string;
  internalScroll?: boolean;
  scrollContainerStyle?: CSSProperties;
  isDropDisabled?: boolean;
  isCombineEnabled?: boolean;
  style?: CSSProperties;
  // may not be provided - and might be null
  ignoreContainerClipping?: boolean;
  useClone?: boolean;
}

interface QuoteListProps {
  quotes: Quote[];
}

function InnerQuoteList(props: QuoteListProps): ReactElement {
  return (
    <>
      {props.quotes.map((quote: Quote, index: number) => (
        <Draggable key={quote.id} draggableId={quote.id} index={index}>
          {(
            dragProvided: DraggableProvided,
            dragSnapshot: DraggableStateSnapshot
          ) => (
            <QuoteItem
              key={quote.id}
              quote={quote}
              isDragging={dragSnapshot.isDragging}
              isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
              provided={dragProvided}
            />
          )}
        </Draggable>
      ))}
    </>
  );
}

const InnerQuoteListMemo = React.memo<QuoteListProps>(InnerQuoteList);

interface InnerListProps {
  dropProvided: DroppableProvided;
  quotes: Quote[];
  title: string | undefined | null;
}

function InnerList(props: InnerListProps) {
  const { quotes, dropProvided } = props;
  const title = props.title ? <Title>{props.title}</Title> : null;

  return (
    <div>
      {title}
      <div ref={dropProvided.innerRef} className="min-h-[250px] pb-2">
        <InnerQuoteListMemo quotes={quotes} />
        {dropProvided.placeholder}
      </div>
    </div>
  );
}

export default function QuoteList(props: Props): ReactElement {
  const {
    ignoreContainerClipping,
    internalScroll,
    scrollContainerStyle,
    isDropDisabled,
    isCombineEnabled,
    listId = "LIST",
    listType,
    style,
    quotes,
    title,
    useClone,
  } = props;

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      ignoreContainerClipping={ignoreContainerClipping}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      renderClone={
        useClone
          ? (provided, snapshot, descriptor) => (
              <QuoteItem
                quote={quotes[descriptor.source.index]}
                provided={provided}
                isDragging={snapshot.isDragging}
                isClone
              />
            )
          : undefined
      }
    >
      {(
        dropProvided: DroppableProvided,
        dropSnapshot: DroppableStateSnapshot
      ) => {
        const isDraggingOver = dropSnapshot.isDraggingOver;
        const isDraggingFrom = Boolean(dropSnapshot.draggingFromThisWith);

        const dynamicBackgroundColor = getBackgroundColor(
          isDraggingOver,
          isDraggingFrom
        );

        return (
          <div
            className={`
              flex flex-col opacity-100 transition-all duration-200 ease-in-out
              select-none w-64 p-2 border-2 pb-0
              ${isDropDisabled ? "opacity-50" : ""}
            `}
            style={{
              ...style,
              backgroundColor: dynamicBackgroundColor,
            }}
            {...dropProvided.droppableProps}
          >
            {internalScroll ? (
              <div
                className="overflow-x-hidden overflow-y-auto max-h-[250px]"
                style={scrollContainerStyle}
              >
                <InnerList
                  quotes={quotes}
                  title={title}
                  dropProvided={dropProvided}
                />
              </div>
            ) : (
              <InnerList
                quotes={quotes}
                title={title}
                dropProvided={dropProvided}
              />
            )}
          </div>
        );
      }}
    </Droppable>
  );
}
