import { randRecentDate, randUserName } from "@ngneat/falso";
import { randomInt, shuffle } from "es-toolkit";
import { http, HttpResponse } from "msw";
import { spyOn } from "storybook/internal/test";
import { transformGame, type gameApi } from "@/features/game/api";
import type { roundApi } from "@/features/round/api";
import { Route } from "@/routes/game/$inviteCode";
import { tableUrl } from "@/supabase/mocks";

const questions = [
  "You hand a note to the cashier telling them you're robbing the place, and it says:",
  "Describe what a hangover feels like",
  "Summarise the existence of mankind",
  "Write an acceptance speech for an Oscar",
  "Describe Piers Morgan",
];

export const randQuestion = () =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  questions[randomInt(questions.length)]!;

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

export const randWordPool = () => shuffle(words);

export const randSubmission = () =>
  Array.from({ length: 3 }, () => {
    const start = randomInt(words.length - 5);
    const end = randomInt(start + 3, start + 5);
    return words.slice(start, end).join(" ");
  });

export const randIndexes = (length: number, count: number) => {
  const picked = new Set<number>();
  while (picked.size < count) {
    let idx = randomInt(length);
    while (picked.has(idx)) {
      idx = randomInt(length);
    }
    picked.add(idx);
  }
  return picked;
};

export const mockGame = ({
  round,
  game,
}: {
  round?: Partial<typeof roundApi.endpoints.getActiveRound.Types.RawResultType>;
  game?: Partial<
    typeof gameApi.endpoints.getGameByInviteCode.Types.RawResultType
  >;
} = {}) => {
  const fullGame: typeof gameApi.endpoints.getGameByInviteCode.Types.RawResultType =
    {
      id: 1,
      invite_code: "FOO",
      creator_id: "1",
      creator: {
        display_name: randUserName(),
        avatar_url: null,
      },
      first_to: 5,
      state: "running",
      voting_mode: "judge",
      created_at: randRecentDate().toISOString(),
      active_round: 1,
      participants: [],
      ...game,
    };
  spyOn(Route, "useLoaderData").mockImplementation(
    ({
      select,
    }: {
      select: (data: typeof Route.types.loaderData) => unknown;
    }) =>
      select({
        game: transformGame(fullGame),
      }),
  );
  return http.get<
    {},
    undefined,
    | typeof gameApi.endpoints.getGameByInviteCode.Types.RawResultType
    | typeof roundApi.endpoints.getActiveRound.Types.RawResultType
  >(tableUrl("games"), ({ request }) => {
    const select = new URL(request.url).searchParams.get("select");
    if (select?.startsWith("active_round")) {
      return HttpResponse.json<
        typeof roundApi.endpoints.getActiveRound.Types.RawResultType
      >({
        active_round: {
          id: 1,
          prompt: { prompt: randQuestion() },
          judge: null,
          created_at: randRecentDate().toISOString(),
          phase: "submission",
          ...round,
        },
      });
    }
    return HttpResponse.json<
      typeof gameApi.endpoints.getGameByInviteCode.Types.RawResultType
    >(fullGame);
  });
};
