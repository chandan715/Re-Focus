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
  const [goals, setGoals] = useState<Goal[]>(() => {
    const stored = localStorage.getItem("goals");
    return stored ? JSON.parse(stored) : initialGoals;
  });
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

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  // Delete handler
  const handleDelete = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  // Add goal handler
  const handleAddGoal = () => {
    if (newGoal.title.trim()) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        priority: newGoal.priority,
        status: 'not_started',
        targetDate: newGoal.targetDate,
        progress: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setGoals([...goals, goal]);
      setNewGoal({
        title: '',
        description: '',
        category: 'Programming',
        priority: 'medium',
        targetDate: new Date().toISOString().split('T')[0]
      });
      setShowAddGoal(false);
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditGoal(goal);
  };

  const handleUpdateGoal = () => {
    if (editGoal) {
      setGoals(goals.map(g => g.id === editGoal.id ? editGoal : g));
      setEditGoal(null);
    }
  };

  const handleUpdateProgress = (goal: Goal) => {
    setProgressGoal(goal);
  };

  const handleSaveProgress = (progress: number) => {
    if (progressGoal) {
      setGoals(goals.map(g => g.id === progressGoal.id ? { ...g, progress, status: progress === 100 ? 'completed' : g.status } : g));
      setProgressGoal(null);
    }
  };

  const handleLogTime = (goal: Goal) => {
    setLogTimeGoal(goal);
    setLoggedTime(0);
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

          {/* Goals Grid */}
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredGoals.length === 0 && (
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
