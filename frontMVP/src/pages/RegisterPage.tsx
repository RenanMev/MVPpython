
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate();


  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "As senhas não correspondem!",
        variant: "destructive",
      })
      return
    }
    fetch("http://127.0.0.1:5000/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Registration failed')
        }
        return res.json()
      })
      .then(() => {
        toast({
          title: "Success",
          description: "Conta criada com sucesso!",
        })
        localStorage.setItem('accessToken', "true")
        setTimeout(() => {
          navigate('/home');
        }, 500)
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Falha no registro. Tente novamente.",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Registrar</CardTitle>
          <CardDescription>Crie sua conta para começar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirme a Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-orangePrimary hover:bg-orange-800 text-white">
              Registrar
            </Button>
            <div className="mt-4 text-center text-sm">
          Ja tem uma conta?{" "}
          <a href="/" className="underline">
            Login
          </a>
        </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}