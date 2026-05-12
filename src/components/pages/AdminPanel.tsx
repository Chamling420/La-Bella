'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Pencil,
  Trash2,
  Shield,
  Scissors,
  ShoppingBag,
  CalendarDays,
  Users,
  XCircle,
  CheckCircle2,
  Sparkles,
  Hand,
  Crown,
  Leaf,
  PenTool,
  Clock,
  Settings,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from '@/components/ui/image-upload';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

// Icon mapping helper
function getIconComponent(iconName: string) {
  const map: Record<string, React.ComponentType<{ className?: string }>> = {
    scissors: Scissors,
    sparkles: Sparkles,
    hand: Hand,
    crown: Crown,
    leaf: Leaf,
    'pen-tool': PenTool,
  };
  return map[iconName] ?? Sparkles;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ========== Service Form State ==========
interface ServiceForm {
  name: string;
  price: string;
  duration: string;
  icon: string;
}

const emptyServiceForm: ServiceForm = {
  name: '',
  price: '',
  duration: '',
  icon: 'scissors',
};

// ========== Product Form State ==========
interface ProductForm {
  name: string;
  price: string;
  category: string;
  image: string;
}

const emptyProductForm: ProductForm = {
  name: '',
  price: '',
  category: 'Hair',
  image: '',
};

export default function AdminPanel() {
  const {
    currentUser,
    services,
    products,
    appointments,
    users,
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

  // Service dialog state
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceForm>(emptyServiceForm);

  // Product dialog state
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);

  // ===== Access Control =====
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Access Denied</h2>
          <p className="text-muted-foreground">
            You do not have permission to access the admin panel. Only administrators can view this page.
          </p>
        </motion.div>
      </div>
    );
  }

  const isSuperAdmin = currentUser.role === 'superadmin';

  // ===== Service Handlers =====
  const openAddService = () => {
    setEditingServiceId(null);
    setServiceForm(emptyServiceForm);
    setServiceDialogOpen(true);
  };

  const openEditService = (id: string) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    setEditingServiceId(id);
    setServiceForm({
      name: service.name,
      price: String(service.price),
      duration: service.duration,
      icon: service.icon,
    });
    setServiceDialogOpen(true);
  };

  const handleSaveService = () => {
    if (!serviceForm.name.trim() || !serviceForm.price || !serviceForm.duration.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    const priceNum = parseFloat(serviceForm.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (editingServiceId) {
      updateService(editingServiceId, {
        name: serviceForm.name.trim(),
        price: priceNum,
        duration: serviceForm.duration.trim(),
        icon: serviceForm.icon,
      });
      toast.success('Service updated');
    } else {
      addService({
        name: serviceForm.name.trim(),
        price: priceNum,
        duration: serviceForm.duration.trim(),
        icon: serviceForm.icon,
      });
      toast.success('Service added');
    }
    setServiceDialogOpen(false);
    setServiceForm(emptyServiceForm);
    setEditingServiceId(null);
  };

  const handleDeleteService = (id: string) => {
    deleteService(id);
    toast.success('Service deleted');
  };

  // ===== Product Handlers =====
  const openAddProduct = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
    setProductDialogOpen(true);
  };

  const openEditProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setEditingProductId(id);
    setProductForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      image: product.image,
    });
    setProductDialogOpen(true);
  };

  const handleSaveProduct = () => {
    if (!productForm.name.trim() || !productForm.price || !productForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    const priceNum = parseFloat(productForm.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name.trim(),
        price: priceNum,
        category: productForm.category,
        image: productForm.image.trim(),
      });
      toast.success('Product updated');
    } else {
      addProduct({
        name: productForm.name.trim(),
        price: priceNum,
        category: productForm.category,
        image: productForm.image.trim(),
      });
      toast.success('Product added');
    }
    setProductDialogOpen(false);
    setProductForm(emptyProductForm);
    setEditingProductId(null);
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    toast.success('Product deleted');
  };

  // ===== Appointment Handlers =====
  const handleConfirmAppointment = (id: string) => {
    confirmAppointment(id);
    toast.success('Appointment confirmed');
  };

  const handleCancelAppointment = (id: string) => {
    cancelAppointment(id);
    toast.success('Appointment cancelled');
  };

  // ===== Category badge color =====
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Hair':
        return 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100';
      case 'Skin':
        return 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-100';
      case 'Lips':
        return 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100';
      default:
        return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/10';
    }
  };

  // ===== Role badge color =====
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'admin':
        return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/10';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-rose-50 to-pink-50 py-12 md:py-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-rose-200/30 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Shield className="w-4 h-4 mr-1.5" />
              Admin Panel
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Administration
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Manage services, products, appointments, and users for La Bella beauty salon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="mb-6 w-full sm:w-auto flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="services" className="flex-1 sm:flex-none gap-1.5">
              <Scissors className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex-1 sm:flex-none gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex-1 sm:flex-none gap-1.5">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1 sm:flex-none gap-1.5">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 sm:flex-none gap-1.5">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== TAB 1: Manage Services ===== */}
          <TabsContent value="services">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Manage Services</h2>
                  <p className="text-sm text-muted-foreground">{services.length} services available</p>
                </div>
                <Button
                  onClick={openAddService}
                  className="rounded-full shadow-lg shadow-primary/25"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Service
                </Button>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Icon</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {services.map((service) => {
                          const IconComp = getIconComponent(service.icon);
                          return (
                            <TableRow key={service.id}>
                              <TableCell>
                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <IconComp className="w-4 h-4 text-primary" />
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{service.name}</TableCell>
                              <TableCell>NPR {service.price}</TableCell>
                              <TableCell>{service.duration}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditService(service.id)}
                                    className="h-8 w-8 p-0 hover:text-primary"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:text-red-600"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete{' '}
                                          <span className="font-semibold text-foreground">{service.name}</span>?
                                          This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteService(service.id)}
                                          className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {services.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                              No services yet. Click &quot;Add Service&quot; to create one.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden grid gap-3">
                {services.map((service) => {
                  const IconComp = getIconComponent(service.icon);
                  return (
                    <motion.div key={service.id} variants={staggerItem}>
                      <Card className="transition-shadow hover:shadow-lg hover:shadow-primary/5">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <IconComp className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm">{service.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  NPR {service.price}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{service.duration}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditService(service.id)}
                                className="h-8 w-8 p-0 hover:text-primary"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete{' '}
                                      <span className="font-semibold text-foreground">{service.name}</span>?
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteService(service.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
                {services.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Scissors className="w-8 h-8 text-primary/50" />
                    </div>
                    <p className="text-muted-foreground">No services yet. Click &quot;Add Service&quot; to create one.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          {/* ===== TAB 2: Manage Products ===== */}
          <TabsContent value="products">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Manage Products</h2>
                  <p className="text-sm text-muted-foreground">{products.length} products available</p>
                </div>
                <Button
                  onClick={openAddProduct}
                  className="rounded-full shadow-lg shadow-primary/25"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Product
                </Button>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>NPR {product.price}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getCategoryBadge(product.category)}>
                                {product.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditProduct(product.id)}
                                  className="h-8 w-8 p-0 hover:text-primary"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete{' '}
                                        <span className="font-semibold text-foreground">{product.name}</span>?
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {products.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                              No products yet. Click &quot;Add Product&quot; to create one.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden grid gap-3">
                {products.map((product) => (
                  <motion.div key={product.id} variants={staggerItem}>
                    <Card className="transition-shadow hover:shadow-lg hover:shadow-primary/5">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                NPR {product.price}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getCategoryBadge(product.category)}`}>
                                {product.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditProduct(product.id)}
                              className="h-8 w-8 p-0 hover:text-primary"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete{' '}
                                    <span className="font-semibold text-foreground">{product.name}</span>?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {products.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-primary/50" />
                    </div>
                    <p className="text-muted-foreground">No products yet. Click &quot;Add Product&quot; to create one.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          {/* ===== TAB 3: All Appointments ===== */}
          <TabsContent value="appointments">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <div className="mb-6">
                <h2 className="text-xl font-bold">All Appointments</h2>
                <p className="text-sm text-muted-foreground">{appointments.length} total appointments</p>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CalendarDays className="w-8 h-8 text-primary/50" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Appointments</h3>
                  <p className="text-muted-foreground">No appointments have been booked yet.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Service</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>User</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[...appointments]
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .map((appointment) => (
                                <TableRow key={appointment.id}>
                                  <TableCell className="font-medium">{appointment.serviceName}</TableCell>
                                  <TableCell>{formatDate(appointment.date)}</TableCell>
                                  <TableCell>{appointment.userName}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={
                                        appointment.status === 'confirmed'
                                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                          : appointment.status === 'pending'
                                            ? 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100'
                                            : 'bg-red-100 text-red-600 border-red-200 hover:bg-red-100 line-through'
                                      }
                                    >
                                      {appointment.status === 'confirmed' ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                      ) : appointment.status === 'pending' ? (
                                        <Clock className="w-3.5 h-3.5 mr-1" />
                                      ) : (
                                        <XCircle className="w-3.5 h-3.5 mr-1" />
                                      )}
                                      {appointment.status === 'confirmed' ? 'Confirmed' : appointment.status === 'pending' ? 'Pending' : 'Cancelled'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      {appointment.status === 'pending' && (
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 rounded-full"
                                            >
                                              <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                              Confirm
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Confirm Appointment</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to confirm the{' '}
                                                <span className="font-semibold text-foreground">
                                                  {appointment.serviceName}
                                                </span>{' '}
                                                appointment for{' '}
                                                <span className="font-semibold text-foreground">
                                                  {appointment.userName}
                                                </span>{' '}
                                                on{' '}
                                                <span className="font-semibold text-foreground">
                                                  {formatDate(appointment.date)}
                                                </span>
                                                ?
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel className="rounded-full">
                                                Cancel
                                              </AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() => handleConfirmAppointment(appointment.id)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                                              >
                                                Yes, Confirm
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      )}
                                      {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded-full"
                                            >
                                              <XCircle className="w-4 h-4 mr-1.5" />
                                              Cancel
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to cancel the{' '}
                                                <span className="font-semibold text-foreground">
                                                  {appointment.serviceName}
                                                </span>{' '}
                                                appointment for{' '}
                                                <span className="font-semibold text-foreground">
                                                  {appointment.userName}
                                                </span>{' '}
                                                on{' '}
                                                <span className="font-semibold text-foreground">
                                                  {formatDate(appointment.date)}
                                                </span>
                                                ? This action cannot be undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel className="rounded-full">
                                                Keep Appointment
                                              </AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() => handleCancelAppointment(appointment.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                                              >
                                                Yes, Cancel
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      )}
                                      {appointment.status === 'cancelled' && (
                                        <span className="text-xs text-muted-foreground">—</span>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden grid gap-3">
                    {[...appointments]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((appointment) => (
                        <motion.div key={appointment.id} variants={staggerItem}>
                          <Card
                            className={`transition-shadow hover:shadow-lg hover:shadow-primary/5 ${
                              appointment.status === 'cancelled' ? 'opacity-70' : ''
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h3
                                    className={`font-semibold text-sm ${
                                      appointment.status === 'cancelled'
                                        ? 'line-through text-muted-foreground'
                                        : ''
                                    }`}
                                  >
                                    {appointment.serviceName}
                                  </h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {formatDate(appointment.date)}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    <Users className="w-3 h-3 inline mr-1" />
                                    {appointment.userName}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                  <Badge
                                    variant="outline"
                                    className={
                                      appointment.status === 'confirmed'
                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                        : appointment.status === 'pending'
                                          ? 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100'
                                          : 'bg-red-100 text-red-600 border-red-200 hover:bg-red-100 line-through'
                                    }
                                  >
                                    {appointment.status === 'confirmed' ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                    ) : appointment.status === 'pending' ? (
                                      <Clock className="w-3.5 h-3.5 mr-1" />
                                    ) : (
                                      <XCircle className="w-3.5 h-3.5 mr-1" />
                                    )}
                                    {appointment.status === 'confirmed' ? 'Confirmed' : appointment.status === 'pending' ? 'Pending' : 'Cancelled'}
                                  </Badge>
                                  <div className="flex flex-col gap-1.5">
                                    {appointment.status === 'pending' && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 rounded-full text-xs h-7"
                                          >
                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                            Confirm
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm Appointment</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to confirm the{' '}
                                              <span className="font-semibold text-foreground">
                                                {appointment.serviceName}
                                              </span>{' '}
                                              appointment for{' '}
                                              <span className="font-semibold text-foreground">
                                                {appointment.userName}
                                              </span>{' '}
                                              on{' '}
                                              <span className="font-semibold text-foreground">
                                                {formatDate(appointment.date)}
                                              </span>
                                              ?
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-full">
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleConfirmAppointment(appointment.id)}
                                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                                            >
                                              Yes, Confirm
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                    {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded-full text-xs h-7"
                                          >
                                            <XCircle className="w-3.5 h-3.5 mr-1" />
                                            Cancel
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to cancel the{' '}
                                              <span className="font-semibold text-foreground">
                                                {appointment.serviceName}
                                              </span>{' '}
                                              appointment for{' '}
                                              <span className="font-semibold text-foreground">
                                                {appointment.userName}
                                              </span>{' '}
                                              on{' '}
                                              <span className="font-semibold text-foreground">
                                                {formatDate(appointment.date)}
                                              </span>
                                              ? This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-full">
                                              Keep Appointment
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleCancelAppointment(appointment.id)}
                                              className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                                            >
                                              Yes, Cancel
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </>
              )}
            </motion.div>
          </TabsContent>

          {/* ===== TAB 4: All Users ===== */}
          <TabsContent value="users">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <div className="mb-6">
                <h2 className="text-xl font-bold">All Users</h2>
                <p className="text-sm text-muted-foreground">{users.length} registered users</p>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary/50" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Users</h3>
                  <p className="text-muted-foreground">No users registered yet.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Join Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                      {user.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2)}
                                    </div>
                                    {user.name}
                                  </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getRoleBadge(user.role)}>
                                    {user.role === 'superadmin' && <Crown className="w-3 h-3 mr-1" />}
                                    {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                                    {user.role}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{formatDate(user.joinDate)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden grid gap-3">
                    {users.map((user) => (
                      <motion.div key={user.id} variants={staggerItem}>
                        <Card className="transition-shadow hover:shadow-lg hover:shadow-primary/5">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                                {user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm">{user.name}</h3>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <Badge variant="outline" className={`text-xs ${getRoleBadge(user.role)}`}>
                                  {user.role === 'superadmin' && <Crown className="w-3 h-3 mr-0.5" />}
                                  {user.role === 'admin' && <Shield className="w-3 h-3 mr-0.5" />}
                                  {user.role}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{formatDate(user.joinDate)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {!isSuperAdmin && (
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      Only Super Admin can change user roles or delete users.
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </TabsContent>

          {/* ===== TAB 5: Settings ===== */}
          <TabsContent value="settings">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <div className="mb-6">
                <h2 className="text-xl font-bold">Site Settings</h2>
                <p className="text-sm text-muted-foreground">Customize the appearance and content of your website</p>
              </div>

              <div className="grid gap-6 max-w-2xl">
                {/* Navigation Button Text */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      Navigation Button Text
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="home-btn-text">Home Button Text</Label>
                      <p className="text-xs text-muted-foreground">
                        Change the text displayed on the &quot;Home&quot; navigation button.
                      </p>
                      <Input
                          id="home-btn-text"
                          value={homeButtonText}
                          onChange={(e) => setHomeButtonText(e.target.value)}
                          placeholder="Home"
                        />
                      <p className="text-xs text-muted-foreground">
                        Changes are saved automatically and update the navbar in real-time.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Home Page Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Home Page Content
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Edit all the text content displayed on the Home page. Changes take effect immediately.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Hero Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Hero Section</h4>
                      <div className="grid gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-heroBadge" className="text-xs">Badge Text</Label>
                          <Input id="hp-heroBadge" value={homePageContent.heroBadge} onChange={(e) => setHomePageContent({ heroBadge: e.target.value })} placeholder="Premium Beauty Salon" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-heroTitle" className="text-xs">Main Title</Label>
                          <Input id="hp-heroTitle" value={homePageContent.heroTitle} onChange={(e) => setHomePageContent({ heroTitle: e.target.value })} placeholder="La Bella" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-heroSubtitle" className="text-xs">Subtitle</Label>
                          <Input id="hp-heroSubtitle" value={homePageContent.heroSubtitle} onChange={(e) => setHomePageContent({ heroSubtitle: e.target.value })} placeholder="Where Beauty Meets Elegance" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-heroDescription" className="text-xs">Description</Label>
                          <Input id="hp-heroDescription" value={homePageContent.heroDescription} onChange={(e) => setHomePageContent({ heroDescription: e.target.value })} placeholder="Experience luxury beauty treatments tailored just for you" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-heroButtonText1" className="text-xs">Primary Button</Label>
                            <Input id="hp-heroButtonText1" value={homePageContent.heroButtonText1} onChange={(e) => setHomePageContent({ heroButtonText1: e.target.value })} placeholder="Book Appointment" />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-heroButtonText2" className="text-xs">Secondary Button</Label>
                            <Input id="hp-heroButtonText2" value={homePageContent.heroButtonText2} onChange={(e) => setHomePageContent({ heroButtonText2: e.target.value })} placeholder="View Services" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Why Choose Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Why Choose Section</h4>
                      <div className="grid gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-whyChooseTitle" className="text-xs">Section Title</Label>
                            <Input id="hp-whyChooseTitle" value={homePageContent.whyChooseTitle} onChange={(e) => setHomePageContent({ whyChooseTitle: e.target.value })} placeholder="Why Choose" />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-whyChooseBrandName" className="text-xs">Brand Name (Highlighted)</Label>
                            <Input id="hp-whyChooseBrandName" value={homePageContent.whyChooseBrandName} onChange={(e) => setHomePageContent({ whyChooseBrandName: e.target.value })} placeholder="La Bella" />
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-whyChooseSubtitle" className="text-xs">Section Subtitle</Label>
                          <Input id="hp-whyChooseSubtitle" value={homePageContent.whyChooseSubtitle} onChange={(e) => setHomePageContent({ whyChooseSubtitle: e.target.value })} placeholder="Discover the excellence that sets us apart" />
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Statistics</h4>
                      <div className="grid gap-3">
                        {/* Stat 1 */}
                        <div className="rounded-lg border p-3 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Statistic 1</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-1">
                              <Label htmlFor="hp-stat1Value" className="text-xs">Value</Label>
                              <Input id="hp-stat1Value" value={homePageContent.stat1Value} onChange={(e) => setHomePageContent({ stat1Value: e.target.value })} placeholder="15+" />
                            </div>
                            <div className="grid gap-1">
                              <Label htmlFor="hp-stat1Label" className="text-xs">Label</Label>
                              <Input id="hp-stat1Label" value={homePageContent.stat1Label} onChange={(e) => setHomePageContent({ stat1Label: e.target.value })} placeholder="Years of Experience" />
                            </div>
                          </div>
                          <div className="grid gap-1">
                            <Label htmlFor="hp-stat1Description" className="text-xs">Description</Label>
                            <Input id="hp-stat1Description" value={homePageContent.stat1Description} onChange={(e) => setHomePageContent({ stat1Description: e.target.value })} placeholder="Over a decade of crafting beauty and building confidence" />
                          </div>
                        </div>
                        {/* Stat 2 */}
                        <div className="rounded-lg border p-3 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Statistic 2</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-1">
                              <Label htmlFor="hp-stat2Value" className="text-xs">Value</Label>
                              <Input id="hp-stat2Value" value={homePageContent.stat2Value} onChange={(e) => setHomePageContent({ stat2Value: e.target.value })} placeholder="5000+" />
                            </div>
                            <div className="grid gap-1">
                              <Label htmlFor="hp-stat2Label" className="text-xs">Label</Label>
                              <Input id="hp-stat2Label" value={homePageContent.stat2Label} onChange={(e) => setHomePageContent({ stat2Label: e.target.value })} placeholder="Happy Clients" />
                            </div>
                          </div>
                          <div className="grid gap-1">
                            <Label htmlFor="hp-stat2Description" className="text-xs">Description</Label>
                            <Input id="hp-stat2Description" value={homePageContent.stat2Description} onChange={(e) => setHomePageContent({ stat2Description: e.target.value })} placeholder="Trusted by thousands who keep coming back for more" />
                          </div>
                        </div>
                        {/* Stat 3 */}
                        <div className="rounded-lg border p-3 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Statistic 3</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-1">
                              <Label htmlFor="hp-stat3Value" className="text-xs">Value</Label>
                              <Input id="hp-stat3Value" value={homePageContent.stat3Value} onChange={(e) => setHomePageContent({ stat3Value: e.target.value })} placeholder="50+" />
                            </div>
                            <div className="grid gap-1">
                              <Label htmlFor="hp-stat3Label" className="text-xs">Label</Label>
                              <Input id="hp-stat3Label" value={homePageContent.stat3Label} onChange={(e) => setHomePageContent({ stat3Label: e.target.value })} placeholder="Expert Staff" />
                            </div>
                          </div>
                          <div className="grid gap-1">
                            <Label htmlFor="hp-stat3Description" className="text-xs">Description</Label>
                            <Input id="hp-stat3Description" value={homePageContent.stat3Description} onChange={(e) => setHomePageContent({ stat3Description: e.target.value })} placeholder="Skilled professionals passionate about your transformation" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Popular Services Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Popular Services Section</h4>
                      <div className="grid gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-popularServicesTitle" className="text-xs">Title</Label>
                            <Input id="hp-popularServicesTitle" value={homePageContent.popularServicesTitle} onChange={(e) => setHomePageContent({ popularServicesTitle: e.target.value })} placeholder="Popular" />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-popularServicesHighlight" className="text-xs">Highlighted Word</Label>
                            <Input id="hp-popularServicesHighlight" value={homePageContent.popularServicesHighlight} onChange={(e) => setHomePageContent({ popularServicesHighlight: e.target.value })} placeholder="Services" />
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-popularServicesSubtitle" className="text-xs">Subtitle</Label>
                          <Input id="hp-popularServicesSubtitle" value={homePageContent.popularServicesSubtitle} onChange={(e) => setHomePageContent({ popularServicesSubtitle: e.target.value })} placeholder="Explore our most loved beauty treatments" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-viewAllServicesButton" className="text-xs">View All Button Text</Label>
                          <Input id="hp-viewAllServicesButton" value={homePageContent.viewAllServicesButton} onChange={(e) => setHomePageContent({ viewAllServicesButton: e.target.value })} placeholder="View All Services" />
                        </div>
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Call-to-Action Section</h4>
                      <div className="grid gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-ctaTitle" className="text-xs">Title</Label>
                          <Input id="hp-ctaTitle" value={homePageContent.ctaTitle} onChange={(e) => setHomePageContent({ ctaTitle: e.target.value })} placeholder="Ready to Transform Your Look?" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-ctaDescription" className="text-xs">Description</Label>
                          <Input id="hp-ctaDescription" value={homePageContent.ctaDescription} onChange={(e) => setHomePageContent({ ctaDescription: e.target.value })} placeholder="Let our expert team create the perfect look for you..." />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-ctaButtonText" className="text-xs">Button Text</Label>
                          <Input id="hp-ctaButtonText" value={homePageContent.ctaButtonText} onChange={(e) => setHomePageContent({ ctaButtonText: e.target.value })} placeholder="Book Your Appointment Today" />
                        </div>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <div className="flex items-center justify-end pt-2 border-t gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs"
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
                            footerBrandName: "La Bella",
                            footerBrandDescription: "Your premier destination for luxury beauty treatments. Experience the art of beauty with our expert team.",
                            footerContactHeading: "Contact Us",
                            footerAddressLine1: "123 Beauty Lane, Suite 100",
                            footerAddressLine2: "New York, NY 10001",
                            footerPhone: "(555) 123-4567",
                            footerEmail: "hello@labella.com",
                            footerHoursHeading: "Opening Hours",
                            footerHoursWeekday: "Mon - Fri: 9:00 AM - 8:00 PM",
                            footerHoursSaturday: "Saturday: 9:00 AM - 6:00 PM",
                            footerHoursSunday: "Sunday: 10:00 AM - 5:00 PM",
                            footerLinksHeading: "Quick Links",
                            footerLink1: "About Us",
                            footerLink2: "Our Team",
                            footerLink3: "Gift Cards",
                            footerLink4: "Privacy Policy",
                            footerLink5: "Terms of Service",
                          };
                          setHomePageContent(defaults);
                          toast.success('Home page content reset to defaults');
                        }}
                      >
                        Reset to Defaults
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Footer Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Footer Content
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Edit the text content displayed in the footer. Changes take effect immediately.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Brand Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Brand Section</h4>
                      <div className="grid gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-footerBrandName" className="text-xs">Brand Name</Label>
                          <Input id="hp-footerBrandName" value={homePageContent.footerBrandName} onChange={(e) => setHomePageContent({ footerBrandName: e.target.value })} placeholder="La Bella" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-footerBrandDescription" className="text-xs">Brand Description</Label>
                          <Input id="hp-footerBrandDescription" value={homePageContent.footerBrandDescription} onChange={(e) => setHomePageContent({ footerBrandDescription: e.target.value })} placeholder="Your premier destination for luxury beauty treatments..." />
                        </div>
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Contact Section</h4>
                      <div className="grid gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-footerContactHeading" className="text-xs">Contact Section Heading</Label>
                          <Input id="hp-footerContactHeading" value={homePageContent.footerContactHeading} onChange={(e) => setHomePageContent({ footerContactHeading: e.target.value })} placeholder="Contact Us" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-footerAddressLine1" className="text-xs">Address Line 1</Label>
                            <Input id="hp-footerAddressLine1" value={homePageContent.footerAddressLine1} onChange={(e) => setHomePageContent({ footerAddressLine1: e.target.value })} placeholder="123 Beauty Lane, Suite 100" />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-footerAddressLine2" className="text-xs">Address Line 2</Label>
                            <Input id="hp-footerAddressLine2" value={homePageContent.footerAddressLine2} onChange={(e) => setHomePageContent({ footerAddressLine2: e.target.value })} placeholder="New York, NY 10001" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-footerPhone" className="text-xs">Phone Number</Label>
                            <Input id="hp-footerPhone" value={homePageContent.footerPhone} onChange={(e) => setHomePageContent({ footerPhone: e.target.value })} placeholder="(555) 123-4567" />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-footerEmail" className="text-xs">Email Address</Label>
                            <Input id="hp-footerEmail" value={homePageContent.footerEmail} onChange={(e) => setHomePageContent({ footerEmail: e.target.value })} placeholder="hello@labella.com" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Opening Hours Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Opening Hours Section</h4>
                      <div className="grid gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-footerHoursHeading" className="text-xs">Hours Section Heading</Label>
                          <Input id="hp-footerHoursHeading" value={homePageContent.footerHoursHeading} onChange={(e) => setHomePageContent({ footerHoursHeading: e.target.value })} placeholder="Opening Hours" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-footerHoursWeekday" className="text-xs">Weekday Hours</Label>
                            <Input id="hp-footerHoursWeekday" value={homePageContent.footerHoursWeekday} onChange={(e) => setHomePageContent({ footerHoursWeekday: e.target.value })} placeholder="Mon - Fri: 9:00 AM - 8:00 PM" />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-footerHoursSaturday" className="text-xs">Saturday Hours</Label>
                            <Input id="hp-footerHoursSaturday" value={homePageContent.footerHoursSaturday} onChange={(e) => setHomePageContent({ footerHoursSaturday: e.target.value })} placeholder="Saturday: 9:00 AM - 6:00 PM" />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-footerHoursSunday" className="text-xs">Sunday Hours</Label>
                            <Input id="hp-footerHoursSunday" value={homePageContent.footerHoursSunday} onChange={(e) => setHomePageContent({ footerHoursSunday: e.target.value })} placeholder="Sunday: 10:00 AM - 5:00 PM" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Quick Links Section</h4>
                      <div className="grid gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-footerLinksHeading" className="text-xs">Links Section Heading</Label>
                          <Input id="hp-footerLinksHeading" value={homePageContent.footerLinksHeading} onChange={(e) => setHomePageContent({ footerLinksHeading: e.target.value })} placeholder="Quick Links" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-footerLink1" className="text-xs">Link 1</Label>
                            <Input id="hp-footerLink1" value={homePageContent.footerLink1} onChange={(e) => setHomePageContent({ footerLink1: e.target.value })} placeholder="About Us" />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-footerLink2" className="text-xs">Link 2</Label>
                            <Input id="hp-footerLink2" value={homePageContent.footerLink2} onChange={(e) => setHomePageContent({ footerLink2: e.target.value })} placeholder="Our Team" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-footerLink3" className="text-xs">Link 3</Label>
                            <Input id="hp-footerLink3" value={homePageContent.footerLink3} onChange={(e) => setHomePageContent({ footerLink3: e.target.value })} placeholder="Gift Cards" />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="hp-footerLink4" className="text-xs">Link 4</Label>
                            <Input id="hp-footerLink4" value={homePageContent.footerLink4} onChange={(e) => setHomePageContent({ footerLink4: e.target.value })} placeholder="Privacy Policy" />
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="hp-footerLink5" className="text-xs">Link 5</Label>
                          <Input id="hp-footerLink5" value={homePageContent.footerLink5} onChange={(e) => setHomePageContent({ footerLink5: e.target.value })} placeholder="Terms of Service" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* ===== Service Dialog ===== */}
        <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-primary" />
                {editingServiceId ? 'Edit Service' : 'Add Service'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="service-name">Name</Label>
                <Input
                  id="service-name"
                  placeholder="Service name"
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="service-price">Price (NPR)</Label>
                  <Input
                    id="service-price"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={serviceForm.price}
                    onChange={(e) =>
                      setServiceForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service-duration">Duration</Label>
                  <Input
                    id="service-duration"
                    placeholder="e.g. 45 min"
                    value={serviceForm.duration}
                    onChange={(e) =>
                      setServiceForm((prev) => ({ ...prev, duration: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Icon</Label>
                <Select
                  value={serviceForm.icon}
                  onValueChange={(val) =>
                    setServiceForm((prev) => ({ ...prev, icon: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scissors">
                      <span className="flex items-center gap-2">
                        <Scissors className="w-4 h-4" /> Scissors
                      </span>
                    </SelectItem>
                    <SelectItem value="sparkles">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Sparkles
                      </span>
                    </SelectItem>
                    <SelectItem value="hand">
                      <span className="flex items-center gap-2">
                        <Hand className="w-4 h-4" /> Hand
                      </span>
                    </SelectItem>
                    <SelectItem value="crown">
                      <span className="flex items-center gap-2">
                        <Crown className="w-4 h-4" /> Crown
                      </span>
                    </SelectItem>
                    <SelectItem value="leaf">
                      <span className="flex items-center gap-2">
                        <Leaf className="w-4 h-4" /> Leaf
                      </span>
                    </SelectItem>
                    <SelectItem value="pen-tool">
                      <span className="flex items-center gap-2">
                        <PenTool className="w-4 h-4" /> Pen Tool
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setServiceDialogOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveService} className="rounded-full shadow-lg shadow-primary/25">
                {editingServiceId ? 'Update' : 'Add'} Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ===== Product Dialog ===== */}
        <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                {editingProductId ? 'Edit Product' : 'Add Product'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="product-name">Name</Label>
                <Input
                  id="product-name"
                  placeholder="Product name"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="product-price">Price (NPR)</Label>
                  <Input
                    id="product-price"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={productForm.category}
                    onValueChange={(val) =>
                      setProductForm((prev) => ({ ...prev, category: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hair">Hair</SelectItem>
                      <SelectItem value="Skin">Skin</SelectItem>
                      <SelectItem value="Lips">Lips</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ImageUpload
                value={productForm.image}
                onChange={(url) =>
                  setProductForm((prev) => ({ ...prev, image: url }))
                }
                label="Product Image"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setProductDialogOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProduct} className="rounded-full shadow-lg shadow-primary/25">
                {editingProductId ? 'Update' : 'Add'} Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
