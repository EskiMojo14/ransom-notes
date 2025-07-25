import { randParagraph, randSentence, randTextRange } from "@ngneat/falso";

export const randQuestion = () => randSentence().replace(".", "?");

export const randWordPool = () =>
  randParagraph()
    .replace(/[^a-zA-Z\s]/g, "")
    .toLowerCase()
    .split(" ");

export const randSubmission = () =>
  randTextRange({ min: 20, max: 25, length: 3 }).map((sentence) =>
    sentence.replace(/[^a-zA-Z\s]/g, "").toLowerCase(),
  );

export const randIndexes = (length: number, count: number) => {
  const toClick = new Set<number>();
  while (toClick.size < count) {
    let idx = Math.floor(Math.random() * length);
    while (toClick.has(idx)) {
      idx = Math.floor(Math.random() * length);
    }
    toClick.add(idx);
  }
  return toClick;
};
