import { useRouter } from "@tanstack/react-router";
import { Form } from "react-aria-components";
import * as v from "valibot";
import { Button } from "@/components/button";
import { Radio, RadioGroup, TwoLineRadioLabel } from "@/components/radio";
import { Symbol } from "@/components/symbol";
import { InlineTextField } from "@/components/textfield/inline";
import { useSession } from "@/features/auth/session";
import { useFormSchema } from "@/hooks/use-form-schema";
import type { Enums, TablesInsert } from "@/supabase/types";
import { Constants } from "@/supabase/types";
import { unsafeEntries } from "@/utils";
import {
  makeInviteCode,
  useCreateGameMutation,
  useRequestJoinGameMutation,
} from "./api";
import styles from "./CreateGame.module.css";

type GameInput = TablesInsert<"games">;

const defaults = {
  first_to: 5,
  voting_mode: "judge",
} satisfies Partial<GameInput>;

const radioOptions: Record<
  Enums<"voting_mode">,
  Record<"icon" | "label" | "description", string>
> = {
  judge: {
    icon: "gavel",
    label: "Judge",
    description: "Fixed order for judges",
  },
  jury: {
    icon: "ballot",
    label: "Jury",
    description: "No judge, all players vote",
  },
  executioner: {
    icon: "swords",
    label: "Executioner",
    description: "Judge is picked at random",
  },
};

const formSchema = v.object({
  first_to: v.number(),
  voting_mode: v.picklist(Constants.public.Enums.voting_mode),
});

export function CreateGame() {
  const session = useSession();
  const router = useRouter();
  const { formErrors, handleSubmit } = useFormSchema(formSchema, {
    numbers: ["first_to"],
  });
  const [createGame, { isLoading: isCreating }] = useCreateGameMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });
  const [requestJoinGame, { isLoading: isJoining }] =
    useRequestJoinGameMutation({
      selectFromResult: ({ isLoading }) => ({ isLoading }),
    });
  return (
    <Form
      className={styles.form}
      validationErrors={formErrors}
      onSubmit={handleSubmit(async (values) => {
        const inviteCode = makeInviteCode();
        const { id } = await createGame({
          ...values,
          creator_id: session.user.id,
          invite_code: inviteCode,
        }).unwrap();
        await requestJoinGame({
          userId: session.user.id,
          gameId: id,
        }).unwrap();
        await router.navigate({
          to: "/game/$inviteCode",
          params: { inviteCode },
        });
      }, console.error)}
    >
      <InlineTextField
        name="first_to"
        type="number"
        label="Points to win"
        defaultValue={defaults.first_to.toString()}
        icon={<Symbol>trophy</Symbol>}
        className={styles.pointsToWin}
      />
      <RadioGroup
        name="voting_mode"
        label="Voting mode"
        defaultValue={defaults.voting_mode}
      >
        {unsafeEntries(radioOptions).map(([value, { icon, ...props }]) => (
          <Radio key={value} value={value}>
            <Symbol>{icon}</Symbol>
            <TwoLineRadioLabel {...props} />
          </Radio>
        ))}
      </RadioGroup>
      <Button
        type="submit"
        icon={<Symbol>door_open</Symbol>}
        variant="elevated"
        isPending={isCreating || isJoining}
      >
        {({ isPending }) => (isPending ? "Creating" : "Create")}
      </Button>
    </Form>
  );
}
