import { Helmet } from "react-helmet-async";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Label } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Target, 
  Clock, 
  Coffee, 
  Brain,
  Zap,
  TrendingUp,
  BarChart3,
  Settings,
  Volume2,
  VolumeX,
  Sun,
  Moon
} from "lucide-react";
import TimerSettings from "./TimerSettings";
import FocusSession from "./FocusSession";
import { authFetch } from "@/lib/authFetch";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  totalTime: number;
  currentPhase: 'focus' | 'shortBreak' | 'longBreak';
  completedSessions: number;
  currentSession: number;
}

const FocusPage = () => {
  const navigate = useNavigate();
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    timeLeft: 25 * 60, // 25 minutes in seconds
    totalTime: 25 * 60,
    currentPhase: 'focus',
    completedSessions: 0,
    currentSession: 1
  });

  const [settings, setSettings] = useState({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartFocus: false,
    soundEnabled: true,
    theme: 'light'
  });

  const [currentGoal, setCurrentGoal] = useState('');
  const [distractions, setDistractions] = useState<string[]>([]);
  const [sessionRecorded, setSessionRecorded] = useState(false);
  const [todayMinutes, setTodayMinutes] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [focusDuration, setFocusDuration] = useState(0);
  const [shortBreak, setShortBreak] = useState(() => {
    const stored = localStorage.getItem("shortBreak");
    return stored ? Number(stored) : 5;
  });
  const [longBreak, setLongBreak] = useState(() => {
    const stored = localStorage.getItem("longBreak");
    return stored ? Number(stored) : 15;
  });
  const [longBreakEvery, setLongBreakEvery] = useState(() => {
    const stored = localStorage.getItem("longBreakEvery");
    return stored ? Number(stored) : 4;
  });

  // Load goals from localStorage
  useEffect(() => {
    const storedGoals = localStorage.getItem("goals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerState.isRunning && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            // Timer finished
            if (settings.soundEnabled) {
              // Play notification sound
              new Audio('/notification.mp3').play().catch(() => {});
            }
            
            // Determine next phase
            if (prev.currentPhase === 'focus') {
              const shouldTakeLongBreak = (prev.completedSessions + 1) % settings.longBreakInterval === 0;
              return {
                ...prev,
                isRunning: false,
                timeLeft: shouldTakeLongBreak ? settings.longBreakDuration * 60 : settings.shortBreakDuration * 60,
                totalTime: shouldTakeLongBreak ? settings.longBreakDuration * 60 : settings.shortBreakDuration * 60,
                currentPhase: shouldTakeLongBreak ? 'longBreak' : 'shortBreak',
                completedSessions: prev.completedSessions + 1,
                currentSession: prev.currentSession + 1
              };

  // Record completed focus session in backend and refresh stats
  const recordFocusSession = useCallback(async () => {
    try {
      // Create session
      const createRes = await authFetch(`${API_BASE}/api/focus-sessions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_type: 'pomodoro',
          duration_minutes: settings.focusDuration,
          completed: false,
        }),
      });
      if (!createRes.ok) return;
      const created = await createRes.json();
      const id = created?.id;
      if (id) {
        // Mark complete to set end_time and update streak
        await authFetch(`${API_BASE}/api/focus-sessions/${id}/complete/`, { method: 'POST' });
      }
      // Refresh dashboard stats (today minutes)
      const statsRes = await authFetch(`${API_BASE}/api/dashboard/stats/`);
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setTodayMinutes(Number(stats?.today_minutes ?? 0));
      }
    } catch (_) {
      // ignore errors silently in UI
    }
  }, [settings.focusDuration]);

  // When a focus session ends (timeLeft hits 0 during focus), record it once
  useEffect(() => {
    if (timerState.timeLeft === 0 && !sessionRecorded && timerState.currentPhase === 'focus') {
      setSessionRecorded(true);
      recordFocusSession();
    }
  }, [timerState.timeLeft, timerState.currentPhase, sessionRecorded, recordFocusSession]);

  // Initial load of today minutes
  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_BASE}/api/dashboard/stats/`);
        if (res.ok) {
          const stats = await res.json();
          setTodayMinutes(Number(stats?.today_minutes ?? 0));
        }
      } catch (_) {}
    })();
  }, []);
            } else {
              // Break finished, start next focus session
              return {
                ...prev,
                isRunning: false,
                timeLeft: settings.focusDuration * 60,
                totalTime: settings.focusDuration * 60,
                currentPhase: 'focus',
                currentSession: prev.currentSession + 1
              };
            }
          }
          
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1
          };
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.timeLeft, settings]);

  const startTimer = useCallback(() => {
    if (focusDuration === 0) return; // Prevent starting if duration is zero
    setTimerState(prev => ({ ...prev, isRunning: true }));
  }, [focusDuration]);

  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.totalTime
    }));
  }, []);

  const skipPhase = useCallback(() => {
    setTimerState(prev => {
      if (prev.currentPhase === 'focus') {
        const shouldTakeLongBreak = (prev.completedSessions + 1) % settings.longBreakInterval === 0;
        return {
          ...prev,
          isRunning: false,
          timeLeft: shouldTakeLongBreak ? settings.longBreakDuration * 60 : settings.shortBreakDuration * 60,
          totalTime: shouldTakeLongBreak ? settings.longBreakDuration * 60 : settings.shortBreakDuration * 60,
          currentPhase: shouldTakeLongBreak ? 'longBreak' : 'shortBreak',
          completedSessions: prev.completedSessions + 1,
          currentSession: prev.currentSession + 1
        };
      } else {
        return {
          ...prev,
          isRunning: false,
          timeLeft: settings.focusDuration * 60,
          totalTime: settings.focusDuration * 60,
          currentPhase: 'focus',
          currentSession: prev.currentSession + 1
        };
      }
    });
  }, [settings]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((timerState.totalTime - timerState.timeLeft) / timerState.totalTime) * 100;
  };

  const getPhaseColor = () => {
    switch (timerState.currentPhase) {
      case 'focus': return 'text-red-500';
      case 'shortBreak': return 'text-green-500';
      case 'longBreak': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getPhaseIcon = () => {
    switch (timerState.currentPhase) {
      case 'focus': return <Target className="h-6 w-6" />;
      case 'shortBreak': return <Coffee className="h-6 w-6" />;
      case 'longBreak': return <Brain className="h-6 w-6" />;
      default: return <Clock className="h-6 w-6" />;
    }
  };

  const addDistraction = () => {
    if (currentGoal.trim()) {
      setDistractions(prev => [...prev, currentGoal.trim()]);
      setCurrentGoal('');
    }
  };

  const handleStart = () => {
    setTimerState(prev => ({ ...prev, isRunning: true }));
    setSessionRecorded(false);
    timerRef.current = setInterval(() => {
      setTimerState(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timerRef.current!);
          setTimerState(prev => ({ ...prev, isRunning: false }));
          return {
            ...prev,
            timeLeft: 0
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1
        };
      });
    }, 1000);
  };

  const handleStop = () => {
    setTimerState(prev => ({ ...prev, isRunning: false }));
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setSettings(prev => ({ ...prev, focusDuration: value }));
    setTimerState(prev => ({ ...prev, totalTime: value * 60, timeLeft: value * 60 }));
  };

  const handleEdit = (id: string) => {
    // Edit goal logic
  };

  const handleDelete = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const handleUpdateProgress = (id: string) => {
    // Update progress logic
  };

  const handleLogTime = (id: string) => {
    // Log time logic
  };

  // Handler to save settings
  const handleSetTimer = (newDuration: number) => {
    // Save all settings to localStorage
    localStorage.setItem("focusDuration", newDuration.toString());
    localStorage.setItem("shortBreak", shortBreak.toString());
    localStorage.setItem("longBreak", longBreak.toString());
    localStorage.setItem("longBreakEvery", longBreakEvery.toString());

    // Update state
    setFocusDuration(newDuration);

    // Update timerState so timer reflects new duration immediately
    setTimerState(prev => ({
      ...prev,
      totalTime: newDuration * 60,
      timeLeft: newDuration * 60,
      currentPhase: 'focus',
      isRunning: false
    }));
  };

  return (
    <>
      <Helmet>
        <title>Focus - Re-Focus</title>
        <meta name="description" content="Stay focused with our Pomodoro timer and productivity tools" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Focus Mode
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Maximize your productivity with our intelligent Pomodoro timer and focus tools
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Timer */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className={`p-3 rounded-full bg-primary/10 ${getPhaseColor()}`}>
                      {getPhaseIcon()}
                    </div>
                    <div>
                      <CardTitle className="text-2xl capitalize">
                        {timerState.currentPhase === 'focus' ? 'Focus Session' : 
                         timerState.currentPhase === 'shortBreak' ? 'Short Break' : 'Long Break'}
                      </CardTitle>
                      <CardDescription>
                        Session {timerState.currentSession} • {timerState.completedSessions} completed
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="text-6xl font-bold font-mono mb-6">
                    {formatTime(timerState.timeLeft)}
                  </div>
                  
                  <Progress value={getProgress()} className="h-3 mb-8" />
                  
                  <div className="flex justify-center gap-4">
                    {timerState.isRunning ? (
                      <Button onClick={pauseTimer} size="lg" className="px-8">
                        <Pause className="mr-2 h-5 w-5" />
                        Pause
                      </Button>
                    ) : (
                      <Button onClick={startTimer} size="lg" className="px-8">
                        <Play className="mr-2 h-5 w-5" />
                        Start
                      </Button>
                    )}
                    <Button variant="outline" onClick={resetTimer} size="lg">
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Reset
                    </Button>
                    <Button variant="outline" onClick={skipPhase} size="lg">
                      <SkipForward className="mr-2 h-5 w-5" />
                      Skip
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Goal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Current Goal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal">What are you working on?</Label>
                    <div className="flex gap-2">
                      <Input
                        id="goal"
                        placeholder="e.g., Complete Python assignment"
                        value={currentGoal}
                        onChange={(e) => setCurrentGoal(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addDistraction()}
                      />
                      <Button onClick={addDistraction} size="sm">
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {distractions.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Today's Goals:</Label>
                      <div className="mt-2 space-y-2">
                        {distractions.map((goal, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="text-sm">{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Today's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{timerState.completedSessions}</div>
                      <div className="text-sm text-muted-foreground">Sessions (local)</div>
                    </div>
                    <div className="text-center p-3 bg-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {todayMinutes !== null ? (todayMinutes / 60).toFixed(1) : ((timerState.completedSessions * settings.focusDuration) / 60).toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Hours (today)</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Current Streak</span>
                      <Badge variant="secondary">3 days</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Timer Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/analytics')}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/mood')}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Mood Check-in
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Timer Settings</CardTitle>
                <CardDescription>Customize your focus sessions and breaks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="focusDuration">Focus Duration (minutes)</Label>
                      <Input
                        id="focusDuration"
                        type="number"
                        min={1}
                        value={focusDuration}
                        onChange={e => setFocusDuration(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="longBreakEvery">Long Break Every (sessions)</Label>
                      <Input
                        id="longBreakEvery"
                        type="number"
                        min={1}
                        value={longBreakEvery}
                        onChange={e => setLongBreakEvery(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shortBreak">Short Break (minutes)</Label>
                      <Input
                        id="shortBreak"
                        type="number"
                        min={1}
                        value={shortBreak}
                        onChange={e => setShortBreak(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="longBreak">Long Break (minutes)</Label>
                      <Input
                        id="longBreak"
                        type="number"
                        min={1}
                        value={longBreak}
                        onChange={e => setLongBreak(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => handleSetTimer(focusDuration)}>Set</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default FocusPage;
