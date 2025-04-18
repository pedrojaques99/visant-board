'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setError('Senha incorreta');
      }
    } catch (err) {
      setError('Erro ao autenticar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCache = async () => {
    setUpdateStatus('Atualizando cache...');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/update-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setUpdateStatus('Cache atualizado com sucesso!');
        router.refresh();
      } else {
        setUpdateStatus('Erro ao atualizar cache');
      }
    } catch (err) {
      setUpdateStatus('Erro ao atualizar cache');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Admin</h2>
            <p className="text-sm text-muted-foreground mt-2">Digite a senha para acessar</p>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full"
            />
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Painel Admin</h1>
          <Button
            variant="outline"
            onClick={() => setIsAuthenticated(false)}
          >
            Sair
          </Button>
        </div>

        <div className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Atualizar Cache do Coda</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Clique no botão abaixo para atualizar o cache das tabelas do Coda.
            </p>
            <Button
              onClick={handleUpdateCache}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Atualizar Cache'
              )}
            </Button>
            {updateStatus && (
              <p className={`mt-4 text-sm text-center ${
                updateStatus.includes('sucesso') ? 'text-green-500' : 'text-red-500'
              }`}>
                {updateStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 