import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Edit, 
  Trash2,
  BookOpen,
  Code,
  Dumbbell,
  Music,
  Palette,
  Globe,
  Search,
  BarChart3
} from "lucide-react";
import React from "react";
import { authFetch } from "@/lib/authFetch";
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
import { useAuth } from "@/context/AuthContext";
import { startMotivationEmails, stopMotivationEmails } from "@/lib/motivation";

// Define the Goal type
type Goal = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
  targetDate: string;
  progress: number;
  createdAt: string;
};

// Initial goals
const initialGoals: Goal[] = [
  {
    id: '1',
    title: "Learn React",
    description: "Complete the React documentation and build a sample project.",
    category: "Programming",
    priority: "high",
    status: "not_started",
    targetDate: new Date().toISOString().split('T')[0],
    progress: 0,
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: '2',
    title: "Read a Book",
    description: "Finish reading 'Atomic Habits'.",
    category: "Reading",
    priority: "medium",
    status: "in_progress",
    targetDate: new Date().toISOString().split('T')[0],
    progress: 40,
    createdAt: new Date().toISOString().split('T')[0]
  }
];

const categories = [
  { value: 'Programming', label: 'Programming', icon: Code, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { value: 'Reading', label: 'Reading', icon: BookOpen, color: 'text-green-600', bgColor: 'bg-green-50' },
  { value: 'Personal Development', label: 'Personal Development', icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { value: 'Fitness', label: 'Fitness', icon: Dumbbell, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { value: 'Music', label: 'Music', icon: Music, color: 'text-pink-600', bgColor: 'bg-pink-50' },
  { value: 'Art', label: 'Art', icon: Palette, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { value: 'Language', label: 'Language', icon: Globe, color: 'text-teal-600', bgColor: 'bg-teal-50' }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'low': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-50';
    case 'in_progress': return 'text-blue-600 bg-blue-50';
    case 'paused': return 'text-yellow-600 bg-yellow-50';
    case 'not_started': return 'text-gray-600 bg-gray-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4" />;
    case 'in_progress': return <TrendingUp className="h-4 w-4" />;
    case 'paused': return <Clock className="h-4 w-4" />;
    case 'not_started': return <Target className="h-4 w-4" />;
    default: return <Target className="h-4 w-4" />;
  }
};

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'Programming',
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetDate: new Date().toISOString().split('T')[0]
  });
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [progressGoal, setProgressGoal] = useState<Goal | null>(null);
  const [logTimeGoal, setLogTimeGoal] = useState<Goal | null>(null);
  const [loggedTime, setLoggedTime] = useState<number>(0);
  const { isAuthenticated } = useAuth();
  const [emailBusyId, setEmailBusyId] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch goals from backend on mount
  useEffect(() => {
    let isMounted = true;

    const fetchGoals = async () => {
      const token = localStorage.getItem("accessToken");
      console.log("🔍 Goals useEffect triggered");
      console.log("🔑 Token exists:", !!token);
      
      if (!token) {
        console.log("❌ No access token found, skipping fetch");
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        if (isMounted) setIsLoading(true);
        console.log("📡 Fetching goals from:", `${API_BASE}/api/goals/`);
        const res = await authFetch(`${API_BASE}/api/goals/`);
        console.log("📊 Fetch response status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("✅ Fetched goals from backend:", data);
          
          // Handle paginated response (DRF pagination)
          const goalsArray = Array.isArray(data) ? data : (data.results || []);
          console.log("✅ Goals array:", goalsArray);
          console.log("✅ Number of goals:", goalsArray.length);
          
          if (isMounted) {
            // Map backend fields to frontend format
            const mappedGoals = goalsArray.map((goal: any) => ({
              id: goal.id.toString(),
              title: goal.title,
              description: goal.description || '',
              category: goal.category || 'Programming',
              priority: goal.priority,
              status: goal.status,
              targetDate: goal.target_date || new Date().toISOString().split('T')[0],
              progress: goal.progress || 0,
              createdAt: goal.created_at || new Date().toISOString()
            }));
            console.log("✅ Mapped goals:", mappedGoals);
            console.log("✅ Setting goals state with", mappedGoals.length, "goals");
            setGoals(mappedGoals);
          }
        } else {
          console.error("❌ Failed to fetch goals, status:", res.status);
          const errorText = await res.text();
          console.error("❌ Error response:", errorText);
        }
      } catch (error) {
        console.error("❌ Exception while fetching goals:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchGoals();

    return () => {
      isMounted = false;
    };
  }, []);

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      const res = await authFetch(`${API_BASE}/api/goals/${id}/`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setGoals(goals.filter(goal => goal.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete goal:", error);
    }
  };

  // Add goal handler
  const handleAddGoal = async () => {
    if (newGoal.title.trim()) {
      try {
        console.log("Creating goal:", newGoal);
        const res = await authFetch(`${API_BASE}/api/goals/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newGoal.title,
            description: newGoal.description,
            category: newGoal.category,
            priority: newGoal.priority,
            target_date: newGoal.targetDate,
            status: 'not_started',
            progress: 0
          }),
        });
        
        console.log("Create goal response status:", res.status);
        if (res.ok) {
          const savedGoal = await res.json();
          console.log("Saved goal from backend:", savedGoal);
          // Map backend fields to frontend format
          const mappedGoal = {
            id: savedGoal.id.toString(),
            title: savedGoal.title,
            description: savedGoal.description || '',
            category: savedGoal.category || 'Programming',
            priority: savedGoal.priority,
            status: savedGoal.status,
            targetDate: savedGoal.target_date || new Date().toISOString().split('T')[0],
            progress: savedGoal.progress || 0,
            createdAt: savedGoal.created_at || new Date().toISOString()
          };
          console.log("Mapped goal:", mappedGoal);
          setGoals([...goals, mappedGoal]);
          setShowAddGoal(false);
          setNewGoal({
            title: '',
            description: '',
            category: 'Programming',
            priority: 'medium',
            targetDate: new Date().toISOString().split('T')[0]
          });
        } else {
          const errorData = await res.text();
          console.error("Failed to create goal:", res.status, errorData);
        }
      } catch (error) {
        console.error("Failed to add goal:", error);
      }
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditGoal(goal);
  };

  const handleUpdateGoal = async () => {
    if (editGoal) {
      try {
        const res = await authFetch(`${API_BASE}/api/goals/${editGoal.id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editGoal.title,
            description: editGoal.description,
            category: editGoal.category,
            priority: editGoal.priority,
            target_date: editGoal.targetDate,
            status: editGoal.status
          }),
        });
        
        if (res.ok) {
          setGoals(goals.map(g => g.id === editGoal.id ? editGoal : g));
          setEditGoal(null);
        }
      } catch (error) {
        console.error("Failed to update goal:", error);
      }
    }
  };

  const handleUpdateProgress = (goal: Goal) => {
    setProgressGoal(goal);
  };

  const handleSaveProgress = async (progress: number) => {
    if (progressGoal) {
      try {
        const newStatus = progress === 100 ? 'completed' : (progress > 0 ? 'in_progress' : progressGoal.status);
        const res = await authFetch(`${API_BASE}/api/goals/${progressGoal.id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            progress: progress,
            status: newStatus,
            completed: progress === 100
          }),
        });
        
        if (res.ok) {
          setGoals(goals.map(g => g.id === progressGoal.id ? { ...g, progress, status: newStatus } : g));
          setProgressGoal(null);
        }
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
    }
  };

  const handleLogTime = (goal: Goal) => {
    setLogTimeGoal(goal);
    setLoggedTime(0);
  };

  const handleStartMotivation = async (goal: Goal) => {
    if (!isAuthenticated) {
      setEmailStatus((s) => ({ ...s, [goal.id]: 'Please log in to start emails.' }));
      return;
    }
    setEmailBusyId(goal.id);
    setEmailStatus((s) => ({ ...s, [goal.id]: '' }));
    try {
      await startMotivationEmails({ goal_label: goal.title, interval_minutes: 60 });
      setEmailStatus((s) => ({ ...s, [goal.id]: 'Hourly motivation emails started.' }));
    } catch (e: any) {
      setEmailStatus((s) => ({ ...s, [goal.id]: e?.message || 'Failed to start emails' }));
    } finally {
      setEmailBusyId(null);
    }
  };

  const handleStopMotivation = async (goal: Goal) => {
    if (!isAuthenticated) {
      setEmailStatus((s) => ({ ...s, [goal.id]: 'Please log in to stop emails.' }));
      return;
    }
    setEmailBusyId(goal.id);
    setEmailStatus((s) => ({ ...s, [goal.id]: '' }));
    try {
      await stopMotivationEmails({ goal_label: goal.title });
      setEmailStatus((s) => ({ ...s, [goal.id]: 'Motivation emails stopped.' }));
    } catch (e: any) {
      setEmailStatus((s) => ({ ...s, [goal.id]: e?.message || 'Failed to stop emails' }));
    } finally {
      setEmailBusyId(null);
    }
  };

  const handleSaveLogTime = () => {
    if (logTimeGoal && loggedTime > 0) {
      // Example: Increase progress by 10% for each log (customize as needed)
      const newProgress = Math.min(100, logTimeGoal.progress + loggedTime);
      setGoals(goals.map(g => g.id === logTimeGoal.id ? { ...g, progress: newProgress } : g));
      setLogTimeGoal(null);
      setLoggedTime(0);
    }
  };

  // Filtering and sorting
  const filteredGoals = goals
    .filter(goal => selectedCategory === 'all' || goal.category === selectedCategory)
    .filter(goal => goal.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'progress') {
        return b.progress - a.progress;
      } else if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'in_progress').length;
  const averageProgress = goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0;

  return (
    <>
      <Helmet>
        <title>Goals - Re-Focus</title>
        <meta name="description" content="Set, track, and achieve your goals with our comprehensive goal management system" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Goal Management</h1>
              <p className="text-xl text-muted-foreground">
                Set ambitious goals and track your progress towards achieving them
              </p>
            </div>
            <Button onClick={() => setShowAddGoal(true)} className="mt-4 md:mt-0">
              <Plus className="mr-2 h-5 w-5" />
              Add New Goal
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalGoals}</div>
                    <div className="text-sm text-muted-foreground">Total Goals</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{completedGoals}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-blue-100">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{inProgressGoals}</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-orange-100">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{averageProgress}%</div>
                    <div className="text-sm text-muted-foreground">Avg Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">Search goals</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search your goals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="progress">Progress</SelectItem>
                      <SelectItem value="date">Date Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Loading your goals...</h3>
              </CardContent>
            </Card>
          )}

          {/* Goals Grid */}
          {!isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGoals.map((goal) => (
              <Card key={goal.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${categories.find(c => c.value === goal.category)?.bgColor}`}>
                      {React.createElement(categories.find(c => c.value === goal.category)?.icon || Target, {
                        className: `h-5 w-5 ${categories.find(c => c.value === goal.category)?.color}`
                      })}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg mb-2">{goal.title}</CardTitle>
                  <CardDescription className="mb-4 line-clamp-2">
                    {goal.description}
                  </CardDescription>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                      </Badge>
                      <Badge className={getStatusColor(goal.status)}>
                        {getStatusIcon(goal.status)}
                        {goal.status.replace('_', ' ').charAt(0).toUpperCase() + goal.status.replace('_', ' ').slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleUpdateProgress(goal)}>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Update Progress
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleLogTime(goal)}>
                        <Clock className="mr-2 h-4 w-4" />
                        Log Time
                      </Button>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStartMotivation(goal)}
                        disabled={emailBusyId === goal.id}
                      >
                        {emailBusyId === goal.id ? 'Starting…' : 'Start Emails'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStopMotivation(goal)}
                        disabled={emailBusyId === goal.id}
                      >
                        {emailBusyId === goal.id ? 'Stopping…' : 'Stop Emails'}
                      </Button>
                    </div>
                    {emailStatus[goal.id] && (
                      <div className="text-xs text-muted-foreground pt-1">{emailStatus[goal.id]}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredGoals.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No goals found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Start by creating your first goal'
                  }
                </p>
                <Button onClick={() => setShowAddGoal(true)}>
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Add Goal Modal */}
          {showAddGoal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Add New Goal</CardTitle>
                  <CardDescription>Create a new goal to track your progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter goal title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your goal"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value as 'low' | 'medium' | 'high'})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowAddGoal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleAddGoal} className="flex-1" disabled={!newGoal.title.trim()}>
                      Add Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Edit Goal Modal */}
          {editGoal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Edit Goal</CardTitle>
                  <CardDescription>Update your goal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title">Goal Title</Label>
                    <Input
                      id="edit-title"
                      placeholder="Enter goal title"
                      value={editGoal.title}
                      onChange={(e) => setEditGoal({...editGoal, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      placeholder="Describe your goal"
                      value={editGoal.description}
                      onChange={(e) => setEditGoal({...editGoal, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-category">Category</Label>
                      <Select value={editGoal.category} onValueChange={(value) => setEditGoal({...editGoal, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-priority">Priority</Label>
                      <Select value={editGoal.priority} onValueChange={(value) => setEditGoal({...editGoal, priority: value as 'low' | 'medium' | 'high'})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-targetDate">Target Date</Label>
                    <Input
                      id="edit-targetDate"
                      type="date"
                      value={editGoal.targetDate}
                      onChange={(e) => setEditGoal({...editGoal, targetDate: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setEditGoal(null)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateGoal} className="flex-1" disabled={!editGoal.title.trim()}>
                      Update Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Update Progress Modal */}
          {progressGoal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle>Update Progress</CardTitle>
                  <CardDescription>Set your progress for this goal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="progress">Progress (%)</Label>
                    <Input
                      id="progress"
                      type="number"
                      min={0}
                      max={100}
                      value={progressGoal.progress}
                      onChange={e => setProgressGoal({ ...progressGoal, progress: Math.max(0, Math.min(100, Number(e.target.value))) })}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setProgressGoal(null)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={() => handleSaveProgress(progressGoal.progress)} className="flex-1">
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Log Time Modal */}
          {logTimeGoal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle>Log Time</CardTitle>
                  <CardDescription>Log time spent on this goal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="log-time">Minutes Spent</Label>
                    <Input
                      id="log-time"
                      type="number"
                      min={1}
                      value={loggedTime}
                      onChange={e => setLoggedTime(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setLogTimeGoal(null)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveLogTime} className="flex-1" disabled={loggedTime <= 0}>
                      Save
                    </Button>
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

export default Goals;
