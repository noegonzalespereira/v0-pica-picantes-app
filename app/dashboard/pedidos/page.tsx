"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Banknote,
  Smartphone,
  X,
  Search,
  Eye,
  Edit,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
} from "lucide-react"
import { mockProducts, mockOrders, mockCaja } from "@/lib/mock-data"
import { PRODUCT_CATEGORIES, type OrderItem, type Product, type Order } from "@/lib/types"

export default function PedidosPage() {
  const [activeTab, setActiveTab] = useState("nuevo")
  const [cart, setCart] = useState<OrderItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("Tacos")
  const [orderType, setOrderType] = useState<"MESA" | "LLEVAR" | "MIXTO">("MESA")
  const [tableNumber, setTableNumber] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [caja] = useState(mockCaja)

  const [isEditMode, setIsEditMode] = useState(false)
  const [editCart, setEditCart] = useState<OrderItem[]>([])
  const [editSearchQuery, setEditSearchQuery] = useState("")
  const [editSelectedCategory, setEditSelectedCategory] = useState<string>("Tacos")
  const [editOrderType, setEditOrderType] = useState<"MESA" | "LLEVAR" | "MIXTO">("MESA")

  // Filters for order list
  const [filterEstadoPedido, setFilterEstadoPedido] = useState<string>("TODOS")
  const [filterEstadoPago, setFilterEstadoPago] = useState<string>("TODOS")
  const [filterTipo, setFilterTipo] = useState<string>("TODOS")

  const TAX_RATE = 0.16 // 16% IVA

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.category === selectedCategory &&
      p.available &&
      (searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const editFilteredProducts = mockProducts.filter(
    (p) =>
      p.category === editSelectedCategory &&
      p.available &&
      (editSearchQuery === "" || p.name.toLowerCase().includes(editSearchQuery.toLowerCase())),
  )

  const addToCart = (product: Product) => {
    // Validate caja is open
    if (caja.estado !== "ABIERTA") {
      alert("La caja debe estar abierta para crear pedidos")
      return
    }

    const existingItem = cart.find((item) => item.product.id === product.id)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
            : item,
        ),
      )
    } else {
      setCart([...cart, { product, quantity: 1, subtotal: product.price }])
    }
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.product.id === productId) {
            const newQuantity = item.quantity + delta
            return newQuantity > 0
              ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.product.price }
              : null
          }
          return item
        })
        .filter((item): item is OrderItem => item !== null),
    )
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const updateNotes = (productId: string, notes: string) => {
    setCart(cart.map((item) => (item.product.id === productId ? { ...item, notes } : item)))
  }

  const updateDestino = (productId: string, destino: "MESA" | "LLEVAR") => {
    setCart(cart.map((item) => (item.product.id === productId ? { ...item, destino } : item)))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const clearCart = () => {
    setCart([])
    setTableNumber("")
    setOrderType("MESA")
  }

  const handleSaveOrder = (metodo_pago?: "EFECTIVO" | "QR", estado_pago: "PAGADO" | "SIN_PAGAR" = "PAGADO") => {
    if (caja.estado !== "ABIERTA") {
      alert("La caja debe estar abierta para crear pedidos")
      return
    }

    if (cart.length === 0) {
      alert("Agregue productos al pedido")
      return
    }

    if (orderType === "MESA" && !tableNumber) {
      alert("Ingrese el número de mesa")
      return
    }

    if (orderType === "MIXTO") {
      const itemsWithoutDestino = cart.filter((item) => !item.destino)
      if (itemsWithoutDestino.length > 0) {
        alert("Todos los productos deben tener un destino (Mesa o Llevar) en pedidos mixtos")
        return
      }
    }

    // Create new order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: cart,
      subtotal,
      tax,
      total,
      tipo: orderType,
      num_mesa: orderType === "MESA" || orderType === "MIXTO" ? tableNumber : undefined,
      estado_pedido: "PENDIENTE",
      estado_pago,
      metodo_pago, // Can be undefined for unpaid orders
      id_caja: caja.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setOrders([newOrder, ...orders])
    const pagoMsg = estado_pago === "PAGADO" ? `pagado con ${metodo_pago}` : "sin pagar"
    alert(`Pedido creado exitosamente (${pagoMsg})`)
    clearCart()
    setShowPaymentDialog(false)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setActiveTab("detalle")
  }

  const handleMarkReady = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, estado_pedido: "LISTO", updatedAt: new Date() } : order,
      ),
    )
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, estado_pedido: "LISTO", updatedAt: new Date() })
    }
  }

  const handleMarkPaid = (orderId: string, metodo_pago: "EFECTIVO" | "QR") => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, estado_pago: "PAGADO", metodo_pago, updatedAt: new Date() } : order,
      ),
    )
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, estado_pago: "PAGADO", metodo_pago, updatedAt: new Date() })
    }
    alert("Pedido marcado como pagado")
  }

  const handleDeleteOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (order?.estado_pago === "PAGADO") {
      alert("No se puede eliminar un pedido pagado")
      return
    }
    if (confirm("¿Está seguro de eliminar este pedido?")) {
      setOrders(orders.filter((o) => o.id !== orderId))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null)
        setActiveTab("listado")
      }
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filterEstadoPedido !== "TODOS" && order.estado_pedido !== filterEstadoPedido) return false
    if (filterEstadoPago !== "TODOS" && order.estado_pago !== filterEstadoPago) return false
    if (filterTipo !== "TODOS" && order.tipo !== filterTipo) return false
    return true
  })

  const getEstadoPedidoBadge = (estado: string) => {
    if (estado === "PENDIENTE") {
      return (
        <Badge className="bg-[#FFC700] text-black hover:bg-[#FFC700]/90">
          <Clock className="h-3 w-3 mr-1" />
          Pendiente
        </Badge>
      )
    }
    return (
      <Badge className="bg-[#418B24] hover:bg-[#418B24]/90">
        <CheckCircle className="h-3 w-3 mr-1" />
        Listo
      </Badge>
    )
  }

  const getEstadoPagoBadge = (estado: string) => {
    if (estado === "PAGADO") {
      return <Badge className="bg-[#418B24] hover:bg-[#418B24]/90">Pagado</Badge>
    }
    return (
      <Badge variant="outline" className="border-[#870903] text-[#870903]">
        Sin Pagar
      </Badge>
    )
  }

  const startEditMode = () => {
    if (selectedOrder) {
      const itemsWithDestino = selectedOrder.items.map((item) => ({
        ...item,
        destino:
          selectedOrder.tipo === "MESA"
            ? ("MESA" as const)
            : selectedOrder.tipo === "LLEVAR"
              ? ("LLEVAR" as const)
              : item.destino,
      }))
      setEditCart(itemsWithDestino)
      setEditOrderType(selectedOrder.tipo)
      setIsEditMode(true)
    }
  }

  const cancelEditMode = () => {
    setIsEditMode(false)
    setEditCart([])
    setEditSearchQuery("")
    setEditOrderType("MESA")
  }

  const addToEditCart = (product: Product) => {
    const existingItem = editCart.find((item) => item.product.id === product.id)

    if (existingItem) {
      setEditCart(
        editCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
            : item,
        ),
      )
    } else {
      const newItem: OrderItem = {
        product,
        quantity: 1,
        subtotal: product.price,
        destino: editOrderType === "MIXTO" ? undefined : editOrderType,
      }
      setEditCart([...editCart, newItem])
    }
  }

  const updateEditQuantity = (productId: string, delta: number) => {
    setEditCart(
      editCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQuantity = item.quantity + delta
            return newQuantity > 0
              ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.product.price }
              : null
          }
          return item
        })
        .filter((item): item is OrderItem => item !== null),
    )
  }

  const removeFromEditCart = (productId: string) => {
    setEditCart(editCart.filter((item) => item.product.id !== productId))
  }

  const updateEditNotes = (productId: string, notes: string) => {
    setEditCart(editCart.map((item) => (item.product.id === productId ? { ...item, notes } : item)))
  }

  const updateEditDestino = (productId: string, destino: "MESA" | "LLEVAR") => {
    const updatedCart = editCart.map((item) => (item.product.id === productId ? { ...item, destino } : item))

    // Check if we need to convert to MIXTO
    if (editOrderType !== "MIXTO") {
      const hasConflictingDestino = updatedCart.some((item) => item.destino !== editOrderType)
      if (hasConflictingDestino) {
        // Convert to MIXTO and ensure all items have destino
        setEditOrderType("MIXTO")
        const cartWithDestinos = updatedCart.map((item) => ({
          ...item,
          destino: item.destino || editOrderType,
        }))
        setEditCart(cartWithDestinos)
        return
      }
    }

    setEditCart(updatedCart)
  }

  const saveEditedOrder = () => {
    if (!selectedOrder || editCart.length === 0) {
      alert("El pedido debe tener al menos un producto")
      return
    }

    if (editOrderType === "MIXTO") {
      const itemsWithoutDestino = editCart.filter((item) => !item.destino)
      if (itemsWithoutDestino.length > 0) {
        alert("Todos los productos deben tener un destino (Mesa o Llevar) en pedidos mixtos")
        return
      }
    }

    const editSubtotal = editCart.reduce((sum, item) => sum + item.subtotal, 0)
    const editTax = editSubtotal * TAX_RATE
    const editTotal = editSubtotal + editTax

    const updatedOrder: Order = {
      ...selectedOrder,
      tipo: editOrderType,
      items: editCart,
      subtotal: editSubtotal,
      tax: editTax,
      total: editTotal,
      updatedAt: new Date(),
    }

    setOrders(orders.map((order) => (order.id === selectedOrder.id ? updatedOrder : order)))
    setSelectedOrder(updatedOrder)
    setIsEditMode(false)
    alert(
      editOrderType !== selectedOrder.tipo
        ? `Pedido actualizado y convertido a ${editOrderType}`
        : "Pedido actualizado exitosamente",
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#870903]">Pedidos</h1>
          <p className="text-muted-foreground">Gestión de pedidos y ventas</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={caja.estado === "ABIERTA" ? "bg-[#418B24]" : "bg-gray-500"}>Caja: {caja.estado}</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="nuevo">Nuevo Pedido</TabsTrigger>
          <TabsTrigger value="listado">Listado</TabsTrigger>
          <TabsTrigger value="detalle" disabled={!selectedOrder}>
            Detalle
          </TabsTrigger>
        </TabsList>

        {/* NUEVO PEDIDO TAB */}
        <TabsContent value="nuevo" className="space-y-4">
          {caja.estado !== "ABIERTA" && (
            <Card className="border-2 border-[#870903]/5 bg-[#870903]/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-[#870903]">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-semibold">La caja debe estar abierta para crear pedidos</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Product Selection */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-2 border-[#870903]/20">
                <CardHeader>
                  <CardTitle className="text-[#870903]">Menú</CardTitle>
                  <CardDescription>Seleccione productos para agregar al pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 border-[#870903]/30"
                    />
                  </div>

                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                      {PRODUCT_CATEGORIES.map((category) => (
                        <TabsTrigger key={category} value={category} className="text-xs">
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {PRODUCT_CATEGORIES.map((category) => (
                      <TabsContent key={category} value={category} className="mt-4">
                        <ScrollArea className="h-[500px] pr-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            {filteredProducts.map((product) => (
                              <Card
                                key={product.id}
                                className="border border-border hover:border-[#870903]/40 transition-colors cursor-pointer"
                                onClick={() => addToCart(product)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {product.description}
                                      </p>
                                      <p className="text-lg font-bold text-[#418B24] mt-2">
                                        ${product.price.toFixed(2)}
                                      </p>
                                    </div>
                                    <Button size="sm" className="bg-[#418B24] hover:bg-[#418B24]/90 shrink-0">
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Cart & Checkout */}
            <div className="space-y-4">
              <Card className="border-2 border-[#870903]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#870903]">
                    <ShoppingCart className="h-5 w-5" />
                    Pedido Actual
                  </CardTitle>
                  <CardDescription>{cart.length} productos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Pedido</Label>
                    <Select value={orderType} onValueChange={(v) => setOrderType(v as "MESA" | "LLEVAR" | "MIXTO")}>
                      <SelectTrigger className="border-[#870903]/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MESA">Mesa</SelectItem>
                        <SelectItem value="LLEVAR">Para Llevar</SelectItem>
                        <SelectItem value="MIXTO">Mixto (Mesa + Llevar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(orderType === "MESA" || orderType === "MIXTO") && (
                    <div className="space-y-2">
                      <Label htmlFor="table">Número de Mesa</Label>
                      <Input
                        id="table"
                        placeholder="Ej: 5"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="border-[#870903]/30"
                      />
                    </div>
                  )}

                  <Separator />

                  <ScrollArea className="h-[300px] pr-4">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No hay productos en el pedido</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <Card key={item.product.id} className="border border-border">
                            <CardContent className="p-3 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm text-foreground">{item.product.name}</h4>
                                  <p className="text-xs text-muted-foreground">${item.product.price.toFixed(2)} c/u</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-[#870903] hover:text-[#870903]"
                                  onClick={() => removeFromCart(item.product.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>

                              {orderType === "MIXTO" && (
                                <div className="space-y-1">
                                  <Label className="text-xs">Destino:</Label>
                                  <Select
                                    value={item.destino || ""}
                                    onValueChange={(v) => updateDestino(item.product.id, v as "MESA" | "LLEVAR")}
                                  >
                                    <SelectTrigger className="h-8 text-xs border-[#870903]/30">
                                      <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="MESA">Para Mesa</SelectItem>
                                      <SelectItem value="LLEVAR">Para Llevar</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 w-7 p-0 bg-transparent"
                                    onClick={() => updateQuantity(item.product.id, -1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 w-7 p-0 bg-transparent"
                                    onClick={() => updateQuantity(item.product.id, 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <span className="text-sm font-bold text-foreground">${item.subtotal.toFixed(2)}</span>
                              </div>

                              <Textarea
                                placeholder="Notas especiales..."
                                value={item.notes || ""}
                                onChange={(e) => updateNotes(item.product.id, e.target.value)}
                                className="text-xs h-16 resize-none border-[#870903]/30"
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">IVA (16%):</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-[#418B24]">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-[#418B24] hover:bg-[#418B24]/90 text-white font-semibold"
                        disabled={
                          cart.length === 0 ||
                          ((orderType === "MESA" || orderType === "MIXTO") && !tableNumber) ||
                          caja.estado !== "ABIERTA"
                        }
                      >
                        Guardar Pedido
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Guardar Pedido</DialogTitle>
                        <DialogDescription>Seleccione el estado de pago del pedido</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Total del pedido:</p>
                          <p className="text-3xl font-bold text-[#418B24]">${total.toFixed(2)}</p>
                        </div>
                        <Separator />

                        <div className="space-y-3">
                          <h3 className="font-semibold text-sm">Estado de Pago</h3>
                          <div className="grid gap-3">
                            <Button
                              className="w-full justify-start h-auto py-4 bg-[#418B24] hover:bg-[#418B24]/90"
                              onClick={() => handleSaveOrder("EFECTIVO", "PAGADO")}
                            >
                              <Banknote className="h-5 w-5 mr-3" />
                              <div className="text-left">
                                <p className="font-semibold">Pagado - Efectivo</p>
                                <p className="text-xs opacity-90">El cliente pagó con efectivo</p>
                              </div>
                            </Button>
                            <Button
                              className="w-full justify-start h-auto py-4 bg-[#FFC700] hover:bg-[#FFC700]/90 text-black"
                              onClick={() => handleSaveOrder("QR", "PAGADO")}
                            >
                              <Smartphone className="h-5 w-5 mr-3" />
                              <div className="text-left">
                                <p className="font-semibold">Pagado - QR</p>
                                <p className="text-xs opacity-90">El cliente pagó con QR/Transferencia</p>
                              </div>
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start h-auto py-4 border-[#870903]/30 bg-transparent"
                              onClick={() => handleSaveOrder(undefined, "SIN_PAGAR")}
                            >
                              <AlertCircle className="h-5 w-5 mr-3 text-[#870903]" />
                              <div className="text-left">
                                <p className="font-semibold">Sin Pagar</p>
                                <p className="text-xs text-muted-foreground">
                                  El cliente pagará después (se definirá el método al pagar)
                                </p>
                              </div>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {cart.length > 0 && (
                    <Button variant="outline" onClick={clearCart} className="w-full border-[#870903]/30 bg-transparent">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpiar Pedido
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* LISTADO TAB */}
        <TabsContent value="listado" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#870903]">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Estado del Pedido</Label>
                  <Select value={filterEstadoPedido} onValueChange={setFilterEstadoPedido}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODOS">Todos</SelectItem>
                      <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                      <SelectItem value="LISTO">Listo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Estado de Pago</Label>
                  <Select value={filterEstadoPago} onValueChange={setFilterEstadoPago}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODOS">Todos</SelectItem>
                      <SelectItem value="PAGADO">Pagado</SelectItem>
                      <SelectItem value="SIN_PAGAR">Sin Pagar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={filterTipo} onValueChange={setFilterTipo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODOS">Todos</SelectItem>
                      <SelectItem value="MESA">Mesa</SelectItem>
                      <SelectItem value="LLEVAR">Para Llevar</SelectItem>
                      <SelectItem value="MIXTO">Mixto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#870903]">Pedidos ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Mesa</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado Pedido</TableHead>
                    <TableHead>Estado Pago</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.slice(-8)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.tipo}</Badge>
                      </TableCell>
                      <TableCell>{order.num_mesa || "-"}</TableCell>
                      <TableCell className="font-bold text-[#418B24]">${order.total.toFixed(2)}</TableCell>
                      <TableCell>{getEstadoPedidoBadge(order.estado_pedido)}</TableCell>
                      <TableCell>{getEstadoPagoBadge(order.estado_pago)}</TableCell>
                      <TableCell>{order.metodo_pago || "-"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {order.createdAt.toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.estado_pago !== "PAGADO" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleViewOrder(order)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[#870903] bg-transparent"
                                onClick={() => handleDeleteOrder(order.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DETALLE TAB */}
        <TabsContent value="detalle" className="space-y-4">
          {selectedOrder && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[#870903]">
                        Pedido #{selectedOrder.id.slice(-8)}
                        {isEditMode && <span className="text-[#FFC700] ml-2">(Editando)</span>}
                      </CardTitle>
                      <CardDescription>
                        {isEditMode ? editOrderType : selectedOrder.tipo}{" "}
                        {selectedOrder.num_mesa && `- Mesa ${selectedOrder.num_mesa}`}
                        {isEditMode && editOrderType !== selectedOrder.tipo && (
                          <Badge className="ml-2 bg-[#FFC700] text-black">Convertido a {editOrderType}</Badge>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getEstadoPedidoBadge(selectedOrder.estado_pedido)}
                      {getEstadoPagoBadge(selectedOrder.estado_pago)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isEditMode ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-muted-foreground">Fecha y Hora</Label>
                          <p className="font-medium">{selectedOrder.createdAt.toLocaleString()}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Método de Pago</Label>
                          <p className="font-medium">{selectedOrder.metodo_pago || "Sin definir"}</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold mb-3">Productos</h3>
                        <div className="space-y-2">
                          {selectedOrder.items.map((item, index) => (
                            <Card key={index} className="border">
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium">{item.product.name}</h4>
                                      {selectedOrder.tipo === "MIXTO" && item.destino && (
                                        <Badge variant="outline" className="text-xs">
                                          {item.destino === "MESA" ? "Mesa" : "Llevar"}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {item.quantity} x ${item.product.price.toFixed(2)}
                                    </p>
                                    {item.notes && (
                                      <p className="text-xs text-muted-foreground mt-1 italic">Nota: {item.notes}</p>
                                    )}
                                  </div>
                                  <p className="font-bold text-[#418B24]">${item.subtotal.toFixed(2)}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="font-medium">${selectedOrder.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">IVA (16%):</span>
                          <span className="font-medium">${selectedOrder.tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total:</span>
                          <span className="text-[#418B24]">${selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex gap-2 flex-wrap">
                        {selectedOrder.estado_pago === "SIN_PAGAR" && (
                          <Button className="bg-[#FFC700] hover:bg-[#FFC700]/90 text-black" onClick={startEditMode}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Pedido
                          </Button>
                        )}

                        {selectedOrder.estado_pedido === "PENDIENTE" && (
                          <Button
                            className="bg-[#418B24] hover:bg-[#418B24]/90"
                            onClick={() => handleMarkReady(selectedOrder.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como Listo
                          </Button>
                        )}

                        {selectedOrder.estado_pago === "SIN_PAGAR" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="bg-[#418B24] hover:bg-[#418B24]/90">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Marcar como Pagado
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Marcar como Pagado</DialogTitle>
                                <DialogDescription>Seleccione el método de pago utilizado</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">Total pagado:</p>
                                  <p className="text-3xl font-bold text-[#418B24]">${selectedOrder.total.toFixed(2)}</p>
                                </div>
                                <Separator />
                                <div className="grid gap-3">
                                  <Button
                                    className="w-full justify-start h-auto py-4 bg-[#418B24] hover:bg-[#418B24]/90"
                                    onClick={() => handleMarkPaid(selectedOrder.id, "EFECTIVO")}
                                  >
                                    <Banknote className="h-5 w-5 mr-3" />
                                    <div className="text-left">
                                      <p className="font-semibold">Efectivo</p>
                                      <p className="text-xs opacity-90">Pagado en efectivo</p>
                                    </div>
                                  </Button>
                                  <Button
                                    className="w-full justify-start h-auto py-4 bg-[#FFC700] hover:bg-[#FFC700]/90 text-black"
                                    onClick={() => handleMarkPaid(selectedOrder.id, "QR")}
                                  >
                                    <Smartphone className="h-5 w-5 mr-3" />
                                    <div className="text-left">
                                      <p className="font-semibold">QR / Transferencia</p>
                                      <p className="text-xs opacity-90">Pagado con QR</p>
                                    </div>
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {selectedOrder.estado_pago !== "PAGADO" && (
                          <Button
                            variant="outline"
                            className="text-[#870903] border-[#870903]/30 bg-transparent"
                            onClick={() => handleDeleteOrder(selectedOrder.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar Pedido
                          </Button>
                        )}
                        <Button variant="outline" onClick={() => setActiveTab("listado")}>
                          Volver al Listado
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {editOrderType === "MIXTO" && editOrderType !== selectedOrder.tipo && (
                        <Card className="border-2 border-[#FFC700] bg-[#FFC700]/10">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-[#870903]">
                              <AlertCircle className="h-5 w-5" />
                              <p className="font-semibold">
                                El pedido se convirtió a MIXTO. Asigne destino (Mesa/Llevar) a cada producto.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <div className="grid gap-6 lg:grid-cols-3">
                        {/* Product Selection for Adding Items */}
                        <div className="lg:col-span-2 space-y-4">
                          <Card className="border-2 border-[#FFC700]/50">
                            <CardHeader>
                              <CardTitle className="text-[#870903]">Agregar Productos</CardTitle>
                              <CardDescription>Seleccione productos para agregar al pedido</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Buscar productos..."
                                  value={editSearchQuery}
                                  onChange={(e) => setEditSearchQuery(e.target.value)}
                                  className="pl-9 border-[#870903]/30"
                                />
                              </div>

                              <Tabs value={editSelectedCategory} onValueChange={setEditSelectedCategory}>
                                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                                  {PRODUCT_CATEGORIES.map((category) => (
                                    <TabsTrigger key={category} value={category} className="text-xs">
                                      {category}
                                    </TabsTrigger>
                                  ))}
                                </TabsList>

                                {PRODUCT_CATEGORIES.map((category) => (
                                  <TabsContent key={category} value={category} className="mt-4">
                                    <ScrollArea className="h-[400px] pr-4">
                                      <div className="grid gap-3 sm:grid-cols-2">
                                        {editFilteredProducts.map((product) => (
                                          <Card
                                            key={product.id}
                                            className="border border-border hover:border-[#870903]/40 transition-colors cursor-pointer"
                                            onClick={() => addToEditCart(product)}
                                          >
                                            <CardContent className="p-4">
                                              <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                    {product.description}
                                                  </p>
                                                  <p className="text-lg font-bold text-[#418B24] mt-2">
                                                    ${product.price.toFixed(2)}
                                                  </p>
                                                </div>
                                                <Button
                                                  size="sm"
                                                  className="bg-[#418B24] hover:bg-[#418B24]/90 shrink-0"
                                                >
                                                  <Plus className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                      </div>
                                    </ScrollArea>
                                  </TabsContent>
                                ))}
                              </Tabs>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Edit Cart */}
                        <div className="space-y-4">
                          <Card className="border-2 border-[#FFC700]/50">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-[#870903]">
                                <ShoppingCart className="h-5 w-5" />
                                Productos del Pedido
                              </CardTitle>
                              <CardDescription>{editCart.length} productos</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <ScrollArea className="h-[400px] pr-4">
                                {editCart.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                                    <ShoppingCart className="h-12 w-12 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">No hay productos en el pedido</p>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    {editCart.map((item) => (
                                      <Card key={item.product.id} className="border border-border">
                                        <CardContent className="p-3 space-y-2">
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                              <h4 className="font-medium text-sm text-foreground">
                                                {item.product.name}
                                              </h4>
                                              <p className="text-xs text-muted-foreground">
                                                ${item.product.price.toFixed(2)} c/u
                                              </p>
                                            </div>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="h-6 w-6 p-0 text-[#870903] hover:text-[#870903]"
                                              onClick={() => removeFromEditCart(item.product.id)}
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>

                                          {editOrderType === "MIXTO" ? (
                                            <div className="space-y-1">
                                              <Label className="text-xs">Destino:</Label>
                                              <Select
                                                value={item.destino || ""}
                                                onValueChange={(v) =>
                                                  updateEditDestino(item.product.id, v as "MESA" | "LLEVAR")
                                                }
                                              >
                                                <SelectTrigger className="h-8 text-xs border-[#870903]/30">
                                                  <SelectValue placeholder="Seleccionar..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="MESA">Para Mesa</SelectItem>
                                                  <SelectItem value="LLEVAR">Para Llevar</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          ) : (
                                            <div className="space-y-1">
                                              <Label className="text-xs">Destino:</Label>
                                              <Select
                                                value={item.destino || editOrderType}
                                                onValueChange={(v) =>
                                                  updateEditDestino(item.product.id, v as "MESA" | "LLEVAR")
                                                }
                                              >
                                                <SelectTrigger className="h-8 text-xs border-[#870903]/30">
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="MESA">Para Mesa</SelectItem>
                                                  <SelectItem value="LLEVAR">Para Llevar</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          )}

                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 w-7 p-0 bg-transparent"
                                                onClick={() => updateEditQuantity(item.product.id, -1)}
                                              >
                                                <Minus className="h-3 w-3" />
                                              </Button>
                                              <span className="text-sm font-medium w-8 text-center">
                                                {item.quantity}
                                              </span>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 w-7 p-0 bg-transparent"
                                                onClick={() => updateEditQuantity(item.product.id, 1)}
                                              >
                                                <Plus className="h-3 w-3" />
                                              </Button>
                                            </div>
                                            <span className="text-sm font-bold text-foreground">
                                              ${item.subtotal.toFixed(2)}
                                            </span>
                                          </div>

                                          <Textarea
                                            placeholder="Notas especiales..."
                                            value={item.notes || ""}
                                            onChange={(e) => updateEditNotes(item.product.id, e.target.value)}
                                            className="text-xs h-16 resize-none border-[#870903]/30"
                                          />
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                )}
                              </ScrollArea>

                              <Separator />

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Subtotal:</span>
                                  <span className="font-medium">
                                    ${editCart.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">IVA (16%):</span>
                                  <span className="font-medium">
                                    ${(editCart.reduce((sum, item) => sum + item.subtotal, 0) * TAX_RATE).toFixed(2)}
                                  </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                  <span>Total:</span>
                                  <span className="text-[#418B24]">
                                    $
                                    {(editCart.reduce((sum, item) => sum + item.subtotal, 0) * (1 + TAX_RATE)).toFixed(
                                      2,
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  className="flex-1 bg-[#418B24] hover:bg-[#418B24]/90"
                                  onClick={saveEditedOrder}
                                  disabled={editCart.length === 0}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Guardar Cambios
                                </Button>
                                <Button variant="outline" onClick={cancelEditMode}>
                                  Cancelar
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
