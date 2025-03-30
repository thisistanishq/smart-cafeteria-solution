
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet as WalletIcon, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  CreditCard,
  RefreshCcw,
  Clock,
  Receipt,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { RazorpayButton } from '@/components/RazorpayButton';
import { useApp } from '@/context/AppContext';
import { Transaction } from '@/types';

const Wallet = () => {
  const { user, isAuthenticated, isLoading, addToWallet, transactions } = useApp();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState<number>(100);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  // Get transactions for the current user
  const userTransactions = user
    ? transactions.filter(t => t.userId === user.id)
    : [];
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAmount(value);
    }
  };
  
  const handleRazorpaySuccess = async (paymentId: string) => {
    await addToWallet(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  const getTransactionIcon = (transaction: Transaction) => {
    const type = transaction.type;
    
    if (type === 'deposit') {
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else if (type === 'withdrawal') {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Receipt className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getAmountColor = (transaction: Transaction) => {
    const type = transaction.type;
    
    if (type === 'deposit') {
      return 'text-green-600';
    } else {
      return 'text-red-600';
    }
  };
  
  const getFormattedAmount = (transaction: Transaction) => {
    const type = transaction.type;
    const amount = transaction.amount;
    
    if (type === 'deposit') {
      return `+₹${amount}`;
    } else {
      return `-₹${amount}`;
    }
  };
  
  if (isLoading || !isAuthenticated) {
    return <Loader text="Loading wallet details..." />;
  }
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="mb-6">Please log in to access your wallet.</p>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-turmeric-500 hover:bg-turmeric-600"
            >
              Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow py-10">
        <div className="cafeteria-container">
          <h1 className="text-3xl font-bold mb-8">Wallet</h1>
          
          <Tabs defaultValue="overview" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger 
                value="overview"
                className="flex items-center gap-2"
              >
                <WalletIcon className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="add-money"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Money
              </TabsTrigger>
              <TabsTrigger 
                value="transactions"
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Transactions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Wallet Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-4 rounded-full bg-turmeric-100">
                            <WalletIcon className="h-8 w-8 text-turmeric-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Available Balance</p>
                            <p className="text-3xl font-bold">₹{user.walletBalance}</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => setActiveTab('add-money')}
                          className="bg-turmeric-500 hover:bg-turmeric-600"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Money
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/menu')}
                      >
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Place an Order
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/orders')}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Check Order Status
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Recent Transactions */}
                <div className="md:col-span-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Recent Transactions</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setActiveTab('transactions')}
                      >
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {userTransactions.length > 0 ? (
                        <div className="space-y-4">
                          {userTransactions.slice(0, 5).map((transaction) => (
                            <div 
                              key={transaction.id}
                              className="flex items-center justify-between py-2 border-b last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-muted">
                                  {getTransactionIcon(transaction)}
                                </div>
                                <div>
                                  <p className="font-medium">{transaction.description}</p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CalendarDays className="h-3 w-3" />
                                    <span>{formatDate(transaction.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-medium ${getAmountColor(transaction)}`}>
                                  {getFormattedAmount(transaction)}
                                </p>
                                <Badge 
                                  variant="outline" 
                                  className="capitalize text-xs"
                                >
                                  {transaction.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No transactions yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="add-money">
              <div className="max-w-md mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Money to Wallet</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Enter Amount (₹)</label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={amount}
                          onChange={handleAmountChange}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {[100, 200, 500, 1000].map((value) => (
                        <Button
                          key={value}
                          variant="outline"
                          className="flex-1"
                          onClick={() => setAmount(value)}
                        >
                          ₹{value}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-sm font-medium mb-2">Payment Method</h3>
                      <div className="p-3 border rounded-md flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Credit/Debit Card or UPI</p>
                          <p className="text-sm text-muted-foreground">
                            Pay securely via Razorpay
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <RazorpayButton
                      amount={amount}
                      customerName={user.name}
                      customerEmail={user.email}
                      onSuccess={handleRazorpaySuccess}
                    />
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {userTransactions.length > 0 ? (
                    <div className="space-y-4">
                      {userTransactions.map((transaction) => (
                        <div 
                          key={transaction.id}
                          className="flex items-center justify-between py-3 border-b last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-muted">
                              {getTransactionIcon(transaction)}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{formatDate(transaction.createdAt)}</span>
                                <span>•</span>
                                <Badge 
                                  variant="outline" 
                                  className="capitalize text-xs"
                                >
                                  {transaction.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${getAmountColor(transaction)}`}>
                              {getFormattedAmount(transaction)}
                            </p>
                            <Badge 
                              variant={transaction.status === 'completed' ? 'outline' : 'destructive'} 
                              className="capitalize text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <RefreshCcw className="mx-auto h-10 w-10 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                      <p className="text-gray-500 mb-4">
                        You haven't made any transactions yet.
                      </p>
                      <Button 
                        onClick={() => setActiveTab('add-money')}
                        className="bg-turmeric-500 hover:bg-turmeric-600"
                      >
                        Add Money to Wallet
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wallet;
