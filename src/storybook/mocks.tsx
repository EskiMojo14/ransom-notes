const questions = [
  "You hand a note to the cashier telling them you're robbing the place, and it says:",
  "Describe what a hangover feels like",
  "Summarise the existence of mankind",
  "Write an acceptance speech for an Oscar",
  "Describe Piers Morgan",
];

const randomNumberTo = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min) + min) % max;

export const randQuestion = () =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  questions[randomNumberTo(questions.length)]!;

const words = [
  "cadaver",
  "confess",
  "jump",
  "fantasy",
  "want",
  "devil",
  "had",
  "absorb",
  "vision",
  "treat",
  "hear",
  "to",
  "on",
  "one",
  "have",
  "balloon",
  "cake",
  "grate",
  "princess",
  "assume",
  "answer",
  "guy",
  "crash",
  "struggle",
  "coach",
  "talk",
  "atrocity",
  "so",
  "turn",
  "forbidden",
  "alone",
  "flame",
  "nice",
  "screw",
  "skeleton",
  "beautiful",
  "catch",
  "plug",
  "wife",
  "being",
  "wear",
  "s",
  "advance",
  "it",
  "fun",
  "steer",
  "way",
  "not",
  "arm",
  "charm",
  "he",
  "calculate",
  "disease",
  "remember",
  "let",
  "adjust",
  "where",
  "escape",
  "whip",
  "young",
  "we",
  "stress",
  "should",
  "and",
  "man",
  "saggy",
  "against",
  "some",
  "was",
  "enlarge",
  "hand",
  "down",
  "place",
  "have",
  "inquiry",
];

export const randWordPool = () =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  Array.from(randIndexes(words.length, 75), (idx) => words[idx]!);

export const randSubmission = () =>
  Array.from({ length: 3 }, () => {
    const start = randomNumberTo(words.length - 5);
    const end = randomNumberTo(start + 5, start + 3);
    return words.slice(start, end).join(" ");
  });

export const randIndexes = (length: number, count: number) => {
  const picked = new Set<number>();
  while (picked.size < count) {
    let idx = randomNumberTo(length);
    while (picked.has(idx)) {
      idx = randomNumberTo(length);
    }
    picked.add(idx);
  }
  return picked;
};
