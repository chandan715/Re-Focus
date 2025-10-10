import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InteractiveGlow from "@/components/visual/InteractiveGlow";
import heroImage from "@/assets/hero-refocus.jpg";
import { Link } from "react-router-dom";
import { 
  Target, 
  Clock, 
  Brain, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Play,
  BookOpen,
  Heart,
  Star
} from "lucide-react";
import { Textarea } from "@/components/ui";

const Index = () => {
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Re-Focus',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    description: 'Stay focused, track goals, and build habits with Pomodoro, mood check-ins, and motivational nudges.',
  };

  const features = [
    {
      title: "Smart Goal Tracking",
      description: "Set, categorize, and visualize your progress with intelligent goal management",
      icon: <Target />,
      link: "/goals"
    },
    {
      title: "Pomodoro Focus",
      description: "Customizable focus sessions with gentle cues and progress tracking",
      icon: <Clock />,
      link: "/focus"
    },
    {
      title: "Mood Intelligence",
      description: "Track your emotional state and get personalized productivity insights",
      icon: <TrendingUp />,
      link: "/mood"
    },
    {
      title: "Progress Analytics",
      description: "Visualize your productivity trends and study streaks",
      icon: <BarChart3 />,
      link: "/analytics"
    },
    {
      title: "Motivational Boost",
      description: "Get daily inspiration and productivity tips",
      icon: <Zap />,
      link: "/motivation"
    }
  ];

  const stats = [
    { number: "25min", label: "Focus Sessions", icon: Clock },
    { number: "7+", label: "Goal Categories", icon: Target },
    { number: "24/7", label: "Mood Tracking", icon: Heart },
    { number: "100%", label: "Free to Use", icon: Star }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Set Your Goals",
      description: "Define what you want to achieve and break it down into manageable tasks",
      icon: Target
    },
    {
      step: "02",
      title: "Start Focusing",
      description: "Use our Pomodoro timer to maintain deep focus and avoid distractions",
      icon: Play
    },
    {
      step: "03",
      title: "Track Progress",
      description: "Monitor your daily progress, mood, and build consistent study habits",
      icon: BarChart3
    },
    {
      step: "04",
      title: "Stay Motivated",
      description: "Get personalized insights and motivational content to keep going",
      icon: TrendingUp
    }
  ];

  return (
    <>
      <Helmet>
        <title>Re-Focus — Motivation & Productivity for Students</title>
        <meta name="description" content="A holistic focus companion: Pomodoro, goal tracking, mood check-ins, and motivation for students and self‑learners." />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify(ldJson)}</script>
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <InteractiveGlow />
          <div className="container grid items-center gap-10 py-20 md:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-4">
                {/* <Badge variant="secondary" className="px-4 py-2 text-sm">
                  🚀 New Features Available
                </Badge> */}
                <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                  Re-Focus
                  <span className="block text-4xl md:text-5xl lg:text-6xl text-muted-foreground font-normal">
                    Your Productivity
                  </span>
                  <span className="block text-4xl md:text-5xl lg:text-6xl text-primary">
                    Companion
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-prose leading-relaxed">
                  Transform your study habits with intelligent focus sessions, goal tracking, and mood insights. 
                  Built specifically for students who want to achieve more with less stress.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/focus">
                  <Button size="lg" className="px-8 py-6 text-lg">
                    <Play className="mr-2 h-5 w-5" />
                    Start Focusing Now
                  </Button>
                </Link>
                <Link to="/goals">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                    <Target className="mr-2 h-5 w-5" />
                    Set Your Goals
                  </Button>
                </Link>
              </div>

              {/* <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Free Forever
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  No Ads
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Privacy First
                </div>
              </div> */}
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Re-Focus hero illustration showing calm, focused study vibe" 
                loading="lazy" 
                className="w-full rounded-2xl border shadow-2xl" 
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: 'var(--shadow-glow)' }} aria-hidden />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t bg-gradient-subtle">
          <div className="container py-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t">
          <div className="container py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Re-Focus combines proven productivity techniques with modern technology to help you build better study habits.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <Card key={idx}>
                  <CardContent>
                    <div>{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    <Link to={feature.link}>
                      <Button variant="link" className="flex items-center">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-t bg-gradient-subtle">
          <div className="container py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                How Re-Focus Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get started in minutes and see results in days. Our simple 4-step process makes productivity effortless.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                      {step.step}
                    </div>
                    <div className="p-3 rounded-full bg-primary/10 inline-block mb-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-16 h-0.5 bg-border transform translate-x-8"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t">
          <div className="container py-20">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                Ready to Transform Your Productivity?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of students who have already improved their focus, achieved their goals, and built better study habits with Re-Focus.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/focus">
                  <Button size="lg" className="px-8 py-6 text-lg">
                    <Play className="mr-2 h-5 w-5" />
                    Start Your First Session
                  </Button>
              </Link>
                <Link to="/goals">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                    <Target className="mr-2 h-5 w-5" />
                    Set Your Goals
                  </Button>
              </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Index;
