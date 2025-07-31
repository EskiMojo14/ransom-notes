import type { ReactNode } from "react";
import type {
  DialogProps as AriaDialogProps,
  DialogRenderProps,
  DialogTriggerProps,
  ModalOverlayProps,
} from "react-aria-components";
import {
  Dialog as AriaDialog,
  composeRenderProps,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  Toolbar,
} from "react-aria-components";
import {
  bemHelper,
  composeClasses,
  type ChildrenOrFunction,
} from "@/utils/rac";

export interface DialogProps extends AriaDialogProps {
  title?: ReactNode;
  trigger: ReactNode;
  triggerProps?: Omit<DialogTriggerProps, "children">;
  overlayProps?: Omit<ModalOverlayProps, "children">;
  modalProps?: Omit<ModalOverlayProps, "children">;
  actions?: ChildrenOrFunction<DialogRenderProps>;
}

const cls = bemHelper("dialog");

export function Dialog({
  trigger,
  title,
  children,
  className,
  triggerProps,
  overlayProps,
  modalProps,
  actions,
  ...props
}: DialogProps) {
  return (
    <DialogTrigger {...triggerProps}>
      {trigger}
      <ModalOverlay {...overlayProps} className={cls("overlay")}>
        <Modal
          {...modalProps}
          className={composeClasses(cls("modal"), modalProps?.className)}
        >
          <AriaDialog {...props} className={cls({ extra: className })}>
            {composeRenderProps(children, (children, renderProps) => (
              <>
                {!!title && (
                  <Heading
                    className={cls({
                      element: "title",
                      extra: "headline5",
                    })}
                    slot="title"
                  >
                    {title}
                  </Heading>
                )}
                {children}
                {composeRenderProps(
                  actions,
                  (actions) =>
                    !!actions && (
                      <Toolbar className={cls("actions")}>{actions}</Toolbar>
                    ),
                )(renderProps)}
              </>
            ))}
          </AriaDialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
