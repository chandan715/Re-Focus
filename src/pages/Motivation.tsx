import React, { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

type Nudge = {
  id: number;
  nudge_type: string;
  title: string;
  content: string;
  read: boolean;
  created_at: string;
};

type MotivationalQuote = {
  id: number;
  text: string;
  author: string;
  category: string;
  created_at: string;
};

const Motivation: React.FC = () => {
  const token = useMemo(() => localStorage.getItem("accessToken"), []);
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marking, setMarking] = useState<number | null>(null);
  
  // Motivational Quotes state
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Fetch random quote
  const fetchRandomQuote = async () => {
    if (!token) return;
    setQuoteLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/api/quotes/random/`);
      if (res.ok) {
        const quote = await res.json();
        setCurrentQuote(quote);
      }
    } catch (e) {
      console.error("Failed to fetch quote:", e);
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Please log in to view motivational content.");
      setLoading(false);
      return;
    }
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await authFetch(`${API_BASE}/api/motivational-nudges/`);
        if (!res.ok) {
          if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
          throw new Error(await res.text());
        }
        const json = await res.json();
        const results: Nudge[] = Array.isArray(json) ? json : (json?.results ?? []);
        setNudges(results);
      } catch (e: any) {
        setError(e.message || "Failed to load nudges");
      } finally {
        setLoading(false);
      }
    };
    run();
    fetchRandomQuote();
  }, [token]);
    useEffect(() => {
      const interval = setInterval(() => {
        fetchRandomQuote();
      }, 3600000); 
      
      return () => clearInterval(interval);
    }, [token]);

  const markRead = async (id: number) => {
    if (!token) return;
    setMarking(id);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/api/motivational-nudges/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
        throw new Error(await res.text());
      }
      // Backend list only returns unread items, so remove it from list after marking read
      setNudges((prev) => prev.filter((n) => n.id !== id));
    } catch (e: any) {
      setError(e.message || "Failed to update nudge");
    } finally {
      setMarking(null);
    }
  };

  return (
    <div className="container py-20 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Motivational Boost</h1>
      
      {/* Motivational Quote Card */}
      <Card className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Daily Inspiration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quoteLoading ? (
            <p className="text-muted-foreground">Loading quote...</p>
          ) : currentQuote ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Quote className="h-8 w-8 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg italic text-gray-700 leading-relaxed">
                    "{currentQuote.text}"
                  </p>
                  <p className="text-sm text-purple-600 font-medium mt-3">
                    — {currentQuote.author}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {currentQuote.category}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRandomQuote}
                disabled={quoteLoading}
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Quote
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No quotes available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motivational Nudges Section */}
      <h2 className="text-2xl font-semibold mb-4">Motivational Nudges</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {nudges.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No nudges right now. Come back later!</p>
              </CardContent>
            </Card>
          )}
          {nudges.map((n) => (
            <Card key={n.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium capitalize">
                    {n.nudge_type.replace(/_/g, " ")} — {n.title}
                  </div>
                  {!n.read ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markRead(n.id)}
                      disabled={marking === n.id}
                    >
                      {marking === n.id ? "Marking..." : "Mark as read"}
                    </Button>
                  ) : (
                    <span className="text-xs text-green-600">Read</span>
                  )}
                </div>
                <div className="mt-2 text-sm">{n.content}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Motivation;