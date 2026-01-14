import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, DollarSign, Link, Plus, Copy, Check, RefreshCw, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Affiliate {
  id: string;
  affiliate_code: string;
  display_name: string;
  email: string;
  commission_rate: number;
  payout_method: string;
  payout_details: string | null;
  is_vip: boolean;
  total_referrals: number;
  total_earnings: number;
  pending_payout: number;
  status: string;
  created_at: string;
  approved_at: string | null;
}

interface Referral {
  id: string;
  affiliate_id: string;
  referred_email: string | null;
  commission_amount: number;
  status: string;
  created_at: string;
  converted_at: string | null;
  affiliates?: { display_name: string; affiliate_code: string };
}

interface Payout {
  id: string;
  affiliate_id: string;
  amount: number;
  payout_method: string;
  transaction_id: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  processed_at: string | null;
  affiliates?: { display_name: string };
}

const COMMISSION_OPTIONS = [
  { value: '1.00', label: '$1.00 (Standard)' },
  { value: '2.00', label: '$2.00 (VIP)' },
  { value: '2.50', label: '$2.50 (Close Friends)' },
];

export function AffiliateManagement() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  // Form state for creating VIP affiliate
  const [newAffiliate, setNewAffiliate] = useState({
    display_name: '',
    email: '',
    commission_rate: '1.00',
    payout_method: 'paypal',
    payout_details: '',
  });

  // Form state for processing payout
  const [payoutForm, setPayoutForm] = useState({
    amount: '',
    transaction_id: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch affiliates
      const { data: affiliatesData, error: affiliatesError } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });

      if (affiliatesError) throw affiliatesError;
      setAffiliates(affiliatesData || []);

      // Fetch referrals with affiliate info
      const { data: referralsData, error: referralsError } = await supabase
        .from('affiliate_referrals')
        .select('*, affiliates(display_name, affiliate_code)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (referralsError) throw referralsError;
      setReferrals(referralsData || []);

      // Fetch payouts with affiliate info
      const { data: payoutsData, error: payoutsError } = await supabase
        .from('affiliate_payouts')
        .select('*, affiliates(display_name)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (payoutsError) throw payoutsError;
      setPayouts(payoutsData || []);
    } catch (error) {
      console.error('Error fetching affiliate data:', error);
      toast.error('Failed to load affiliate data');
    } finally {
      setLoading(false);
    }
  };

  const generateAffiliateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'MOG-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateAffiliate = async () => {
    try {
      const affiliateCode = generateAffiliateCode();
      const commissionRate = parseFloat(newAffiliate.commission_rate);

      const { error } = await supabase.from('affiliates').insert({
        affiliate_code: affiliateCode,
        display_name: newAffiliate.display_name,
        email: newAffiliate.email,
        commission_rate: commissionRate,
        payout_method: newAffiliate.payout_method,
        payout_details: newAffiliate.payout_details || null,
        is_vip: commissionRate > 1,
        status: 'approved',
        approved_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success(`Created affiliate link: ${affiliateCode}`);
      setCreateDialogOpen(false);
      setNewAffiliate({
        display_name: '',
        email: '',
        commission_rate: '1.00',
        payout_method: 'paypal',
        payout_details: '',
      });
      fetchData();
    } catch (error) {
      console.error('Error creating affiliate:', error);
      toast.error('Failed to create affiliate');
    }
  };

  const handleApproveAffiliate = async (affiliateId: string) => {
    try {
      const { error } = await supabase
        .from('affiliates')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('id', affiliateId);

      if (error) throw error;
      toast.success('Affiliate approved!');
      fetchData();
    } catch (error) {
      console.error('Error approving affiliate:', error);
      toast.error('Failed to approve affiliate');
    }
  };

  const handleProcessPayout = async () => {
    if (!selectedAffiliate) return;

    try {
      const amount = parseFloat(payoutForm.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      // Create payout record
      const { error: payoutError } = await supabase.from('affiliate_payouts').insert({
        affiliate_id: selectedAffiliate.id,
        amount,
        payout_method: selectedAffiliate.payout_method,
        transaction_id: payoutForm.transaction_id || null,
        notes: payoutForm.notes || null,
        status: 'completed',
        processed_at: new Date().toISOString(),
      });

      if (payoutError) throw payoutError;

      // Update affiliate pending payout
      const { error: updateError } = await supabase
        .from('affiliates')
        .update({
          pending_payout: Math.max(0, selectedAffiliate.pending_payout - amount),
        })
        .eq('id', selectedAffiliate.id);

      if (updateError) throw updateError;

      toast.success(`Payout of $${amount.toFixed(2)} processed!`);
      setPayoutDialogOpen(false);
      setPayoutForm({ amount: '', transaction_id: '', notes: '' });
      setSelectedAffiliate(null);
      fetchData();
    } catch (error) {
      console.error('Error processing payout:', error);
      toast.error('Failed to process payout');
    }
  };

  const copyAffiliateLink = (code: string) => {
    const link = `${window.location.origin}?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success('Link copied to clipboard!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate stats
  const totalAffiliates = affiliates.length;
  const activeAffiliates = affiliates.filter(a => a.status === 'approved').length;
  const totalReferrals = affiliates.reduce((sum, a) => sum + a.total_referrals, 0);
  const totalPendingPayouts = affiliates.reduce((sum, a) => sum + a.pending_payout, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-card/50 border-border/50 animate-pulse">
              <CardContent className="p-4 h-20" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Affiliates</p>
                <p className="text-2xl font-bold">{totalAffiliates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Check className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeAffiliates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Link className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{totalReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Payouts</p>
                <p className="text-2xl font-bold">${totalPendingPayouts.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create VIP Affiliate Link
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create Custom Affiliate Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="John Doe"
                  value={newAffiliate.display_name}
                  onChange={e => setNewAffiliate({ ...newAffiliate, display_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={newAffiliate.email}
                  onChange={e => setNewAffiliate({ ...newAffiliate, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Commission Rate</Label>
                <Select
                  value={newAffiliate.commission_rate}
                  onValueChange={value => setNewAffiliate({ ...newAffiliate, commission_rate: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMISSION_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payout Method</Label>
                <Select
                  value={newAffiliate.payout_method}
                  onValueChange={value => setNewAffiliate({ ...newAffiliate, payout_method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="cashapp">Cash App</SelectItem>
                    <SelectItem value="venmo">Venmo</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payout Details (username/email)</Label>
                <Input
                  placeholder="@cashapptag or email"
                  value={newAffiliate.payout_details}
                  onChange={e => setNewAffiliate({ ...newAffiliate, payout_details: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateAffiliate} className="w-full">
                Create Affiliate Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={fetchData} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="affiliates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="affiliates">Affiliates ({affiliates.length})</TabsTrigger>
          <TabsTrigger value="referrals">Referrals ({referrals.length})</TabsTrigger>
          <TabsTrigger value="payouts">Payouts ({payouts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="affiliates">
          <Card className="bg-card/50 border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Referrals</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.map(affiliate => (
                  <TableRow key={affiliate.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{affiliate.display_name}</p>
                        <p className="text-xs text-muted-foreground">{affiliate.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded text-xs">
                        {affiliate.affiliate_code}
                      </code>
                      {affiliate.is_vip && (
                        <Badge className="ml-2 bg-yellow-500/20 text-yellow-400">VIP</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-green-400">
                      ${affiliate.commission_rate.toFixed(2)}
                    </TableCell>
                    <TableCell>{affiliate.total_referrals}</TableCell>
                    <TableCell className="font-mono">
                      ${affiliate.pending_payout.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyAffiliateLink(affiliate.affiliate_code)}
                        >
                          {copiedCode === affiliate.affiliate_code ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        {affiliate.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveAffiliate(affiliate.id)}
                          >
                            Approve
                          </Button>
                        )}
                        {affiliate.pending_payout > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAffiliate(affiliate);
                              setPayoutForm({
                                amount: affiliate.pending_payout.toString(),
                                transaction_id: '',
                                notes: '',
                              });
                              setPayoutDialogOpen(true);
                            }}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Pay
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {affiliates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No affiliates yet. Create your first VIP link above!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <Card className="bg-card/50 border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Referred</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map(referral => (
                  <TableRow key={referral.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(referral.created_at)}
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded text-xs">
                        {referral.affiliates?.affiliate_code}
                      </code>
                    </TableCell>
                    <TableCell>{referral.referred_email || 'Anonymous'}</TableCell>
                    <TableCell className="font-mono text-green-400">
                      ${referral.commission_amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                  </TableRow>
                ))}
                {referrals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No referrals yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card className="bg-card/50 border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map(payout => (
                  <TableRow key={payout.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(payout.created_at)}
                    </TableCell>
                    <TableCell>{payout.affiliates?.display_name}</TableCell>
                    <TableCell className="font-mono text-green-400">
                      ${payout.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="capitalize">{payout.payout_method}</TableCell>
                    <TableCell>
                      {payout.transaction_id ? (
                        <code className="text-xs">{payout.transaction_id}</code>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(payout.status)}</TableCell>
                  </TableRow>
                ))}
                {payouts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No payouts yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payout Dialog */}
      <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Process Payout for {selectedAffiliate?.display_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Payout to:</p>
              <p className="font-medium capitalize">
                {selectedAffiliate?.payout_method}: {selectedAffiliate?.payout_details || 'Not provided'}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={payoutForm.amount}
                onChange={e => setPayoutForm({ ...payoutForm, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Transaction ID (optional)</Label>
              <Input
                placeholder="PayPal/CashApp transaction ID"
                value={payoutForm.transaction_id}
                onChange={e => setPayoutForm({ ...payoutForm, transaction_id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Input
                placeholder="Any notes about this payout"
                value={payoutForm.notes}
                onChange={e => setPayoutForm({ ...payoutForm, notes: e.target.value })}
              />
            </div>
            <Button onClick={handleProcessPayout} className="w-full gap-2">
              <Send className="h-4 w-4" />
              Mark as Paid
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
