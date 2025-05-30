
import { AccessibilitySettingsForm } from "@/components/accessibility/accessibility-settings-form";
import { Settings2 } from "lucide-react";

export default function AccessibilityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><Settings2 className="h-8 w-8 text-primary" /> Accessibility</h1>
        <p className="text-muted-foreground">
          Adjust settings to make Gamify Language Mastery more comfortable and accessible for you.
        </p>
      </div>
      <AccessibilitySettingsForm />
    </div>
  );
}
