import { useImageLoad } from "@/hooks/use-image-load";
import { bemHelper } from "@/utils/rac";

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "small" | "medium" | "large";
}

const cls = bemHelper("avatar");

export function Avatar({ src, name, size = "medium" }: AvatarProps) {
  const loadStatus = useImageLoad(src);
  return (
    <div className={cls({ modifier: size })} aria-label={name}>
      {src && loadStatus === "loaded" ? (
        <img src={src} alt={name} />
      ) : (
        <span className={cls("initial")} aria-hidden="true">
          {name?.charAt(0)}
        </span>
      )}
    </div>
  );
}
