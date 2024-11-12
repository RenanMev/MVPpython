import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import img from "../assets/img.jfif"

interface LoginFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleLogin: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="flex w-full max-w-4xl border">
        <div className="flex-1   rounded-l-lg shadow-lg bo">
          <Card className="h-full border-none p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Bem-vindo de volta!</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Vamos gerenciar sua lanchonete? Primeiro, acesse sua conta!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <Button type="submit" className="w-full bg-orangePrimary text-white py-2 rounded-md hover:bg-orange-700">
                  Login
                </Button>
              </form>
              <div className="mt-4 text-center text-zinc-700 text-sm">
                Não tem uma conta?{" "}
                <a href="/register" className="text-white">
                  Cadastre-se
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <img
            src={img}
            className="rounded-r-lg h-full w-full object-cover"
            alt="Imagem ilustrativa"
          />
        </div>
      </div>
    </div>
  );
};
