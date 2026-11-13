import type { Choice } from "@/lib/methodology/types"
import { ChoiceList } from "./choice-list"

interface ChoiceWithTextProps {
  options: Choice[]
  value: string | null
  text: string
  maxLength?: number
  /** When set, the field appears only after this option is chosen. */
  textOptionValue: string | null
  accent: string
  accentInk: string
  onChange: (next: { optionValue: string; text: string }) => void
}

export function ChoiceWithText({
  options,
  value,
  text,
  maxLength = 100,
  textOptionValue,
  accent,
  accentInk,
  onChange,
}: ChoiceWithTextProps) {
  const showText = textOptionValue == null || value === textOptionValue

  return (
    <div className="space-y-3">
      <ChoiceList
        options={options}
        value={value}
        accent={accent}
        accentInk={accentInk}
        onChange={(optionValue) => onChange({ optionValue, text: optionValue === textOptionValue || textOptionValue == null ? text : "" })}
      />
      {showText ? (
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">En tus palabras. Máximo {maxLength} caracteres.</span>
          <textarea
            value={text}
            maxLength={maxLength}
            rows={3}
            onChange={(event) => onChange({ optionValue: value ?? "", text: event.target.value.slice(0, maxLength) })}
            className="w-full resize-none rounded-2xl border bg-background px-3 py-2 text-base leading-relaxed"
          />
          <span className="block text-right text-xs tabular-nums text-muted-foreground">
            {text.length} / {maxLength}
          </span>
        </label>
      ) : null}
    </div>
  )
}
