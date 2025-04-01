
import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader, Search, UserPlus, Trash2, Edit, ShieldAlert, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { profileService } from '@/services/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'staff' | 'cafeteria_staff' | 'admin';
  wallet_balance: number;
  created_at: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();
  
  // Form data for adding new staff
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cafeteria_staff' as const
  });
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await profileService.getAllProfiles();
      
      if (error) throw error;
      
      setUsers(data as User[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleAddStaff = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // First create the user
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            name: newUser.name,
            role: newUser.role
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Staff Added',
        description: `${newUser.name} has been added as ${newUser.role}`,
      });
      
      setShowAddDialog(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'cafeteria_staff'
      });
      
      // Refresh user list
      fetchUsers();
      
    } catch (error: any) {
      console.error('Error adding staff:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add staff',
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateRole = async (userId: string, newRole: 'student' | 'staff' | 'cafeteria_staff' | 'admin') => {
    try {
      const { data, error } = await profileService.updateProfile(userId, { role: newRole });
      
      if (error) throw error;
      
      toast({
        title: 'Role Updated',
        description: `User role has been updated to ${newRole}`,
      });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update role',
        variant: 'destructive',
      });
    }
  };
  
  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin':
        return 'bg-red-600 hover:bg-red-700';
      case 'cafeteria_staff':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'staff':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="border-none shadow-md bg-zinc-900 text-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-white">User Management</CardTitle>
            <CardDescription className="text-zinc-400">
              Manage all users and their permissions
            </CardDescription>
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-zinc-700 hover:bg-zinc-600">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-800 text-white border-zinc-700">
              <DialogHeader>
                <DialogTitle>Add New Staff</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Create a new cafeteria staff account.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    className="bg-zinc-700 border-zinc-600"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-zinc-700 border-zinc-600"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="bg-zinc-700 border-zinc-600"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(value: any) => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger className="bg-zinc-700 border-zinc-600">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="cafeteria_staff">Cafeteria Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="bg-zinc-700 hover:bg-zinc-600 border-zinc-600">
                  Cancel
                </Button>
                <Button onClick={handleAddStaff} className="bg-blue-600 hover:bg-blue-700">
                  <Check className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search users..."
              className="pl-10 bg-zinc-800 border-zinc-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="rounded-md border border-zinc-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-800">
                <TableRow className="hover:bg-zinc-800/80">
                  <TableHead className="text-zinc-400">Name</TableHead>
                  <TableHead className="text-zinc-400">Email</TableHead>
                  <TableHead className="text-zinc-400">Role</TableHead>
                  <TableHead className="text-zinc-400">Wallet Balance</TableHead>
                  <TableHead className="text-zinc-400">Joined</TableHead>
                  <TableHead className="text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-zinc-400">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-b border-zinc-700 hover:bg-zinc-800/80">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={`${getRoleBadgeColor(user.role)}`}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{user.wallet_balance.toFixed(2)}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Select 
                            defaultValue={user.role}
                            onValueChange={(value: any) => handleUpdateRole(user.id, value)}
                          >
                            <SelectTrigger className="h-8 w-32 bg-zinc-700 border-zinc-600">
                              <SelectValue placeholder="Change role" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="staff">Staff</SelectItem>
                              <SelectItem value="cafeteria_staff">Cafeteria Staff</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button size="icon" variant="destructive" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
