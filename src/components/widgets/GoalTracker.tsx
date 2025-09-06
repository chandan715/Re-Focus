import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Goal {
  id: string;
  name: string;
  category: string;
  progress: number;
}

const CATEGORIES = ["Academic", "Career", "Skill", "Health"];

const GoalTracker = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    const stored = localStorage.getItem("refocus_goals");
    if (stored) setGoals(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("refocus_goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!name.trim()) return;
    setGoals((g) => [{ id: crypto.randomUUID(), name: name.trim(), category, progress: 0 }, ...g]);
    setName("");
  };

  const updateProgress = (id: string, progress: number) => {
    setGoals((g) => g.map((goal) => (goal.id === id ? { ...goal, progress } : goal)));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a Goal</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_200px_auto]">
          <Input placeholder="e.g., Finish Chapter 5" value={name} onChange={(e) => setName(e.target.value)} />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addGoal} variant="hero">Add</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <CardTitle className="text-base">
                <span className="font-semibold">{goal.name}</span>
                <span className="ml-2 text-sm text-muted-foreground">{goal.category}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={goal.progress} />
              <div className="flex gap-2">
                {[0, 25, 50, 75, 100].map((p) => (
                  <Button key={p} size="sm" variant={goal.progress === p ? "secondary" : "outline"} onClick={() => updateProgress(goal.id, p)}>
                    {p}%
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalTracker;
