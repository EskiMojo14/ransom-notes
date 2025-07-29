import { Form } from "react-aria-components";
import * as v from "valibot";
import { Button } from "@/components/button";
import { Radio, RadioGroup, TwoLineRadioLabel } from "@/components/radio";
import { Symbol } from "@/components/symbol";
import { InlineTextField } from "@/components/textfield";
import { useFormSchema } from "@/hooks/use-form-schema";
import type { TablesInsert } from "@/supabase/types";
import { makeInviteCode } from "./api";
import styles from "./CreateGame.module.css";

type GameInput = TablesInsert<"games">;

const defaults: Partial<GameInput> = {
  first_to: 5,
  voting_mode: "judge",
};

const formSchema = v.object({
  first_to: v.number(),
  voting_mode: v.picklist(["judge", "jury"]),
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
        <Radio value="judge">
          <Symbol>gavel</Symbol>
          <TwoLineRadioLabel
            label="Judge"
            description="Winner is decided by a single player"
          />
        </Radio>
        <Radio value="jury">
          <Symbol>ballot</Symbol>
          <TwoLineRadioLabel
            label="Jury"
            description="Winner is decided by the most votes (judge becomes tiebreaker)"
          />
        </Radio>
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
