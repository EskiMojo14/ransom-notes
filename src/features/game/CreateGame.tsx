import { Form } from "react-aria-components";
import * as v from "valibot";
import { Button } from "@/components/button";
import { Radio, RadioGroup, TwoLineRadioLabel } from "@/components/radio";
import { Symbol } from "@/components/symbol";
import { InlineTextField } from "@/components/textfield";
import { useFormSchema } from "@/hooks/use-form-schema";
import { Constants, type Enums, type TablesInsert } from "@/supabase/types";
import { unsafeEntries } from "@/utils";
import { makeInviteCode } from "./api";
import styles from "./CreateGame.module.css";

type GameInput = TablesInsert<"games">;

const defaults: Partial<GameInput> = {
  first_to: 5,
  voting_mode: "judge",
};

const radioOptions: Record<
  Enums<"voting_mode">,
  Record<"icon" | "label" | "description", string>
> = {
  judge: {
    icon: "gavel",
    label: "Judge",
    description: "Set order for judges",
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
  const { formErrors, handleSubmit } = useFormSchema(formSchema, {
    numbers: ["first_to"],
  });
  return (
    <Form
      className={styles.form}
      validationErrors={formErrors}
      onSubmit={handleSubmit((values) => {
        console.log({
          ...values,
          creator_id: "1",
          invite_code: makeInviteCode(),
        } satisfies GameInput);
      }, console.error)}
    >
      <InlineTextField
        name="first_to"
        type="number"
        label="Points to win"
        defaultValue={defaults.first_to?.toString()}
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
      >
        Create game
      </Button>
    </Form>
  );
}
