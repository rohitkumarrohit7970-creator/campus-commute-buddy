import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bus, GraduationCap, Shield, Truck, ArrowRight, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/bus';

const roleConfig = {
  student: {
    icon: GraduationCap,
    title: 'Student',
    description: 'Book seats and track your bus',
    color: 'from-blue-500 to-cyan-500',
  },
  admin: {
    icon: Shield,
    title: 'Admin',
    description: 'Manage buses, routes & drivers',
    color: 'from-purple-500 to-pink-500',
  },
  driver: {
    icon: Truck,
    title: 'Driver',
    description: 'View routes and schedules',
    color: 'from-orange-500 to-amber-500',
  },
};

const features = [
  { icon: Bus, title: 'Real-time Tracking', description: 'Track buses live on map' },
  { icon: Clock, title: 'Smart Scheduling', description: 'Accurate pickup times' },
  { icon: Users, title: 'Seat Management', description: 'First-come, first-served' },
  { icon: MapPin, title: 'Route Optimization', description: 'Efficient route planning' },
];

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password, selectedRole);
    
    if (success) {
      navigate(`/${selectedRole}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Video Background */}
      <div className="relative text-primary-foreground py-20 px-4 overflow-hidden min-h-[70vh] flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://www.youtube.com/embed/XuW9Yc6Ow2E?autoplay=1&mute=1&loop=1&playlist=XuW9Yc6Ow2E&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] min-w-full min-h-full pointer-events-none"
            style={{ border: 'none' }}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Graphic Era Campus Video"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-foreground/70" />
        </div>

        {/* Logo - Top Left */}
        <div className="absolute top-4 left-4 z-20">
          <img
            src="/images/graphic-era-logo.webp"
            alt="Graphic Era University Logo"
            className="h-12 md:h-16 w-auto brightness-0 invert"
          />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Bus className="h-5 w-5" />
              <span className="text-sm font-medium">College Bus Management System</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Campus<span className="text-accent">Ride</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Seamless bus booking, real-time tracking, and smart seat management for your campus commute
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="glass rounded-xl p-4 text-center"
              >
                <feature.icon className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-xs opacity-80">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Login Section with Campus Background */}
      <div className="relative pb-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/geu-campus.jpg"
            alt="Graphic Era University Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
        <div className="container mx-auto px-4 -mt-8 relative z-10 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="max-w-lg mx-auto shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                <TabsList className="grid grid-cols-3 mb-6">
                  {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                    const config = roleConfig[role];
                    return (
                      <TabsTrigger 
                        key={role} 
                        value={role}
                        className="flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
                      >
                        <config.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{config.title}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {(Object.keys(roleConfig) as UserRole[]).map((role) => (
                  <TabsContent key={role} value={role}>
                    <form onSubmit={handleLogin} className="space-y-4">
                      {role === 'student' && (
                        <div className="space-y-2">
                          <Label htmlFor="collegeId">College ID</Label>
                          <Input
                            id="collegeId"
                            placeholder="e.g., STU001"
                            value={collegeId}
                            onChange={(e) => setCollegeId(e.target.value)}
                            required
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={`${role}@college.edu`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full gradient-primary text-primary-foreground"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </TabsContent>
                ))}
              </Tabs>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Demo mode: Enter any credentials to explore
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
