import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MOODS = [
  { id: "happy", label: "Happy" },
  { id: "neutral", label: "Neutral" },
  { id: "stressed", label: "Stressed" },
  { id: "demotivated", label: "Demotivated" },
];

const TIPS: Record<string, string> = {
  happy: "Leverage your energy—tackle a challenging task now!",
  neutral: "Start with a 10‑minute warm‑up session to build momentum.",
  stressed: "Try a 5‑minute breath + short walk. Then a 20‑min focus sprint.",
  demotivated: "Pick the smallest next step. Done beats perfect.",
};

const MoodCheckIn = () => {
  const [mood, setMood] = useState<string | null>(null);
  const [history, setHistory] = useState<{ id: string; t: number }[]>([]);

  useEffect(() => {
    const h = localStorage.getItem("refocus_mood_history");
    if (h) setHistory(JSON.parse(h));
  }, []);

  useEffect(() => {
    localStorage.setItem("refocus_mood_history", JSON.stringify(history));
  }, [history]);

  const selectMood = (id: string) => {
    setMood(id);
    setHistory((arr) => [{ id, t: Date.now() }, ...arr].slice(0, 50));
  };

  const streak = (() => {
    const day = 24 * 60 * 60 * 1000;
    const today = new Date();
    return history.reduce((s, item) => (today.getTime() - item.t < (s + 1) * day ? s + 1 : s), 0);
  })();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <Button key={m.id} variant={mood === m.id ? "secondary" : "outline"} onClick={() => selectMood(m.id)}>
              {m.label}
            </Button>
          ))}
        </div>
        {mood && (
          <div className="rounded-md border p-4 bg-card">
            <p className="text-sm text-muted-foreground">Tip</p>
            <p className="mt-1">{TIPS[mood]}</p>
          </div>
        )}
        <p className="text-xs text-muted-foreground">Check‑in streak: {streak} days</p>
      </CardContent>
    </Card>
  );
};

export default MoodCheckIn;
