"use client";

/**
 * Champ téléphone avec sélecteur d'indicatif pays.
 *
 * L'ancien champ acceptait techniquement l'international (`/^\+?\d{9,15}$/`)
 * mais tout le reste était franco-français : placeholder « 06 12 34 56 78 »,
 * message d'erreur « 10 chiffres, ou +33 ». Un prospect belge ou québécois
 * — et la prospection en vise — lisait donc que son numéro était invalide
 * alors qu'il passait. C'était un abandon de formulaire sans cause visible.
 *
 * Le pays sélectionné pilote l'indicatif, le placeholder ET la longueur
 * nationale attendue, de sorte que la validation reste stricte par pays au
 * lieu de se relâcher pour tout le monde.
 */

export type Country = {
  /** ISO 3166-1 alpha-2, sert de clé et de libellé court. */
  code: string;
  name: string;
  /** Indicatif, sans le « + ». */
  dial: string;
  /** Nombre(s) de chiffres attendus APRÈS l'indicatif. */
  nsn: number[];
  placeholder: string;
  flag: string;
};

/**
 * Marchés visés par la prospection, en tête ; le reste couvre les cas
 * raisonnables sans transformer le menu en annuaire mondial.
 */
export const COUNTRIES: Country[] = [
  { code: "FR", name: "France", dial: "33", nsn: [9], placeholder: "6 12 34 56 78", flag: "🇫🇷" },
  { code: "BE", name: "Belgique", dial: "32", nsn: [8, 9], placeholder: "470 12 34 56", flag: "🇧🇪" },
  { code: "CA", name: "Canada / Québec", dial: "1", nsn: [10], placeholder: "514 123 4567", flag: "🇨🇦" },
  { code: "CH", name: "Suisse", dial: "41", nsn: [9], placeholder: "78 123 45 67", flag: "🇨🇭" },
  { code: "LU", name: "Luxembourg", dial: "352", nsn: [6, 8, 9], placeholder: "621 123 456", flag: "🇱🇺" },
  { code: "MC", name: "Monaco", dial: "377", nsn: [8], placeholder: "6 12 34 56 78", flag: "🇲🇨" },
  { code: "ES", name: "Espagne", dial: "34", nsn: [9], placeholder: "612 34 56 78", flag: "🇪🇸" },
  { code: "IT", name: "Italie", dial: "39", nsn: [9, 10], placeholder: "312 345 6789", flag: "🇮🇹" },
  { code: "DE", name: "Allemagne", dial: "49", nsn: [10, 11], placeholder: "151 23456789", flag: "🇩🇪" },
  { code: "PT", name: "Portugal", dial: "351", nsn: [9], placeholder: "912 345 678", flag: "🇵🇹" },
  { code: "GB", name: "Royaume-Uni", dial: "44", nsn: [10], placeholder: "7400 123456", flag: "🇬🇧" },
  { code: "US", name: "États-Unis", dial: "1", nsn: [10], placeholder: "212 555 0123", flag: "🇺🇸" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

export function findCountry(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? DEFAULT_COUNTRY;
}

/** Ne garde que les chiffres de la partie nationale saisie. */
export function nationalDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * Numéro complet au format E.164 (`+33612345678`), seul format que l'on
 * transmet à l'API : il est non ambigu quel que soit le pays.
 */
export function toE164(country: Country, raw: string): string {
  let d = nationalDigits(raw);
  // Beaucoup de gens saisissent le 0 de service national (« 06 12… ») même
  // après avoir choisi un indicatif. En E.164 ce 0 ne doit pas apparaître.
  // Le plan nord-américain (+1) n'a pas de préfixe de ce type : on n'y touche pas.
  if (country.dial !== "1" && d.startsWith("0")) d = d.slice(1);
  return `+${country.dial}${d}`;
}

export function isValidPhone(country: Country, raw: string): boolean {
  let d = nationalDigits(raw);
  if (country.dial !== "1" && d.startsWith("0")) d = d.slice(1);
  return country.nsn.includes(d.length);
}

/** Libellé d'aide, dérivé du pays pour rester exact partout. */
export function phoneHint(country: Country): string {
  const n = country.nsn;
  const digits =
    n.length === 1 ? `${n[0]} chiffres` : `${n.slice(0, -1).join(", ")} ou ${n[n.length - 1]} chiffres`;
  // Le plan de numérotation nord-américain (+1) n'a pas de préfixe national :
  // annoncer un « 0 initial facultatif » y serait faux, et `toE164` ne le
  // retire d'ailleurs pas pour ce pays.
  const trunk = country.dial === "1" ? "" : " Le 0 initial est facultatif.";
  return `${digits} après l'indicatif +${country.dial}. Espaces et points acceptés.${trunk}`;
}

type Props = {
  id: string;
  country: Country;
  onCountryChange: (c: Country) => void;
  value: string;
  onValueChange: (v: string) => void;
  invalid?: boolean;
  required?: boolean;
  label?: string;
};

export default function PhoneField({
  id,
  country,
  onCountryChange,
  value,
  onValueChange,
  invalid,
  required = true,
  label = "Votre numéro",
}: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="label text-ink-2">
        {label} {required && "*"}
      </label>

      <div className="flex gap-2">
        {/* `<select>` natif : sur mobile il ouvre le sélecteur du système,
            qui est plus rapide et plus accessible qu'un menu maison — et
            l'essentiel du trafic visé est mobile. */}
        <select
          aria-label="Indicatif pays"
          value={country.code}
          onChange={(e) => onCountryChange(findCountry(e.target.value))}
          className="field w-auto shrink-0 pr-8"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} +{c.dial}
            </option>
          ))}
        </select>

        <input
          id={id}
          name="phone"
          type="tel"
          required={required}
          autoComplete="tel-national"
          inputMode="tel"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={country.placeholder}
          aria-describedby={`${id}-help`}
          aria-invalid={invalid}
          className="field flex-1 min-w-0"
        />
      </div>

      <p id={`${id}-help`} className="text-caption text-ink-3 font-light">
        {phoneHint(country)}
      </p>
    </div>
  );
}
