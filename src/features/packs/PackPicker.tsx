import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { langChanged, selectLang } from "../game/slice";
import { useGetPackLanguagesQuery } from "./api";

const langDisplayName = new Intl.DisplayNames(undefined, { type: "language" });

export function PackPicker() {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLang);
  const { packs = [lang] } = useGetPackLanguagesQuery(undefined, {
    selectFromResult: ({ data }) => ({ packs: data }),
  });
  return (
    <select
      value={lang}
      onChange={(e) => dispatch(langChanged(e.target.value))}
      disabled={packs.length === 1}
    >
      {packs.map((pack) => (
        <option key={pack} value={pack}>
          {langDisplayName.of(pack)}
        </option>
      ))}
    </select>
  );
}
