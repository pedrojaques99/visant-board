'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Allow this page to be dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [selectedCache, setSelectedCache] = useState<string>('all');
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
    setUpdateStatus('Iniciando atualização do cache...');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/update-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          password,
          cacheType: selectedCache 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUpdateStatus(`Cache ${selectedCache === 'all' ? 'geral' : 'específico'} atualizado com sucesso!`);
        // Force a hard refresh of the page
        window.location.reload();
      } else {
        setUpdateStatus(data.message || 'Erro ao atualizar cache');
      }
    } catch (err) {
      setUpdateStatus('Erro ao atualizar cache');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-md mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-center">Painel Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
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
            <h2 className="text-xl font-semibold mb-4">Gerenciamento de Cache</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Selecione o tipo de cache que deseja atualizar e clique no botão abaixo.
            </p>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Tipo de Cache</label>
                <select
                  value={selectedCache}
                  onChange={(e) => setSelectedCache(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  disabled={isLoading}
                >
                  <option value="all">Todos os Caches</option>
                  <option value="coda">Cache do Coda</option>
                  <option value="images">Cache de Imagens</option>
                  <option value="metadata">Cache de Metadados</option>
                </select>
              </div>

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
                <div className={`mt-4 p-3 rounded-md ${
                  updateStatus.includes('sucesso') 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  <p className="text-sm text-center">{updateStatus}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 