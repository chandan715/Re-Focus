import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Brain, 
  Heart, 
  Zap, 
  Calendar,
  BarChart3,
  Activity,
  Award,
  Lightbulb,
  ArrowRight,
  Play,
  CheckCircle,
  Coffee,
  BookOpen,
  Exercise,
  Music,
  Sun,
  Moon
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalFocusTime: number;
  completedSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalGoals: number;
  completedGoals: number;
  averageMood: number;
  productivityScore: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalFocusTime: 1240, // minutes
    completedSessions: 28,
    currentStreak: 5,
    longestStreak: 12,
    totalGoals: 8,
    completedGoals: 3,
    averageMood: 7.5,
    productivityScore: 78
  });

  const [recentActivity, setRecentActivity] = useState([
    { type: 'focus', title: 'Completed Python Study Session', time: '2 hours ago', duration: '25 min' },
    { type: 'goal', title: 'Achieved: Read 3 Books', time: '1 day ago', progress: '100%' },
    { type: 'mood', title: 'Logged: Excellent Mood', time: '3 hours ago', score: '9/10' },
    { type: 'break', title: 'Took Short Break', time: '4 hours ago', duration: '5 min' }
  ]);

  const [weeklyData] = useState([
    { day: 'Mon', focus: 120, goals: 2, mood: 8 },
    { day: 'Tue', focus: 90, goals: 1, mood: 7 },
    { day: 'Wed', focus: 150, goals: 3, mood: 9 },
    { day: 'Thu', focus: 80, goals: 1, mood: 6 },
    { day: 'Fri', focus: 200, goals: 4, mood: 8 },
    { day: 'Sat', focus: 60, goals: 1, mood: 7 },
    { day: 'Sun', focus: 100, goals: 2, mood: 8 }
  ]);

  const [insights] = useState([
    {
      type: 'positive',
      title: 'You\'re on fire this week!',
      description: 'Your focus time is 25% higher than last week. Keep up the momentum!',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      type: 'tip',
      title: 'Time for a break?',
      description: 'You\'ve been focusing for 2 hours straight. Consider taking a short break.',
      icon: Coffee,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      type: 'achievement',
      title: 'Streak milestone!',
      description: 'You\'re 2 days away from beating your longest streak of 12 days.',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProductivityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProductivityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Re-Focus</title>
        <meta name="description" content="Your productivity dashboard with insights and progress tracking" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Welcome back! Here's your productivity overview and insights
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatTime(stats.totalFocusTime)}</div>
                    <div className="text-sm text-muted-foreground">Total Focus Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-green-100">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.completedGoals}/{stats.totalGoals}</div>
                    <div className="text-sm text-muted-foreground">Goals Completed</div>
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
                    <div className="text-2xl font-bold">{stats.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-purple-100">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.averageMood}/10</div>
                    <div className="text-sm text-muted-foreground">Average Mood</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Charts and Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Productivity Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Productivity Score
                  </CardTitle>
                  <CardDescription>
                    Your overall productivity rating based on focus time, goals, and mood
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className={`text-6xl font-bold ${getProductivityColor(stats.productivityScore)} mb-2`}>
                      {stats.productivityScore}
                    </div>
                    <div className="text-xl text-muted-foreground mb-4">
                      {getProductivityLabel(stats.productivityScore)}
                    </div>
                    <Progress value={stats.productivityScore} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{stats.completedSessions}</div>
                      <div className="text-sm text-muted-foreground">Sessions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.completedGoals}</div>
                      <div className="text-sm text-muted-foreground">Goals</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.currentStreak}</div>
                      <div className="text-sm text-muted-foreground">Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weekly Overview
                  </CardTitle>
                  <CardDescription>
                    Your productivity patterns over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                      {weeklyData.map((day, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm font-medium mb-2">{day.day}</div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Focus</div>
                            <div className="h-20 bg-muted rounded flex items-end justify-center p-1">
                              <div 
                                className="bg-primary rounded w-full transition-all"
                                style={{ height: `${(day.focus / 200) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-xs font-medium">{formatTime(day.focus)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest productivity actions and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'focus' ? 'bg-blue-100' :
                          activity.type === 'goal' ? 'bg-green-100' :
                          activity.type === 'mood' ? 'bg-purple-100' :
                          'bg-orange-100'
                        }`}>
                          {activity.type === 'focus' && <Play className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'goal' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {activity.type === 'mood' && <Heart className="h-4 w-4 text-purple-600" />}
                          {activity.type === 'break' && <Coffee className="h-4 w-4 text-orange-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-muted-foreground">{activity.time}</div>
                        </div>
                        <Badge variant="secondary">
                          {activity.duration || activity.progress || activity.score}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Insights and Quick Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/focus">
                    <Button className="w-full justify-start" size="lg">
                      <Play className="mr-2 h-5 w-5" />
                      Start Focus Session
                    </Button>
                  </Link>
                  <Link to="/goals">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Target className="mr-2 h-5 w-5" />
                      Set New Goal
                    </Button>
                  </Link>
                  <Link to="/mood">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Heart className="mr-2 h-5 w-5" />
                      Log Mood
                    </Button>
                  </Link>
                  <Link to="/api-docs">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <BookOpen className="mr-2 h-5 w-5" />
                      API Documentation
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Smart Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className={`p-4 rounded-lg ${insight.bgColor}`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${insight.bgColor}`}>
                          <insight.icon className={`h-5 w-5 ${insight.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium mb-1">{insight.title}</div>
                          <div className="text-sm text-muted-foreground">{insight.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Streak Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Streak Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stats.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Longest Streak</span>
                      <span className="font-medium">{stats.longestStreak} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Next Milestone</span>
                      <span className="font-medium">{Math.ceil(stats.currentStreak / 5) * 5} days</span>
                    </div>
                  </div>
                  
                  <Progress value={(stats.currentStreak / stats.longestStreak) * 100} className="h-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
