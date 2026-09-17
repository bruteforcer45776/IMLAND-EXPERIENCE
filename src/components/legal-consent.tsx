import { Link } from "@tanstack/react-router";

export function LegalConsent({
  id,
  checked,
  onChange,
  includeTerms = false,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  includeTerms?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-3 text-left text-xs leading-relaxed text-muted-foreground"
    >
      <input
        id={id}
        type="checkbox"
        required
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
      />
      <span>
        Dichiaro di aver letto la{" "}
        <Link to="/privacy" className="font-semibold underline underline-offset-2">
          Privacy Policy
        </Link>
        {includeTerms ? (
          <>
            {" "}
            e di accettare i{" "}
            <Link to="/termini" className="font-semibold underline underline-offset-2">
              Termini e Condizioni
            </Link>
          </>
        ) : null}
        .
      </span>
    </label>
  );
}
