import { clsx } from "clsx";
import { useRef } from "react";
import { Form } from "react-aria-components";
import * as v from "valibot";
import { Button } from "@/components/button";
import { Symbol } from "@/components/symbol";
import { TextField } from "@/components/textfield";
import { useSession } from "@/features/auth/session";
import type { Game } from "@/features/game/api";
import { useAppDispatch } from "@/hooks/redux";
import { useFormSchema } from "@/hooks/use-form-schema";
import { useRealtimeChannel } from "@/hooks/use-realtime-channel";
import {
  listenToChat,
  selectGroupedMessages,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
} from "./api";
import styles from "./Chat.module.css";

const formSchema = v.object({
  message: v.string(),
});

export interface ChatProps {
  gameId: Game["id"];
}

export function Chat({ gameId }: ChatProps) {
  const dispatch = useAppDispatch();
  useRealtimeChannel(() => dispatch(listenToChat(gameId)), [gameId, dispatch]);
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
      <ul className={styles.messages}>
        {groups.map((group) => {
          const [first] = group;
          if (!first) return null;
          return (
            <li
              key={first.id}
              className={clsx(
                styles.message,
                first.user_id === userId && styles.own,
              )}
            >
              <span className={clsx(styles.author, "overline")}>
                {first.author.display_name}
              </span>
              {group.map((message) => (
                <span key={message.id} className={clsx(styles.text, "body1")}>
                  {message.message}
                </span>
              ))}
              <time className={clsx(styles.timestamp, "caption")}>
                {new Date(first.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </li>
          );
        })}
      </ul>
      <Form
        ref={formRef}
        className={styles.form}
        onSubmit={handleSubmit(({ message }) => {
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
