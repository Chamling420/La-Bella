'use client';

import { useAppStore, type UserRole, type User, type Service, type Product, type Appointment, type HomePageContent } from '@/lib/store';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Crown,
  Shield,
  Users,
  Plus,
  Pencil,
  Trash2,
  Scissors,
  ShoppingBag,
  CalendarDays,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Settings,
  Sparkles,
} from 'lucide-react';

// ==================== HELPERS ====================

function getRoleBadgeVariant(role: UserRole) {
  switch (role) {
    case 'superadmin':
      return 'destructive';
    case 'admin':
      return 'secondary';
    default:
      return 'default';
  }
}

function getRoleIcon(role: UserRole) {
  switch (role) {
    case 'superadmin':
      return <Crown className="h-3.5 w-3.5" />;
    case 'admin':
      return <Shield className="h-3.5 w-3.5" />;
    default:
      return <Users className="h-3.5 w-3.5" />;
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ==================== MAIN COMPONENT ====================

export default function SuperAdminPanel() {
  const {
    currentUser,
    users,
    services,
    products,
    appointments,
    changeUserRole,
    deleteUser,
    addService,
    updateService,
    deleteService,
    addProduct,
    updateProduct,
    deleteProduct,
    confirmAppointment,
    cancelAppointment,
    homeButtonText,
    setHomeButtonText,
    homePageContent,
    setHomePageContent,
  } = useAppStore();

  // ---- Access Control ----
  if (!currentUser || currentUser.role !== 'superadmin') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md border-destructive/30">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-destructive">
              Access Denied
            </h2>
            <p className="text-muted-foreground">
              Super Admin Only — You do not have permission to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 p-6 text-white sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Crown className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Super Admin Panel
            </h1>
            <p className="text-white/80">
              Full control over users, services, products &amp; appointments
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="w-full flex-wrap sm:w-auto sm:flex-nowrap">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Manage Users</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Scissors className="h-4 w-4" />
            <span className="hidden sm:inline">Manage Services</span>
            <span className="sm:hidden">Services</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Manage Products</span>
            <span className="sm:hidden">Products</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">All Appointments</span>
            <span className="sm:hidden">Appts</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* ===== TAB 1: MANAGE USERS ===== */}
        <TabsContent value="users">
          <ManageUsersTab
            users={users}
            currentUserId={currentUser.id}
            changeUserRole={changeUserRole}
            deleteUser={deleteUser}
          />
        </TabsContent>

        {/* ===== TAB 2: MANAGE SERVICES ===== */}
        <TabsContent value="services">
          <ManageServicesTab
            services={services}
            addService={addService}
            updateService={updateService}
            deleteService={deleteService}
          />
        </TabsContent>

        {/* ===== TAB 3: MANAGE PRODUCTS ===== */}
        <TabsContent value="products">
          <ManageProductsTab
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
          />
        </TabsContent>

        {/* ===== TAB 4: ALL APPOINTMENTS ===== */}
        <TabsContent value="appointments">
          <AllAppointmentsTab
            appointments={appointments}
            confirmAppointment={confirmAppointment}
            cancelAppointment={cancelAppointment}
          />
        </TabsContent>

        {/* ===== TAB 5: SETTINGS ===== */}
        <TabsContent value="settings">
          <SettingsTab
            homeButtonText={homeButtonText}
            setHomeButtonText={setHomeButtonText}
            homePageContent={homePageContent}
            setHomePageContent={setHomePageContent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ==================== TAB 1: MANAGE USERS ====================

function ManageUsersTab({
  users,
  currentUserId,
  changeUserRole,
  deleteUser,
}: {
  users: User[];
  currentUserId: string;
  changeUserRole: (userId: string, role: UserRole) => void;
  deleteUser: (userId: string) => void;
}) {
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteUserName, setDeleteUserName] = useState('');

  const handleDeleteClick = (userId: string, userName: string) => {
    setDeleteUserId(userId);
    setDeleteUserName(userName);
  };

  const handleDeleteConfirm = () => {
    if (deleteUserId) {
      deleteUser(deleteUserId);
      toast.success('User deleted');
      setDeleteUserId(null);
      setDeleteUserName('');
    }
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    changeUserRole(userId, newRole);
    toast.success('Role updated');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-rose-500" />
            All Users
            <Badge variant="secondary" className="ml-2">
              {users.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isSelf = user.id === currentUserId;
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{user.name}</span>
                          {isSelf && (
                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              You
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getRoleBadgeVariant(user.role)}
                            className="gap-1"
                          >
                            {getRoleIcon(user.role)}
                            {user.role}
                          </Badge>
                          {!isSelf && (
                            <Select
                              value={user.role}
                              onValueChange={(val: UserRole) =>
                                handleRoleChange(user.id, val)
                              }
                            >
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">user</SelectItem>
                                <SelectItem value="admin">admin</SelectItem>
                                <SelectItem value="superadmin">
                                  superadmin
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(user.joinDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        {!isSelf && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() =>
                              handleDeleteClick(user.id, user.name)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete User AlertDialog */}
      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteUserId(null);
            setDeleteUserName('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong className="text-foreground">{deleteUserName}</strong>? This
              action cannot be undone. All their data will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ==================== TAB 2: MANAGE SERVICES ====================

function ManageServicesTab({
  services,
  addService,
  updateService,
  deleteService,
}: {
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<(typeof services)[0] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [icon, setIcon] = useState('scissors');

  const resetForm = () => {
    setName('');
    setPrice('');
    setDuration('');
    setIcon('scissors');
    setEditingService(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (service: (typeof services)[0]) => {
    setEditingService(service);
    setName(service.name);
    setPrice(String(service.price));
    setDuration(service.duration);
    setIcon(service.icon);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!name.trim() || !price.trim() || !duration.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (editingService) {
      updateService(editingService.id, {
        name: name.trim(),
        price: priceNum,
        duration: duration.trim(),
        icon,
      });
      toast.success('Service updated');
    } else {
      addService({
        name: name.trim(),
        price: priceNum,
        duration: duration.trim(),
        icon,
      });
      toast.success('Service added');
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteService(deleteId);
      toast.success('Service deleted');
      setDeleteId(null);
    }
  };

  const iconOptions = [
    { value: 'scissors', label: 'Scissors' },
    { value: 'sparkles', label: 'Sparkles' },
    { value: 'hand', label: 'Hand' },
    { value: 'crown', label: 'Crown' },
    { value: 'leaf', label: 'Leaf' },
    { value: 'pen-tool', label: 'Pen Tool' },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-rose-500" />
              Services
              <Badge variant="secondary" className="ml-2">
                {services.length}
              </Badge>
            </CardTitle>
            <Button onClick={openAdd} className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Scissors className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No services yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        {service.name}
                      </TableCell>
                      <TableCell>NPR {service.price.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {service.duration}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => openEdit(service)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setDeleteId(service.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Service Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-rose-500" />
              {editingService ? 'Edit Service' : 'Add Service'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="svc-name">Name</Label>
              <Input
                id="svc-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Service name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-price">Price (NPR)</Label>
              <Input
                id="svc-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-duration">Duration</Label>
              <Input
                id="svc-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 45 min"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="rounded-full">
              {editingService ? 'Save Changes' : 'Add Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Service AlertDialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Service
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ==================== TAB 3: MANAGE PRODUCTS ====================

function ManageProductsTab({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
}: {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<(typeof products)[0] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Hair');
  const [image, setImage] = useState('');

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('Hair');
    setImage('');
    setEditingProduct(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (product: (typeof products)[0]) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(String(product.price));
    setCategory(product.category);
    setImage(product.image);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!name.trim() || !price.trim() || !category.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: name.trim(),
        price: priceNum,
        category,
        image: image.trim(),
      });
      toast.success('Product updated');
    } else {
      addProduct({
        name: name.trim(),
        price: priceNum,
        category,
        image: image.trim(),
      });
      toast.success('Product added');
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      toast.success('Product deleted');
      setDeleteId(null);
    }
  };

  const categoryOptions = ['Hair', 'Skin', 'Lips'];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-rose-500" />
              Products
              <Badge variant="secondary" className="ml-2">
                {products.length}
              </Badge>
            </CardTitle>
            <Button onClick={openAdd} className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No products yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <div className="h-10 w-10 overflow-hidden rounded-lg">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>NPR {product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => openEdit(product)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setDeleteId(product.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-rose-500" />
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="prod-name">Name</Label>
              <Input
                id="prod-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-price">Price (NPR)</Label>
              <Input
                id="prod-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-image">Image URL</Label>
              <Input
                id="prod-image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="rounded-full">
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product AlertDialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ==================== TAB 4: ALL APPOINTMENTS ====================

function AllAppointmentsTab({
  appointments,
  confirmAppointment,
  cancelAppointment,
}: {
  appointments: Appointment[];
  confirmAppointment: (id: string) => void;
  cancelAppointment: (id: string) => void;
}) {
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [actionInfo, setActionInfo] = useState({
    serviceName: '',
    date: '',
    userName: '',
  });

  const handleCancelClick = (
    id: string,
    serviceName: string,
    date: string,
    userName: string
  ) => {
    setCancelId(id);
    setActionInfo({ serviceName, date, userName });
  };

  const handleConfirmClick = (
    id: string,
    serviceName: string,
    date: string,
    userName: string
  ) => {
    setConfirmId(id);
    setActionInfo({ serviceName, date, userName });
  };

  const handleCancelConfirm = () => {
    if (cancelId) {
      cancelAppointment(cancelId);
      toast.success('Appointment cancelled');
      setCancelId(null);
      setActionInfo({ serviceName: '', date: '', userName: '' });
    }
  };

  const handleConfirmConfirm = () => {
    if (confirmId) {
      confirmAppointment(confirmId);
      toast.success('Appointment confirmed');
      setConfirmId(null);
      setActionInfo({ serviceName: '', date: '', userName: '' });
    }
  };

  const pendingCount = appointments.filter(
    (a) => a.status === 'pending'
  ).length;
  const confirmedCount = appointments.filter(
    (a) => a.status === 'confirmed'
  ).length;
  const cancelledCount = appointments.filter(
    (a) => a.status === 'cancelled'
  ).length;

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
            <Clock className="h-5 w-5 text-amber-500" />
            <span className="text-2xl font-bold">{pendingCount}</span>
            <span className="text-xs text-muted-foreground">Pending</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-2xl font-bold">{confirmedCount}</span>
            <span className="text-xs text-muted-foreground">Confirmed</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-2xl font-bold">{cancelledCount}</span>
            <span className="text-xs text-muted-foreground">Cancelled</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-rose-500" />
            All Appointments
            <Badge variant="secondary" className="ml-2">
              {appointments.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <CalendarDays className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No appointments yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((apt) => (
                    <TableRow
                      key={apt.id}
                      className={
                        apt.status === 'cancelled' ? 'opacity-60' : ''
                      }
                    >
                      <TableCell className="font-medium">
                        {apt.userName}
                      </TableCell>
                      <TableCell>
                        {apt.status === 'cancelled' ? (
                          <span className="line-through">
                            {apt.serviceName}
                          </span>
                        ) : (
                          apt.serviceName
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(apt.date)}
                      </TableCell>
                      <TableCell>
                        {apt.status === 'confirmed' ? (
                          <Badge className="gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Confirmed
                          </Badge>
                        ) : apt.status === 'pending' ? (
                          <Badge className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        ) : (
                          <Badge className="gap-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            <XCircle className="h-3 w-3" />
                            Cancelled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {apt.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                              onClick={() =>
                                handleConfirmClick(
                                  apt.id,
                                  apt.serviceName,
                                  apt.date,
                                  apt.userName
                                )
                              }
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Confirm
                            </Button>
                          )}
                          {(apt.status === 'pending' || apt.status === 'confirmed') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() =>
                                handleCancelClick(
                                  apt.id,
                                  apt.serviceName,
                                  apt.date,
                                  apt.userName
                                )
                              }
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Appointment AlertDialog */}
      <AlertDialog
        open={!!confirmId}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmId(null);
            setActionInfo({ serviceName: '', date: '', userName: '' });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              Confirm Appointment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm the appointment for{' '}
              <strong className="text-foreground">
                {actionInfo.serviceName}
              </strong>{' '}
              for{' '}
              <strong className="text-foreground">
                {actionInfo.userName}
              </strong>{' '}
              on{' '}
              <strong className="text-foreground">
                {actionInfo.date ? formatDate(actionInfo.date) : ''}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Don&apos;t Confirm</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmConfirm}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Yes, Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Appointment AlertDialog */}
      <AlertDialog
        open={!!cancelId}
        onOpenChange={(open) => {
          if (!open) {
            setCancelId(null);
            setActionInfo({ serviceName: '', date: '', userName: '' });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Cancel Appointment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the appointment for{' '}
              <strong className="text-foreground">
                {actionInfo.serviceName}
              </strong>{' '}
              for{' '}
              <strong className="text-foreground">
                {actionInfo.userName}
              </strong>{' '}
              on{' '}
              <strong className="text-foreground">
                {actionInfo.date ? formatDate(actionInfo.date) : ''}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ==================== TAB 5: SETTINGS ====================

function SettingsTab({
  homeButtonText,
  setHomeButtonText,
  homePageContent,
  setHomePageContent,
}: {
  homeButtonText: string;
  setHomeButtonText: (text: string) => void;
  homePageContent: HomePageContent;
  setHomePageContent: (content: Partial<HomePageContent>) => void;
}) {
  const [homeTextEditing, setHomeTextEditing] = useState(homeButtonText);
  const [editingHomePage, setEditingHomePage] = useState<HomePageContent>(homePageContent);

  // Sync local state when store value changes externally
  useEffect(() => {
    setHomeTextEditing(homeButtonText);
  }, [homeButtonText]);

  useEffect(() => {
    setEditingHomePage(homePageContent);
  }, [homePageContent]);

  return (
    <>
      {/* Navigation Button Text */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-rose-500" />
            Navigation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="sa-home-btn-text" className="text-sm font-medium">
              Home Navigation Button Text
            </Label>
            <p className="text-xs text-muted-foreground">
              Change the text displayed on the &quot;Home&quot; navigation button across the entire site.
            </p>
            <div className="flex gap-2">
              <Input
                id="sa-home-btn-text"
                value={homeTextEditing}
                onChange={(e) => setHomeTextEditing(e.target.value)}
                placeholder="Home"
                className="flex-1"
              />
              <Button
                onClick={() => {
                  if (!homeTextEditing.trim()) {
                    toast.error('Button text cannot be empty');
                    return;
                  }
                  setHomeButtonText(homeTextEditing.trim());
                  toast.success('Home button text updated');
                }}
                className="gap-2 rounded-full"
              >
                <CheckCircle2 className="h-4 w-4" />
                Save
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Current value:</span>
              <Badge variant="secondary">{homeButtonText}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Home Page Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            Home Page Content
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Edit all the text content displayed on the Home page. Changes take effect immediately.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Hero Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-rose-500">Hero Section</h4>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="sa-heroBadge" className="text-xs">Badge Text</Label>
                <Input id="sa-heroBadge" value={editingHomePage.heroBadge} onChange={(e) => setEditingHomePage({ ...editingHomePage, heroBadge: e.target.value })} placeholder="Premium Beauty Salon" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sa-heroTitle" className="text-xs">Main Title</Label>
                <Input id="sa-heroTitle" value={editingHomePage.heroTitle} onChange={(e) => setEditingHomePage({ ...editingHomePage, heroTitle: e.target.value })} placeholder="La Bella" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sa-heroSubtitle" className="text-xs">Subtitle</Label>
                <Input id="sa-heroSubtitle" value={editingHomePage.heroSubtitle} onChange={(e) => setEditingHomePage({ ...editingHomePage, heroSubtitle: e.target.value })} placeholder="Where Beauty Meets Elegance" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sa-heroDescription" className="text-xs">Description</Label>
                <Input id="sa-heroDescription" value={editingHomePage.heroDescription} onChange={(e) => setEditingHomePage({ ...editingHomePage, heroDescription: e.target.value })} placeholder="Experience luxury beauty treatments tailored just for you" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="sa-heroButtonText1" className="text-xs">Primary Button</Label>
                  <Input id="sa-heroButtonText1" value={editingHomePage.heroButtonText1} onChange={(e) => setEditingHomePage({ ...editingHomePage, heroButtonText1: e.target.value })} placeholder="Book Appointment" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="sa-heroButtonText2" className="text-xs">Secondary Button</Label>
                  <Input id="sa-heroButtonText2" value={editingHomePage.heroButtonText2} onChange={(e) => setEditingHomePage({ ...editingHomePage, heroButtonText2: e.target.value })} placeholder="View Services" />
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-rose-500">Why Choose Section</h4>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="sa-whyChooseTitle" className="text-xs">Section Title</Label>
                  <Input id="sa-whyChooseTitle" value={editingHomePage.whyChooseTitle} onChange={(e) => setEditingHomePage({ ...editingHomePage, whyChooseTitle: e.target.value })} placeholder="Why Choose" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="sa-whyChooseBrandName" className="text-xs">Brand Name (Highlighted)</Label>
                  <Input id="sa-whyChooseBrandName" value={editingHomePage.whyChooseBrandName} onChange={(e) => setEditingHomePage({ ...editingHomePage, whyChooseBrandName: e.target.value })} placeholder="La Bella" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sa-whyChooseSubtitle" className="text-xs">Section Subtitle</Label>
                <Input id="sa-whyChooseSubtitle" value={editingHomePage.whyChooseSubtitle} onChange={(e) => setEditingHomePage({ ...editingHomePage, whyChooseSubtitle: e.target.value })} placeholder="Discover the excellence that sets us apart" />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-rose-500">Statistics</h4>
            <div className="grid gap-3">
              {/* Stat 1 */}
              <div className="rounded-lg border p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Statistic 1</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="sa-stat1Value" className="text-xs">Value</Label>
                    <Input id="sa-stat1Value" value={editingHomePage.stat1Value} onChange={(e) => setEditingHomePage({ ...editingHomePage, stat1Value: e.target.value })} placeholder="15+" />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="sa-stat1Label" className="text-xs">Label</Label>
                    <Input id="sa-stat1Label" value={editingHomePage.stat1Label} onChange={(e) => setEditingHomePage({ ...editingHomePage, stat1Label: e.target.value })} placeholder="Years of Experience" />
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="sa-stat1Description" className="text-xs">Description</Label>
                  <Input id="sa-stat1Description" value={editingHomePage.stat1Description} onChange={(e) => setEditingHomePage({ ...editingHomePage, stat1Description: e.target.value })} placeholder="Over a decade of crafting beauty and building confidence" />
                </div>
              </div>
              {/* Stat 2 */}
              <div className="rounded-lg border p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Statistic 2</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="sa-stat2Value" className="text-xs">Value</Label>
                    <Input id="sa-stat2Value" value={editingHomePage.stat2Value} onChange={(e) => setEditingHomePage({ ...editingHomePage, stat2Value: e.target.value })} placeholder="5000+" />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="sa-stat2Label" className="text-xs">Label</Label>
                    <Input id="sa-stat2Label" value={editingHomePage.stat2Label} onChange={(e) => setEditingHomePage({ ...editingHomePage, stat2Label: e.target.value })} placeholder="Happy Clients" />
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="sa-stat2Description" className="text-xs">Description</Label>
                  <Input id="sa-stat2Description" value={editingHomePage.stat2Description} onChange={(e) => setEditingHomePage({ ...editingHomePage, stat2Description: e.target.value })} placeholder="Trusted by thousands who keep coming back for more" />
                </div>
              </div>
              {/* Stat 3 */}
              <div className="rounded-lg border p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Statistic 3</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="sa-stat3Value" className="text-xs">Value</Label>
                    <Input id="sa-stat3Value" value={editingHomePage.stat3Value} onChange={(e) => setEditingHomePage({ ...editingHomePage, stat3Value: e.target.value })} placeholder="50+" />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="sa-stat3Label" className="text-xs">Label</Label>
                    <Input id="sa-stat3Label" value={editingHomePage.stat3Label} onChange={(e) => setEditingHomePage({ ...editingHomePage, stat3Label: e.target.value })} placeholder="Expert Staff" />
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="sa-stat3Description" className="text-xs">Description</Label>
                  <Input id="sa-stat3Description" value={editingHomePage.stat3Description} onChange={(e) => setEditingHomePage({ ...editingHomePage, stat3Description: e.target.value })} placeholder="Skilled professionals passionate about your transformation" />
                </div>
              </div>
            </div>
          </div>

          {/* Popular Services Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-rose-500">Popular Services Section</h4>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="sa-popularServicesTitle" className="text-xs">Title</Label>
                  <Input id="sa-popularServicesTitle" value={editingHomePage.popularServicesTitle} onChange={(e) => setEditingHomePage({ ...editingHomePage, popularServicesTitle: e.target.value })} placeholder="Popular" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="sa-popularServicesHighlight" className="text-xs">Highlighted Word</Label>
                  <Input id="sa-popularServicesHighlight" value={editingHomePage.popularServicesHighlight} onChange={(e) => setEditingHomePage({ ...editingHomePage, popularServicesHighlight: e.target.value })} placeholder="Services" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sa-popularServicesSubtitle" className="text-xs">Subtitle</Label>
                <Input id="sa-popularServicesSubtitle" value={editingHomePage.popularServicesSubtitle} onChange={(e) => setEditingHomePage({ ...editingHomePage, popularServicesSubtitle: e.target.value })} placeholder="Explore our most loved beauty treatments" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sa-viewAllServicesButton" className="text-xs">View All Button Text</Label>
                <Input id="sa-viewAllServicesButton" value={editingHomePage.viewAllServicesButton} onChange={(e) => setEditingHomePage({ ...editingHomePage, viewAllServicesButton: e.target.value })} placeholder="View All Services" />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-rose-500">Call-to-Action Section</h4>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="sa-ctaTitle" className="text-xs">Title</Label>
                <Input id="sa-ctaTitle" value={editingHomePage.ctaTitle} onChange={(e) => setEditingHomePage({ ...editingHomePage, ctaTitle: e.target.value })} placeholder="Ready to Transform Your Look?" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sa-ctaDescription" className="text-xs">Description</Label>
                <Input id="sa-ctaDescription" value={editingHomePage.ctaDescription} onChange={(e) => setEditingHomePage({ ...editingHomePage, ctaDescription: e.target.value })} placeholder="Let our expert team create the perfect look for you..." />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sa-ctaButtonText" className="text-xs">Button Text</Label>
                <Input id="sa-ctaButtonText" value={editingHomePage.ctaButtonText} onChange={(e) => setEditingHomePage({ ...editingHomePage, ctaButtonText: e.target.value })} placeholder="Book Your Appointment Today" />
              </div>
            </div>
          </div>

          {/* Save & Reset Buttons */}
          <div className="flex items-center justify-between pt-2 border-t gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs gap-1.5"
              onClick={() => {
                const defaults = {
                  heroBadge: "Premium Beauty Salon",
                  heroTitle: "La Bella",
                  heroSubtitle: "Where Beauty Meets Elegance",
                  heroDescription: "Experience luxury beauty treatments tailored just for you",
                  heroButtonText1: "Book Appointment",
                  heroButtonText2: "View Services",
                  whyChooseTitle: "Why Choose",
                  whyChooseBrandName: "La Bella",
                  whyChooseSubtitle: "Discover the excellence that sets us apart",
                  stat1Value: "15+",
                  stat1Label: "Years of Experience",
                  stat1Description: "Over a decade of crafting beauty and building confidence",
                  stat2Value: "5000+",
                  stat2Label: "Happy Clients",
                  stat2Description: "Trusted by thousands who keep coming back for more",
                  stat3Value: "50+",
                  stat3Label: "Expert Staff",
                  stat3Description: "Skilled professionals passionate about your transformation",
                  popularServicesTitle: "Popular",
                  popularServicesHighlight: "Services",
                  popularServicesSubtitle: "Explore our most loved beauty treatments",
                  viewAllServicesButton: "View All Services",
                  ctaTitle: "Ready to Transform Your Look?",
                  ctaDescription: "Let our expert team create the perfect look for you. Book your appointment today and step into a world of beauty.",
                  ctaButtonText: "Book Your Appointment Today",
                };
                setEditingHomePage(defaults);
                setHomePageContent(defaults);
                toast.success('Home page content reset to defaults');
              }}
            >
              Reset to Defaults
            </Button>
            <Button
              onClick={() => {
                setHomePageContent(editingHomePage);
                toast.success('Home page content updated — navigate to Home to see changes');
              }}
              className="gap-2 rounded-full"
            >
              <CheckCircle2 className="h-4 w-4" />
              Save All Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
