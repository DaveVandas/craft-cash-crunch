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
import { Users, DollarSign, Link, Plus, Copy, Check, RefreshCw, Send, QrCode, Edit2, FileText, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { AffiliateShareCard } from '@/components/affiliate/AffiliateShareCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  // Tax compliance fields
  legal_name: string | null;
  street_address: string | null;
  city: string | null;
  state_province: string | null;
  postal_code: string | null;
  country: string | null;
  tax_id_collected: boolean | null;
  w9_submitted_at: string | null;
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
  const [shareCardDialogOpen, setShareCardDialogOpen] = useState(false);
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

  // Form state for editing commission
  const [editingCommission, setEditingCommission] = useState<string | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<string>('1.00');

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

  const handleUpdateCommission = async (affiliateId: string) => {
    try {
      const rate = parseFloat(newCommissionRate);
      if (isNaN(rate) || rate <= 0) {
        toast.error('Please enter a valid commission rate');
        return;
      }

      const { error } = await supabase
        .from('affiliates')
        .update({
          commission_rate: rate,
          is_vip: rate > 1,
        })
        .eq('id', affiliateId);

      if (error) throw error;

      toast.success(`Commission updated to $${rate.toFixed(2)}! Affiliate will be notified.`);
      setEditingCommission(null);
      fetchData();
    } catch (error) {
      console.error('Error updating commission:', error);
      toast.error('Failed to update commission');
    }
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
          <TabsTrigger value="tax" className="gap-1">
            <FileText className="h-3 w-3" />
            Tax/W-9
          </TabsTrigger>
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
                    <TableCell>
                      <Popover 
                        open={editingCommission === affiliate.id} 
                        onOpenChange={(open) => {
                          if (open) {
                            setEditingCommission(affiliate.id);
                            setNewCommissionRate(affiliate.commission_rate.toFixed(2));
                          } else {
                            setEditingCommission(null);
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="font-mono text-green-400 hover:text-green-300 gap-1 px-2"
                          >
                            ${affiliate.commission_rate.toFixed(2)}
                            <Edit2 className="h-3 w-3 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3" align="start">
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Commission Rate</Label>
                              <Select
                                value={newCommissionRate}
                                onValueChange={setNewCommissionRate}
                              >
                                <SelectTrigger className="h-8">
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
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setEditingCommission(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleUpdateCommission(affiliate.id)}
                              >
                                Save
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Affiliate will be notified of this change.
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
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
                          title="Copy link"
                        >
                          {copiedCode === affiliate.affiliate_code ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedAffiliate(affiliate);
                            setShareCardDialogOpen(true);
                          }}
                          title="Share card with QR"
                        >
                          <QrCode className="h-4 w-4" />
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

        {/* Tax Compliance Tab */}
        <TabsContent value="tax">
          <div className="space-y-6">
            {/* Tax Compliance Alert Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-red-500/20 to-red-500/5 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Need W-9 (≥$600)</p>
                      <p className="text-2xl font-bold text-red-400">
                        {affiliates.filter(a => a.total_earnings >= 600 && !a.tax_id_collected).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-yellow-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Approaching $600</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {affiliates.filter(a => a.total_earnings >= 500 && a.total_earnings < 600).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">W-9 Collected</p>
                      <p className="text-2xl font-bold text-green-400">
                        {affiliates.filter(a => a.tax_id_collected).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info Card */}
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <FileText className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-400">1099-NEC Tax Reporting</p>
                    <p className="text-muted-foreground mt-1">
                      The IRS requires you to issue a 1099-NEC to any affiliate who earns <strong>$600 or more</strong> in a calendar year.
                      You must collect a W-9 form from these affiliates to obtain their legal name, address, and SSN/EIN for tax reporting.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affiliates Needing W-9 */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  Action Required: W-9 Collection
                </CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Legal Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Total Earnings</TableHead>
                    <TableHead>W-9 Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates
                    .filter(a => a.total_earnings >= 500 || a.tax_id_collected)
                    .sort((a, b) => b.total_earnings - a.total_earnings)
                    .map(affiliate => {
                      const needsW9 = affiliate.total_earnings >= 600 && !affiliate.tax_id_collected;
                      const approaching = affiliate.total_earnings >= 500 && affiliate.total_earnings < 600;
                      const hasAddress = affiliate.street_address && affiliate.city && affiliate.state_province && affiliate.postal_code;
                      
                      return (
                        <TableRow key={affiliate.id} className={needsW9 ? 'bg-red-500/5' : ''}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{affiliate.display_name}</p>
                              <p className="text-xs text-muted-foreground">{affiliate.email}</p>
                              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{affiliate.affiliate_code}</code>
                            </div>
                          </TableCell>
                          <TableCell>
                            {affiliate.legal_name ? (
                              <span>{affiliate.legal_name}</span>
                            ) : (
                              <span className="text-muted-foreground italic">Not provided</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {hasAddress ? (
                              <div className="text-xs">
                                <p>{affiliate.street_address}</p>
                                <p>{affiliate.city}, {affiliate.state_province} {affiliate.postal_code}</p>
                                <p>{affiliate.country || 'US'}</p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Missing
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={`font-mono font-bold ${
                              affiliate.total_earnings >= 600 ? 'text-red-400' :
                              affiliate.total_earnings >= 500 ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              ${affiliate.total_earnings.toFixed(2)}
                            </span>
                            {needsW9 && (
                              <Badge className="ml-2 bg-red-500/20 text-red-400 text-xs">1099 Required</Badge>
                            )}
                            {approaching && (
                              <Badge className="ml-2 bg-yellow-500/20 text-yellow-400 text-xs">Near Threshold</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {affiliate.tax_id_collected ? (
                              <Badge className="bg-green-500/20 text-green-400 gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Collected
                              </Badge>
                            ) : (
                              <Badge className="bg-muted text-muted-foreground">Not Collected</Badge>
                            )}
                            {affiliate.w9_submitted_at && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(affiliate.w9_submitted_at)}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant={affiliate.tax_id_collected ? 'ghost' : 'default'}
                              onClick={async () => {
                                try {
                                  const { error } = await supabase
                                    .from('affiliates')
                                    .update({
                                      tax_id_collected: !affiliate.tax_id_collected,
                                      w9_submitted_at: !affiliate.tax_id_collected ? new Date().toISOString() : null,
                                    })
                                    .eq('id', affiliate.id);
                                  
                                  if (error) throw error;
                                  toast.success(
                                    affiliate.tax_id_collected 
                                      ? 'W-9 status cleared' 
                                      : 'W-9 marked as collected!'
                                  );
                                  fetchData();
                                } catch (err) {
                                  console.error('Error updating W-9 status:', err);
                                  toast.error('Failed to update W-9 status');
                                }
                              }}
                              className="gap-1"
                            >
                              {affiliate.tax_id_collected ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  W-9 ✓
                                </>
                              ) : (
                                <>
                                  <FileText className="h-3 w-3" />
                                  Mark W-9 Received
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {affiliates.filter(a => a.total_earnings >= 500 || a.tax_id_collected).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No affiliates approaching the $600 threshold yet.</p>
                        <p className="text-xs mt-1">Affiliates will appear here when they earn $500+</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
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

      {/* Share Card Dialog */}
      <Dialog open={shareCardDialogOpen} onOpenChange={setShareCardDialogOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Affiliate Share Card
            </DialogTitle>
          </DialogHeader>
          {selectedAffiliate && (
            <AffiliateShareCard
              affiliateCode={selectedAffiliate.affiliate_code}
              displayName={selectedAffiliate.display_name}
              commissionRate={selectedAffiliate.commission_rate}
              isVip={selectedAffiliate.is_vip}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
