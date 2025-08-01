import { clsx } from "clsx";
import { useRef } from "react";
import { Form } from "react-aria-components";
import * as v from "valibot";
import { Button } from "@/components/button";
import { Symbol } from "@/components/symbol";
import { TextField } from "@/components/textfield";
import { useSession } from "@/features/auth/session";
import { useGameId } from "@/features/game/hooks";
import { useFormSchema } from "@/hooks/use-form-schema";
import {
  selectGroupedMessages,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
} from "./api";
import styles from "./Chat.module.css";

const formSchema = v.object({
  message: v.string(),
});

export function Chat() {
  const gameId = useGameId();
  const {
    user: { id: userId },
  } = useSession();
  const { formErrors, handleSubmit, handleReset } = useFormSchema(formSchema);
  const { groups = [] } = useGetChatMessagesQuery(gameId, {
    selectFromResult: ({ data }) => ({
      groups: data && selectGroupedMessages(data),
    }),
  });
  const [sendChatMessage, { isLoading }] = useSendChatMessageMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <div className={styles.container}>
      <div className={styles.messagesContainer}>
        <ul className={styles.messages}>
          {groups.map((group) => {
            const [first] = group;
            if (!first) return null;
            const isOwn = first.user_id === userId;
            return (
              <li
                key={first.id}
                className={clsx(styles.message, isOwn && styles.own)}
              >
                <div className={styles.details}>
                  <span className={clsx(styles.author, "overline")}>
                    {first.author.display_name}
                  </span>
                  <time className={clsx(styles.timestamp, "caption")}>
                    {new Date(first.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                {group.map((message) => (
                  <span key={message.id} className={clsx(styles.text, "body1")}>
                    {message.message}
                  </span>
                ))}
              </li>
            );
          })}
        </ul>
      </div>
      <Form
        ref={formRef}
        className={styles.form}
        onSubmit={handleSubmit(({ message }) => {
          if (!gameId) return;
          void sendChatMessage({
            gameId,
            userId,
            message,
          })
            .unwrap()
            .then(() => {
              formRef.current?.reset();
            });
        }, console.error)}
        onReset={handleReset}
        validationErrors={formErrors}
      >
        <TextField
          name="message"
          aria-label="New message"
          placeholder="New message"
          multiline
          className={styles.textField}
          isRequired
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <Button
          type="submit"
          iconOnly
          icon={<Symbol>send</Symbol>}
          isPending={isLoading}
          variant="filled"
          className={styles.sendButton}
        >
          Send
        </Button>
      </Form>
    </div>
  );
}
