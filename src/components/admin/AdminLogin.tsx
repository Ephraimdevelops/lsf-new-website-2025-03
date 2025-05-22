
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => boolean;
  isLocked?: boolean;
}

const AdminLogin = ({ onLogin, isLocked = false }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState<number | null>(null);
  const { toast } = useToast();

  // If login is locked, calculate and display the remaining lock time
  useEffect(() => {
    if (!isLocked) return;
    
    const lockUntil = localStorage.getItem('admin-login-locked-until');
    if (!lockUntil) return;
    
    const lockUntilTime = parseInt(lockUntil);
    const updateRemainingTime = () => {
      const remaining = Math.ceil((lockUntilTime - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockTimeRemaining(null);
        return;
      }
      setLockTimeRemaining(remaining);
    };
    
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [isLocked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    
    setIsLoading(true);
    
    // Attempt login
    const success = onLogin(username, password);
    
    if (!success) {
      toast({
        title: "Authentication Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center font-panton">LSF Admin Dashboard</CardTitle>
          <CardDescription className="text-center font-calibri">
            Login to access the administration panel
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isLocked && lockTimeRemaining && (
              <div className="p-4 border border-red-300 bg-red-50 rounded-md flex items-center space-x-2 text-red-800">
                <AlertCircle size={16} />
                <p className="text-sm font-calibri">
                  Too many failed login attempts. Please try again in {Math.floor(lockTimeRemaining / 60)}:{(lockTimeRemaining % 60).toString().padStart(2, '0')} minutes
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium font-calibri">Username</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="font-calibri"
                disabled={isLocked}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium font-calibri">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="font-calibri"
                disabled={isLocked}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full font-calibri"
              disabled={isLoading || isLocked}
            >
              {isLoading ? "Authenticating..." : isLocked ? "Login Locked" : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
