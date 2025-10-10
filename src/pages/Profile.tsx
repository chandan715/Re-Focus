import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/authFetch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Camera,
  Clock,
  Activity,
  Target,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

interface ProfileData {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
  };
  bio?: string;
  avatar?: string;
  total_tasks?: number;
  completed_tasks?: number;
  active_streak?: number;
}

const Profile: React.FC = () => {
  const { accessToken, logout } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    bio: "",
  });

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await authFetch(`${API_BASE}/api/profile/`);
        if (res.status === 401) {
          // Token refresh failed, logout user
          toast.error("Session expired. Please login again.");
          logout();
          return;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed: ${res.status}`);
        }
        const json = await res.json();
        setData(json);
        setEditForm({
          first_name: json.user.first_name || "",
          last_name: json.user.last_name || "",
          bio: json.bio || "",
        });
      } catch (e: any) {
        setError(e.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [accessToken, logout]);

  const handleSaveProfile = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      // Refetch the profile to get the updated data
      const refetchRes = await authFetch(`${API_BASE}/api/profile/`);

      if (refetchRes.ok) {
        const updatedData = await refetchRes.json();
        setData(updatedData);
      }
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
    }
  };

  const handleCancelEdit = () => {
    if (data) {
      setEditForm({
        first_name: data.user.first_name || "",
        last_name: data.user.last_name || "",
        bio: data.bio || "",
      });
    }
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await authFetch(`${API_BASE}/api/profile/avatar/`, {
        method: 'POST',
        body: formData,
      });

      if (res.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to upload avatar');
      }

      // Refetch profile to get updated avatar
      const refetchRes = await authFetch(`${API_BASE}/api/profile/`);
      if (refetchRes.ok) {
        const updatedData = await refetchRes.json();
        setData(updatedData);
        toast.success('Profile picture updated successfully!');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to upload profile picture');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getInitials = (username: string, firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };


  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return <div className="container py-8">No profile data.</div>;

  const { user } = data;
  const fullName = user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}` 
    : user.username;

  return (
    <div className="container py-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={data.avatar} alt={fullName} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(user.username, user.first_name, user.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    disabled={uploadingAvatar}
                    type="button"
                  >
                    {uploadingAvatar ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="text-center space-y-1">
                  <h2 className="text-xl font-semibold">{fullName}</h2>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>

                {data.bio && !isEditing && (
                  <p className="text-sm text-center text-muted-foreground px-4">
                    {data.bio}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Tasks</span>
                </div>
                <span className="font-semibold">{data.total_tasks || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Completed</span>
                </div>
                <span className="font-semibold text-green-600">{data.completed_tasks || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Active Streak</span>
                </div>
                <span className="font-semibold text-orange-600">{data.active_streak || 0} days</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details & Settings */}
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          value={editForm.first_name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, first_name: e.target.value })
                          }
                        />
                      ) : (
                        <div className="flex items-center space-x-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{user.first_name || "-"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          value={editForm.last_name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, last_name: e.target.value })
                          }
                        />
                      ) : (
                        <div className="flex items-center space-x-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{user.last_name || "-"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Username</Label>
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{user.username}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email || "-"}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(user.date_joined).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={editForm.bio}
                        onChange={(e) =>
                          setEditForm({ ...editForm, bio: e.target.value })
                        }
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {data.bio || "No bio added yet."}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Account Created</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(user.date_joined).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {data.completed_tasks && data.completed_tasks > 0 && (
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                          <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Tasks Completed</p>
                          <p className="text-xs text-muted-foreground">
                            You've completed {data.completed_tasks} task{data.completed_tasks !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    )}

                    {(!data.completed_tasks || data.completed_tasks === 0) && (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">No recent activity to display</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
