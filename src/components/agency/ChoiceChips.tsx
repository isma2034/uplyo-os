"use client";

/**
 * Choix unique en « pastilles » : un tap au lieu d'ouvrir une liste
 * déroulante, faire défiler et refermer (trois gestes sur mobile). Ce sont
 * de vrais boutons radio, masqués visuellement : clavier (flèches), lecteurs
 * d'écran et `required` fonctionnent comme sur un select natif.
 */
export type ChipOption = { value: string; label: string };

export default function ChoiceChips({
  name,
  legend,
  options,
  value,
  onChange,
  required = false,
  tone = "light",
}: {
  name: string;
  legend: string;
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  tone?: "light" | "dark";
}) {
  const idle =
    tone === "dark"
      ? "border-white/40 text-white hover:border-white"
      : "border-line-strong text-ink-2 hover:border-ink";
  const active = tone === "dark" ? "bg-white text-eclat-ink border-white" : "bg-ink text-white border-ink";

  return (
    <fieldset className="border-none p-0 m-0 min-w-0">
      <legend className={`label mb-2 ${tone === "dark" ? "text-white" : "text-ink-2"}`}>
        {legend}
        {required && " *"}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={`relative cursor-pointer select-none rounded-full border px-3.5 py-2 text-body transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-eclat ${
                checked ? active : idle
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                required={required && i === 0}
                className="absolute opacity-0 w-px h-px"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** « Sophie Martin » → { firstname: "Sophie", lastname: "Martin" }. */
export function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  return { firstname: parts[0] ?? "", lastname: parts.slice(1).join(" ") };
}
