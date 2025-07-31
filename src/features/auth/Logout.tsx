import { LinkButton } from "@/components/button/link";

export function Logout() {
  return (
    <LinkButton to="/logout" variant="outlined" preload={false}>
      Log out
    </LinkButton>
  );
}
