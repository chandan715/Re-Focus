import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

function secondsToMMSS(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

const PomodoroTimer = () => {
  const [focusMin, setFocusMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(focusMin * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setSecondsLeft(focusMin * 60);
  }, [focusMin]);

  const total = useMemo(() => (isFocus ? focusMin * 60 : breakMin * 60), [isFocus, focusMin, breakMin]);
  const pct = Math.max(0, Math.min(100, (1 - secondsLeft / total) * 100));

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          const nextIsFocus = !isFocus;
          toast({ title: nextIsFocus ? "Break Over — Back to Focus" : "Session Complete — Take a Break", description: "You’re doing great. Keep the momentum!" });
          setIsFocus(nextIsFocus);
          return (nextIsFocus ? focusMin : breakMin) * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning, isFocus, focusMin, breakMin]);

  const toggle = () => setIsRunning((v) => !v);
  const reset = () => {
    setIsRunning(false);
    setIsFocus(true);
    setSecondsLeft(focusMin * 60);
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Pomodoro Focus</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-6xl font-bold tracking-tight text-center select-none">
          {secondsToMMSS(secondsLeft)}
        </div>
        <Progress value={pct} />
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Focus (min)</p>
            <Slider value={[focusMin]} min={10} max={60} step={5} onValueChange={(v) => setFocusMin(v[0])} />
          </div>
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Break (min)</p>
            <Slider value={[breakMin]} min={3} max={20} step={1} onValueChange={(v) => setBreakMin(v[0])} />
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={toggle} variant={isRunning ? "secondary" : "hero"}>
            {isRunning ? "Pause" : isFocus ? "Start Focus" : "Start Break"}
          </Button>
          <Button onClick={reset} variant="outline">Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
