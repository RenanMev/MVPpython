import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'

interface Order {
  id: number
  customer: string
  address: string
  product: string
  status: string
}

interface Product {
  id: number
  name: string
  available: boolean
}

export const Home: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [openOrderDialog, setOpenOrderDialog] = useState(false)
  const [openProductDialog, setOpenProductDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [newOrder, setNewOrder] = useState({ customer: '', address: '', product: '', status: 'On the way' })
  const [newProduct, setNewProduct] = useState({ name: '', price: '', available: true })

  useEffect(() => {
    axios.get('http://localhost:5000/orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error))

    axios.get('http://localhost:5000/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error))
  }, [])

  const handleOpenOrderDialog = (order?: Order) => {
    if (order) {
      setNewOrder(order)
      setCurrentOrder(order)
      setIsEditing(true)
    } else {
      setNewOrder({ customer: '', address: '', product: '', status: 'On the way' })
      setIsEditing(false)
    }
    setOpenOrderDialog(true)
  }

  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false)
    setCurrentOrder(null)
  }

  const handleOpenProductDialog = () => {
    setNewProduct({ name: '', price: '', available: true })
    setOpenProductDialog(true)
  }

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    window.location.href = '/'
  }

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value })
  }

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "price") {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue) && numericValue >= 0) {
        setNewProduct({ ...newProduct, [name]: value }); 
      } else {
        setNewProduct({ ...newProduct, [name]: "" });
      }
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };
  

  const handleOrderStatusChange = (value: string) => {
    setNewOrder({ ...newOrder, status: value })
  }

  const handleProductStatusChange = (value: string) => {
    setNewProduct({ ...newProduct, available: value === 'true' })
  }

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && currentOrder) {
      axios.put(`http://localhost:5000/orders/${currentOrder.id}`, newOrder)
        .then(response => {
          setOrders(orders.map(order => (order.id === currentOrder.id ? response.data : order)))
          handleCloseOrderDialog()
        })
        .catch(error => console.error('Error updating order:', error))
    } else {
      axios.post('http://localhost:5000/orders', newOrder)
        .then(response => {
          setOrders([...orders, response.data])
          handleCloseOrderDialog()
        })
        .catch(error => console.error('Error creating order:', error))
    }
  }

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    axios.post('http://localhost:5000/products', newProduct)
      .then(response => {
        setProducts([...products, response.data])
        handleCloseProductDialog()
      })
      .catch(error => console.error('Error creating product:', error))
  }

  const handleDeleteOrder = (orderId: number) => {
    axios.delete(`http://localhost:5000/orders/${orderId}`)
      .then(() => {
        setOrders(orders.filter(order => order.id !== orderId))
      })
      .catch(error => console.error('Error deleting order:', error))
  }

  return (
    <div className="p-6  min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Gerenciador de pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4 space-x-2">
              <Dialog open={openOrderDialog} onOpenChange={setOpenOrderDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenOrderDialog()}>+ Novo Pedido</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar pedido' : 'Novo Pedido'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="customer">Nome do Cliente</Label>
                      <Input
                        id="customer"
                        name="customer"
                        value={newOrder.customer}
                        onChange={handleOrderChange}
                        placeholder="Nome do Cliente"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        name="address"
                        value={newOrder.address}
                        onChange={handleOrderChange}
                        placeholder="Endereço"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="product">Produto</Label>
                      <Select onValueChange={(value: string) => setNewOrder({ ...newOrder, product: value })} defaultValue={newOrder.product}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.filter(p => p.available).map((product) => (
                            <SelectItem key={product.id} value={product.name}>{product.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select onValueChange={handleOrderStatusChange} defaultValue={newOrder.status}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preparo">Em preparo</SelectItem>
                          <SelectItem value="envio">Em Envio</SelectItem>
                          <SelectItem value="Entregue">Entregue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCloseOrderDialog}>Cancel</Button>
                      <Button type="submit">{isEditing ? 'Save' : 'Add'}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog open={openProductDialog} onOpenChange={setOpenProductDialog}>
                <DialogTrigger asChild>
                  <Button onClick={handleOpenProductDialog}>+ Novo produto</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Produto</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome do produto</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleProductChange}
                        placeholder="Nome do produto"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Preço</Label>
                      <Input
                        id="price"
                        name="price"
                        value={newProduct.price}
                        onChange={handleProductChange}
                        placeholder="preço"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="available">Disponibilidade</Label>
                      <Select onValueChange={handleProductStatusChange} defaultValue={newProduct.available.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Disponivel</SelectItem>
                          <SelectItem value="false">Não Disponivel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCloseProductDialog}>cancelar</Button>
                      <Button type="submit">Adicionar</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'Delivered' ? 'success' : 'warning'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" className="mr-2" onClick={() => handleOpenOrderDialog(order)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDeleteOrder(order.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Button variant="destructive" className="mt-4" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  )
}
