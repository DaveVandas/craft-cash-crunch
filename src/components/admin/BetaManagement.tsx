import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  Users, Send, Copy, RefreshCw, Star, Clock, MessageSquare,
  CheckCircle, XCircle, AlertCircle, Loader2
} from 'lucide-react';

interface BetaInvite {
  id: string;
  invite_code: string;
  recipient_email: string | null;
  recipient_name: string | null;
  status: string;
  created_at: string;
  expires_at: string;
  claimed_at: string | null;
  claimedByEmail: string | null;
}

interface BetaFeedback {
  id: string;
  userEmail: string;
  overall_rating: number;
  experience_rating: number;
  what_liked: string | null;
  what_to_improve: string | null;
  additional_comments: string | null;
  created_at: string;
}

interface BetaSession {
  userId: string;
  userEmail: string;
  totalSeconds: number;
  totalMinutes: number;
}

interface BetaStats {
  totalInvites: number;
  pendingInvites: number;
  claimedInvites: number;
  expiredInvites: number;
  totalFeedback: number;
  avgOverallRating: string | number;
  avgExperienceRating: string | number;
}

const BetaManagement = () => {
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState<BetaInvite[]>([]);
  const [feedback, setFeedback] = useState<BetaFeedback[]>([]);
  const [sessions, setSessions] = useState<BetaSession[]>([]);
  const [stats, setStats] = useState<BetaStats | null>(null);

  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newInvite, setNewInvite] = useState<{ link: string; message: string; email?: string; name?: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-get-beta-data');
      
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setInvites(data.invites || []);
      setFeedback(data.feedback || []);
      setSessions(data.sessions || []);
      setStats(data.stats || null);
    } catch (err) {
      console.error('Error fetching beta data:', err);
      toast.error('Failed to load beta data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateInvite = async () => {
    setIsCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('beta-invite', {
        body: {
          action: 'create',
          recipientEmail: recipientEmail || undefined,
          recipientName: recipientName || undefined,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setNewInvite({
        link: data.inviteLink,
        message: data.inviteMessage,
        email: recipientEmail || undefined,
        name: recipientName || undefined,
      });

      setRecipientEmail('');
      setRecipientName('');
      toast.success('Invite created!');
      fetchData();
    } catch (err: any) {
      console.error('Error creating invite:', err);
      toast.error(err.message || 'Failed to create invite');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'claimed':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Claimed</Badge>;
      case 'expired':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`h-3 w-3 ${star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Invites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.totalInvites || 0}</p>
            <p className="text-xs text-muted-foreground">
              {stats?.claimedInvites || 0} claimed
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.totalFeedback || 0}</p>
            <p className="text-xs text-muted-foreground">submissions</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Avg Rating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.avgOverallRating || '-'}</p>
            <p className="text-xs text-muted-foreground">out of 5</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.pendingInvites || 0}</p>
            <p className="text-xs text-muted-foreground">unclaimed invites</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Invite Section */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Create Beta Invite
          </CardTitle>
          <CardDescription>
            Generate a unique invite link to send to a beta tester
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name (optional)</Label>
              <Input
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email (optional)</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <Button onClick={handleCreateInvite} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Generate Invite
              </>
            )}
          </Button>

          {newInvite && (
            <div className="mt-4 p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Shareable Message Preview</Label>
                <div className="bg-background rounded-lg border p-4 max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-foreground/90 font-sans">
                    {newInvite.message}
                  </pre>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {newInvite.email && (
                  <Button 
                    asChild
                    className="flex-1"
                  >
                    <a 
                      href={`mailto:${newInvite.email}?subject=${encodeURIComponent("You're Invited to Beta Test Wealth Perspective! 🎉")}&body=${encodeURIComponent(newInvite.message)}`}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Email to {newInvite.name || newInvite.email}
                    </a>
                  </Button>
                )}
                <Button 
                  variant={newInvite.email ? "outline" : "default"}
                  onClick={() => copyToClipboard(newInvite.message, 'Full message')}
                  className={newInvite.email ? "" : "flex-1"}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Full Message
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(newInvite.link, 'Link only')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Link Only
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                The full message includes the personal touch about valuing their feedback and how they can influence the product.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Invites, Feedback, Sessions */}
      <Tabs defaultValue="invites" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="invites">Invites</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="sessions">Time Spent</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <TabsContent value="invites">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Claimed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No invites yet
                    </TableCell>
                  </TableRow>
                ) : (
                  invites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-mono">{invite.invite_code}</TableCell>
                      <TableCell>
                        {invite.recipient_name || invite.recipient_email || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(invite.status)}</TableCell>
                      <TableCell className="text-sm">{formatDate(invite.created_at)}</TableCell>
                      <TableCell className="text-sm">{formatDate(invite.expires_at)}</TableCell>
                      <TableCell>{invite.claimedByEmail || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Overall</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>What Liked</TableHead>
                  <TableHead>Improvements</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedback.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No feedback yet
                    </TableCell>
                  </TableRow>
                ) : (
                  feedback.map((fb) => (
                    <TableRow key={fb.id}>
                      <TableCell className="text-sm">{fb.userEmail}</TableCell>
                      <TableCell>{renderStars(fb.overall_rating)}</TableCell>
                      <TableCell>{renderStars(fb.experience_rating)}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {fb.what_liked || '-'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {fb.what_to_improve || '-'}
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(fb.created_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Total Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                      No session data yet
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow key={session.userId}>
                      <TableCell>{session.userEmail}</TableCell>
                      <TableCell>
                        {session.totalMinutes >= 60 
                          ? `${Math.floor(session.totalMinutes / 60)}h ${session.totalMinutes % 60}m`
                          : `${session.totalMinutes}m`
                        }
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BetaManagement;