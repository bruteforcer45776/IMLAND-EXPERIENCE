import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { OnboardingWizard } from "@/components/onboarding-wizard";

export const Route = createFileRoute("/_authenticated/benvenuto")({
  head: () => ({
    meta: [
      { title: "Benvenuto — IMLAND EXPERIENCE" },
      { name: "description", content: "Raccontaci cosa ti interessa: organizziamo i contenuti su misura." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  return (
    <OnboardingWizard
      onDone={(accountType) =>
        void navigate({ to: accountType === "azienda" ? "/area-aziende" : "/ascoltatore", replace: true })
      }
    />
  );
}
