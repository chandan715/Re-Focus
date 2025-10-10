import { Helmet } from "react-helmet-async";
import React, { useState, useEffect } from "react";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import { 
  Heart, 
  Brain, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  Smile,
  Meh,
  Frown,
  Coffee,
  BookOpen,
  Music,
  Dumbbell,
  Moon,
  Users,
  Briefcase,
  Target
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

interface MoodEntry {
  id: number;
  timestamp: string;
  mood: 'excellent' | 'good' | 'okay' | 'bad' | 'terrible';
  energy_level: number;
  stress_level: number;
  notes: string;
  activities: string;
  tags: string;
}

const Mood = () => {
  console.log("🎭 Mood component rendering");
  
  const { accessToken, logout } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMood, setShowAddMood] = useState(false);
  const [selectedMood, setSelectedMood] = useState<'excellent' | 'good' | 'okay' | 'bad' | 'terrible'>('good');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [notes, setNotes] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [tags, setTags] = useState('');
  const [editMood, setEditMood] = useState<MoodEntry | null>(null);

  console.log("🎭 State:", { loading, moodEntriesCount: moodEntries.length, hasToken: !!accessToken });

  useEffect(() => {
    let isMounted = true;

    const fetchMoods = async () => {
      const token = localStorage.getItem("accessToken");
      console.log("🎭 Mood useEffect triggered");
      console.log("🔑 Token exists:", !!token);
      
      if (!token) {
        console.log("❌ No access token found, skipping mood fetch");
        if (isMounted) setLoading(false);
        return;
      }

      if (isMounted) setLoading(true);
      try {
        console.log("📡 Fetching moods from:", `${API_BASE}/api/emotional-checkins/`);
        const res = await authFetch(`${API_BASE}/api/emotional-checkins/`);
        console.log("📊 Mood fetch response status:", res.status);
        
        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          logout();
          return;
        }
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Failed to load mood entries, error:", errorText);
          throw new Error("Failed to load mood entries");
        }
        
        const data = await res.json();
        console.log("✅ Fetched mood entries from backend:", data);
        // Ensure data is an array
        const entries = Array.isArray(data) ? data : [];
        console.log("✅ Mood entries count:", entries.length);
        if (isMounted) setMoodEntries(entries);
      } catch (error: any) {
        console.error("❌ Exception while loading moods:", error);
        toast.error(error.message || "Failed to load mood entries");
        if (isMounted) setMoodEntries([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchMoods();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const moodOptions = [
    { value: 'excellent', label: 'Excellent', icon: Smile, color: 'text-green-600', bgColor: 'bg-green-50', emoji: '😄' },
    { value: 'good', label: 'Good', icon: Smile, color: 'text-blue-600', bgColor: 'bg-blue-50', emoji: '🙂' },
    { value: 'okay', label: 'Okay', icon: Meh, color: 'text-yellow-600', bgColor: 'bg-yellow-50', emoji: '😐' },
    { value: 'bad', label: 'Bad', icon: Frown, color: 'text-orange-600', bgColor: 'bg-orange-50', emoji: '😔' },
    { value: 'terrible', label: 'Terrible', icon: Frown, color: 'text-red-600', bgColor: 'bg-red-50', emoji: '😢' }
  ];

  const activityOptions = [
    { value: 'Exercise', icon: Dumbbell, color: 'text-green-600' },
    { value: 'Study', icon: BookOpen, color: 'text-blue-600' },
    { value: 'Work', icon: Briefcase, color: 'text-purple-600' },
    { value: 'Social', icon: Users, color: 'text-pink-600' },
    { value: 'Music', icon: Music, color: 'text-indigo-600' },
    { value: 'Sleep', icon: Moon, color: 'text-gray-600' },
    { value: 'Coffee', icon: Coffee, color: 'text-orange-600' }
  ];

  const getMoodStats = () => {
    const total = moodEntries.length;
    const excellent = moodEntries.filter(e => e.mood === 'excellent').length;
    const good = moodEntries.filter(e => e.mood === 'good').length;
    const okay = moodEntries.filter(e => e.mood === 'okay').length;
    const bad = moodEntries.filter(e => e.mood === 'bad').length;
    const terrible = moodEntries.filter(e => e.mood === 'terrible').length;
    return { total, excellent, good, okay, bad, terrible };
  };

  const getAverageEnergy = () => {
    if (moodEntries.length === 0) return 0;
    return Math.round(moodEntries.reduce((sum, e) => sum + e.energy_level, 0) / moodEntries.length);
  };

  const getAverageStress = () => {
    if (moodEntries.length === 0) return 0;
    return Math.round(moodEntries.reduce((sum, e) => sum + e.stress_level, 0) / moodEntries.length);
  };

  const addMoodEntry = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/emotional-checkins/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: selectedMood,
          energy_level: energyLevel,
          stress_level: stressLevel,
          notes,
          activities: selectedActivities.join(', '),
          tags: tags
        }),
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to add mood entry");
      }

      const newEntry = await res.json();
      setMoodEntries(prev => [newEntry, ...prev]);
      setShowAddMood(false);
      resetForm();
      toast.success("Mood entry added successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add mood entry");
    }
  };

  const resetForm = () => {
    setSelectedMood('good');
    setEnergyLevel(5);
    setStressLevel(5);
    setNotes('');
    setSelectedActivities([]);
    setTags('');
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await authFetch(`${API_BASE}/api/emotional-checkins/${id}/`, {
        method: 'DELETE',
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to delete mood entry");
      }

      setMoodEntries(moodEntries.filter(m => m.id !== id));
      setEditMood(null);
      toast.success("Mood entry deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete mood entry");
    }
  };

  const handleEdit = (mood: MoodEntry) => {
    setEditMood({ ...mood });
  };

  const handleSaveEdit = async () => {
    if (!editMood) return;

    try {
      const res = await authFetch(`${API_BASE}/api/emotional-checkins/${editMood.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: editMood.mood,
          energy_level: editMood.energy_level,
          stress_level: editMood.stress_level,
          notes: editMood.notes,
          activities: editMood.activities,
          tags: editMood.tags
        }),
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to update mood entry");
      }

      const updatedEntry = await res.json();
      setMoodEntries(moodEntries.map(m => m.id === editMood.id ? updatedEntry : m));
      setEditMood(null);
      toast.success("Mood entry updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update mood entry");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading mood entries...</p>
          </div>
        </div>
      </div>
    );
  }

  let stats;
  try {
    stats = getMoodStats();
  } catch (error) {
    console.error("Error getting mood stats:", error);
    stats = { total: 0, excellent: 0, good: 0, okay: 0, bad: 0, terrible: 0 };
  }

  console.log("About to render, stats:", stats);

  return (
    <>
      <Helmet>
        <title>Mood Tracking - Re-Focus</title>
        <meta name="description" content="Track your mood, energy, and stress levels to optimize your productivity" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Mood Intelligence</h1>
              <p className="text-xl text-muted-foreground">
                Track your emotional state and get insights to optimize your productivity
              </p>
            </div>
            <Button onClick={() => setShowAddMood(true)} className="mt-4 md:mt-0">
              <Plus className="mr-2 h-5 w-5" />
              Log Your Mood
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Mood Entries</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{getAverageEnergy()}/10</div>
                    <div className="text-sm text-muted-foreground">Avg Energy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{getAverageStress()}/10</div>
                    <div className="text-sm text-muted-foreground">Avg Stress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-purple-100">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {stats.excellent + stats.good > 0 ? Math.round(((stats.excellent + stats.good) / stats.total) * 100) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Positive Days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mood Distribution */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
              <CardDescription>How you've been feeling over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-5">
                {moodOptions.map((mood) => (
                  <div key={mood.value} className="text-center">
                    <div className={`p-4 rounded-lg ${mood.bgColor} mb-3`}>
                      <span className="text-3xl">{mood.emoji}</span>
                    </div>
                    <div className="text-lg font-semibold">{mood.label}</div>
                    <div className="text-2xl font-bold text-primary">
                      {stats[mood.value as keyof typeof stats]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stats.total > 0 ? Math.round((stats[mood.value as keyof typeof stats] / stats.total) * 100) : 0}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Mood Entries */}
          {moodEntries.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No mood entries yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your mood to gain insights into your emotional patterns
                </p>
                <Button onClick={() => setShowAddMood(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Your First Mood
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {moodEntries.map((entry) => (
              <Card key={entry.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${moodOptions.find(m => m.value === entry.mood)?.bgColor}`}>
                      <span className="text-2xl">
                        {moodOptions.find(m => m.value === entry.mood)?.emoji}
                      </span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(entry)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={moodOptions.find(m => m.value === entry.mood)?.bgColor}>
                        {moodOptions.find(m => m.value === entry.mood)?.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Energy Level</span>
                        <span className="font-medium">{entry.energy_level}/10</span>
                      </div>
                      <Progress value={entry.energy_level * 10} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Stress Level</span>
                        <span className="font-medium">{entry.stress_level}/10</span>
                      </div>
                      <Progress value={entry.stress_level * 10} className="h-2" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {entry.notes}
                    </p>
                  )}
                  {entry.activities && entry.activities.trim() && (
                    <div className="mb-3">
                      <Label className="text-xs font-medium text-muted-foreground">Activities</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.activities.split(',').map((activity, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {activity.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {entry.tags && entry.tags.trim() && (
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Tags</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.tags.split(',').map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            #{tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            </div>
          )}

          {/* Add Mood Modal */}
          {showAddMood && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>How are you feeling?</CardTitle>
                  <CardDescription>Log your current mood and energy levels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mood Selection */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">How do you feel right now?</Label>
                    <div className="grid grid-cols-5 gap-3">
                      {moodOptions.map((mood) => (
                        <button
                          key={mood.value}
                          onClick={() => setSelectedMood(mood.value as 'excellent' | 'good' | 'okay' | 'bad' | 'terrible')}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedMood === mood.value 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="text-center">
                            <span className="text-3xl block mb-2">{mood.emoji}</span>
                            <span className="text-sm font-medium">{mood.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Energy Level */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Energy Level: {energyLevel}/10
                    </Label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={energyLevel}
                        onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Exhausted</span>
                        <span>Energized</span>
                      </div>
                    </div>
                  </div>
                  {/* Stress Level */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Stress Level: {stressLevel}/10
                    </Label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={stressLevel}
                        onChange={(e) => setStressLevel(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Calm</span>
                        <span>Overwhelmed</span>
                      </div>
                    </div>
                  </div>
                  {/* Activities */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">What have you been doing?</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {activityOptions.map((activity) => (
                        <button
                          key={activity.value}
                          onClick={() => toggleActivity(activity.value)}
                          className={`p-3 rounded-lg border transition-all ${
                            selectedActivities.includes(activity.value)
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="text-center">
                            {React.createElement(activity.icon, { 
                              className: `h-5 w-5 ${activity.color} mx-auto mb-1` 
                            })}
                            <span className="text-sm">{activity.value}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-base font-medium mb-2 block">
                      Any notes about how you're feeling?
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Describe your mood, what's affecting you, or any insights..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  {/* Tags */}
                  <div>
                    <Label htmlFor="tags" className="text-base font-medium mb-2 block">
                      Tags (comma-separated)
                    </Label>
                    <Input
                      id="tags"
                      placeholder="productive, motivated, tired, etc."
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button onClick={addMoodEntry} className="flex-1">
                      <Heart className="mr-2 h-4 w-4" />
                      Log Mood
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddMood(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Edit Mood Modal */}
          {editMood && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Edit Mood Entry</CardTitle>
                  <CardDescription>Update your mood details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="edit-note">Note</Label>
                    <Textarea
                      id="edit-note"
                      value={editMood.notes ?? ""}
                      onChange={e => setEditMood({ ...editMood, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-energy">Energy Level</Label>
                    <Input
                      id="edit-energy"
                      type="number"
                      min={1}
                      max={10}
                      value={editMood.energy_level ?? 5}
                      onChange={e => setEditMood({ ...editMood, energy_level: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-stress">Stress Level</Label>
                    <Input
                      id="edit-stress"
                      type="number"
                      min={1}
                      max={10}
                      value={editMood.stress_level ?? 5}
                      onChange={e => setEditMood({ ...editMood, stress_level: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                    <Input
                      id="edit-tags"
                      value={editMood.tags ?? ""}
                      onChange={e => setEditMood({ ...editMood, tags: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setEditMood(null)}>Cancel</Button>
                    <Button onClick={handleSaveEdit}>Save</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Mood;
