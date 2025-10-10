import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const STORAGE_KEY = "refocus.reminderSettings";

type ReminderSettingsData = {
  email: string;
  phone: string;
};

const ReminderSettings = () => {
  const [data, setData] = useState<ReminderSettingsData>({ email: "", phone: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ReminderSettingsData;
        setData({ email: parsed.email ?? "", phone: parsed.phone ?? "" });
      }
    } catch (e) {
      // no-op
    }
  }, []);

  const onSave = () => {
    // Basic, optional validation
    const emailOk = !data.email || /.+@.+\..+/.test(data.email);
    const phoneOk = !data.phone || /[0-9]{7,}/.test(data.phone.replace(/\D/g, ""));

    if (!emailOk || !phoneOk) {
      toast({
        title: "Check your details",
        description: !emailOk
          ? "Please enter a valid email address."
          : "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    toast({ title: "Reminder details saved", description: "We'll use these once reminders are enabled." });
  };

  return (
    <section aria-label="Reminder settings" className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-xl font-medium">Reminder settings</h2>
        <p className="text-sm text-muted-foreground">
          Add your email or mobile number to receive reminders for focus sessions and goals.
          Note: To actually send Email/SMS, connect Supabase in the project settings.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="reminder-email">Email (optional)</Label>
          <Input
            id="reminder-email"
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => setData((s) => ({ ...s, email: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reminder-phone">Mobile number (optional)</Label>
          <Input
            id="reminder-phone"
            type="tel"
            placeholder="e.g. +1 555 123 4567"
            value={data.phone}
            onChange={(e) => setData((s) => ({ ...s, phone: e.target.value }))}
          />
        </div>
      </div>

      <div className="mt-4">
        <Button onClick={onSave}>Save reminder details</Button>
      </div>
    </section>
  );
};

export default ReminderSettings;
