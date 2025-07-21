import { colors } from "@atlaskit/theme";
import seedrandom from "seedrandom";
import type { Author, Quote, QuoteMap } from "./types";
import finnImg from "../static/media/finn-min.png";
import bmoImg from "../static/media/bmo-min.png";
import princessImg from "../static/media/princess-min.png";
import jakeImg from "../static/media/jake-min.png";

const jake: Author = {
  id: "1",
  name: "Jake",
  url: "http://adventuretime.wikia.com/wiki/Jake",
  avatarUrl: jakeImg.src,
  colors: {
    soft: colors.Y50,
    hard: colors.N400A,
  },
};

const BMO: Author = {
  id: "2",
  name: "BMO",
  url: "http://adventuretime.wikia.com/wiki/BMO",
  avatarUrl: bmoImg.src,
  colors: {
    soft: colors.G50,
    hard: colors.N400A,
  },
};

const finn: Author = {
  id: "3",
  name: "Finn",
  url: "http://adventuretime.wikia.com/wiki/Finn",
  avatarUrl: finnImg.src,
  colors: {
    soft: colors.B50,
    hard: colors.N400A,
  },
};

const princess: Author = {
  id: "4",
  name: "Princess bubblegum",
  url: "http://adventuretime.wikia.com/wiki/Princess_Bubblegum",
  avatarUrl: princessImg.src,
  colors: {
    soft: colors.P50,
    hard: colors.N400A,
  },
};

export const authors: Author[] = [jake, BMO, finn, princess];

export const quotes: Quote[] = [
  {
    id: "1",
    content: "test 1",
    author: BMO,
  },
  {
    id: "2",
    content:
      "Sucking at something is the first step towards being sorta good at something.",
    author: jake,
  },
];

// So we do not have any clashes with our hardcoded ones
let idCount: number;
let predictableMathRandom: seedrandom.PRNG;

// FIXME: This doesn't work well with StrictMode
export const resetData = (seed: string) => {
  idCount = 1;
  predictableMathRandom = seedrandom(seed);
};

resetData("base");

export const getQuotes = (count: number = quotes.length): Quote[] =>
  // eslint-disable-next-line no-restricted-syntax
  Array.from({ length: count }, (v, k) => k).map(() => {
    const random: Quote =
      quotes[Math.floor(predictableMathRandom() * quotes.length)];

    const custom: Quote = {
      ...random,
      id: `G${idCount++}`,
    };

    return custom;
  });

const getByAuthor = (author: Author, items: Quote[]): Quote[] =>
  items.filter((quote: Quote) => quote.author === author);

export const authorQuoteMap: QuoteMap = authors.reduce(
  (previous: QuoteMap, author: Author) => ({
    ...previous,
    [author.name]: getByAuthor(author, quotes),
  }),
  {}
);

export const generateQuoteMap = (quoteCount: number): QuoteMap =>
  authors.reduce(
    (previous: QuoteMap, author: Author) => ({
      ...previous,
      [author.name]: getQuotes(quoteCount / authors.length),
    }),
    {}
  );
