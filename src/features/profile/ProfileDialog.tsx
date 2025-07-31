import { Form } from "react-aria-components";
import * as v from "valibot";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/button";
import { Dialog } from "@/components/dialog";
import { Symbol } from "@/components/symbol";
import { TextField } from "@/components/textfield";
import { useSession } from "@/features/auth/session";
import { useFormSchema } from "@/hooks/use-form-schema";
import { useGetProfileQuery, useUpdateProfileMutation } from "./api";
import styles from "./ProfileDialog.module.css";

const formSchema = v.object({
  display_name: v.string(),
});

export function ProfileDialog() {
  const session = useSession();
  const { profile } = useGetProfileQuery(session.user.id, {
    selectFromResult: ({ data }) => ({ profile: data }),
  });
  const [updateProfile, { isLoading }] = useUpdateProfileMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });
  const { formErrors, handleSubmit, handleReset } = useFormSchema(formSchema);
  if (!profile) return null;
  return (
    <Dialog
      trigger={
        <Button
          icon={
            <Avatar
              src={profile.avatar_url}
              name={profile.display_name ?? undefined}
              size="small"
            />
          }
        >
          Profile
        </Button>
      }
      title="Profile"
      actions={
        <>
          <Button
            form="profile-form"
            type="reset"
            color="error"
            className={styles.resetButton}
          >
            Reset
          </Button>
          <Button slot="close" variant="outlined">
            Close
          </Button>
          <Button
            type="submit"
            form="profile-form"
            variant="filled"
            isPending={isLoading}
          >
            Save
          </Button>
        </>
      }
    >
      <Form
        className={styles.form}
        id="profile-form"
        validationErrors={formErrors}
        onSubmit={handleSubmit((values) => {
          void updateProfile({
            userId: session.user.id,
            updates: values,
          });
        }, console.error)}
        onReset={handleReset}
      >
        <Avatar
          src={profile.avatar_url}
          name={profile.display_name ?? undefined}
          size="large"
        />
        <TextField
          name="display_name"
          label="Display name"
          defaultValue={profile.display_name ?? ""}
          isRequired
          icon={<Symbol>person</Symbol>}
        />
      </Form>
    </Dialog>
  );
}
