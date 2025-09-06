import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ExternalLink, Copy, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ApiEndpoint {
  [key: string]: string;
}

interface ApiResponse {
  message: string;
  description: string;
  endpoints: {
    users: ApiEndpoint;
    goals: ApiEndpoint;
    focus_sessions: ApiEndpoint;
    distractions: ApiEndpoint;
    emotional_checkins: ApiEndpoint;
    motivational_nudges: ApiEndpoint;
    study_streak: ApiEndpoint;
    dashboard: ApiEndpoint;
    admin: string;
    documentation: string;
  };
  usage: {
    authentication: string;
    headers: string;
    demo_user: string;
  };
}

const ApiDocs = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setApiData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch API data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, endpoint: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(endpoint);
      toast({
        title: "Copied!",
        description: "Endpoint copied to clipboard",
      });
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'get': return 'bg-green-100 text-green-800';
      case 'post': return 'bg-blue-100 text-blue-800';
      case 'put': return 'bg-yellow-100 text-yellow-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Error loading API documentation: {error}
            <br />
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={fetchApiData}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>No API data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {apiData.message}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {apiData.description}
          </p>
        </div>

        {/* Authentication Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Authentication & Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Authentication</h4>
                <p className="text-sm text-gray-600">{apiData.usage.authentication}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Headers</h4>
                <p className="text-sm text-gray-600">{apiData.usage.headers}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Demo User</h4>
                <p className="text-sm text-gray-600">{apiData.usage.demo_user}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="focus">Focus</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Endpoints for user registration and profile management</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.entries(apiData.endpoints.users).map(([action, endpoint]) => (
                  <div key={action} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                    <div>
                      <Badge className={getMethodColor(action === 'create' ? 'POST' : 'GET')}>
                        {action === 'create' ? 'POST' : 'GET'}
                      </Badge>
                      <span className="ml-3 font-mono text-sm">{endpoint}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(endpoint, `${action}_${endpoint}`)}
                    >
                      {copiedEndpoint === `${action}_${endpoint}` ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Goals Management</CardTitle>
                <CardDescription>Endpoints for creating, listing, and managing goals</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.entries(apiData.endpoints.goals).map(([action, endpoint]) => (
                  <div key={action} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                    <div>
                      <Badge className={getMethodColor(action === 'list_create' ? 'GET/POST' : 'GET')}>
                        {action === 'list_create' ? 'GET/POST' : 'GET'}
                      </Badge>
                      <span className="ml-3 font-mono text-sm">{endpoint}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(endpoint, `${action}_${endpoint}`)}
                    >
                      {copiedEndpoint === `${action}_${endpoint}` ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="focus" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Focus Sessions</CardTitle>
                <CardDescription>Endpoints for managing focus sessions and distractions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Focus Sessions</h4>
                    {Object.entries(apiData.endpoints.focus_sessions).map(([action, endpoint]) => (
                      <div key={action} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                        <div>
                          <Badge className={getMethodColor(action === 'list_create' ? 'GET/POST' : action === 'complete' ? 'POST' : 'GET')}>
                            {action === 'list_create' ? 'GET/POST' : action === 'complete' ? 'POST' : 'GET'}
                          </Badge>
                          <span className="ml-3 font-mono text-sm">{endpoint}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(endpoint, `${action}_${endpoint}`)}
                        >
                          {copiedEndpoint === `${action}_${endpoint}` ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Distractions</h4>
                    {Object.entries(apiData.endpoints.distractions).map(([action, endpoint]) => (
                      <div key={action} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                        <div>
                          <Badge className={getMethodColor(action === 'list_create' ? 'GET/POST' : 'GET')}>
                            {action === 'list_create' ? 'GET/POST' : 'GET'}
                          </Badge>
                          <span className="ml-3 font-mono text-sm">{endpoint}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(endpoint, `${action}_${endpoint}`)}
                        >
                          {copiedEndpoint === `${action}_${endpoint}` ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Emotional Check-ins</CardTitle>
                  <CardDescription>Track your mood and emotional state</CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.entries(apiData.endpoints.emotional_checkins).map(([action, endpoint]) => (
                    <div key={action} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                      <div>
                        <Badge className={getMethodColor(action === 'list_create' ? 'GET/POST' : 'GET')}>
                          {action === 'list_create' ? 'GET/POST' : 'GET'}
                        </Badge>
                        <span className="ml-3 font-mono text-sm">{endpoint}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(endpoint, `${action}_${endpoint}`)}
                      >
                        {copiedEndpoint === `${action}_${endpoint}` ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Motivational Nudges</CardTitle>
                  <CardDescription>Get inspired with motivational content</CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.entries(apiData.endpoints.motivational_nudges).map(([action, endpoint]) => (
                    <div key={action} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                      <div>
                        <Badge className={getMethodColor('GET')}>GET</Badge>
                        <span className="ml-3 font-mono text-sm">{endpoint}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(endpoint, `${action}_${endpoint}`)}
                      >
                        {copiedEndpoint === `${action}_${endpoint}` ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Streak</CardTitle>
                  <CardDescription>Track your study consistency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Badge className={getMethodColor('GET')}>GET</Badge>
                      <span className="ml-3 font-mono text-sm">{apiData.endpoints.study_streak.detail}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiData.endpoints.study_streak.detail, 'study_streak')}
                    >
                      {copiedEndpoint === 'study_streak' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Stats</CardTitle>
                  <CardDescription>Get overview of your productivity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Badge className={getMethodColor('GET')}>GET</Badge>
                      <span className="ml-3 font-mono text-sm">{apiData.endpoints.dashboard.stats}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiData.endpoints.dashboard.stats, 'dashboard_stats')}
                    >
                      {copiedEndpoint === 'dashboard_stats' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Resources */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Interface</CardTitle>
              <CardDescription>Access Django admin panel</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Admin Panel
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Detailed endpoint information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                {apiData.endpoints.documentation}
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="http://127.0.0.1:8000/api/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Raw API
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
