import React from 'react';
import { motion } from 'framer-motion';
import { Bus, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BusWithDetails } from '@/types/bus';
import { cn } from '@/lib/utils';

interface BusCardProps {
  bus: BusWithDetails;
  onBook?: () => void;
  showBookButton?: boolean;
  isRecommended?: boolean;
}

export const BusCard: React.FC<BusCardProps> = ({ 
  bus, 
  onBook, 
  showBookButton = true,
  isRecommended = false 
}) => {
  const vacancyPercentage = (bus.vacantSeats / bus.capacity) * 100;
  
  const getVacancyColor = () => {
    if (vacancyPercentage > 50) return 'text-success';
    if (vacancyPercentage > 20) return 'text-warning';
    return 'text-destructive';
  };

  const getVacancyBg = () => {
    if (vacancyPercentage > 50) return 'bg-success/10';
    if (vacancyPercentage > 20) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        isRecommended && "ring-2 ring-primary shadow-glow"
      )}>
        {isRecommended && (
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
            Recommended
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl gradient-primary text-primary-foreground">
                <Bus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{bus.busNumber}</h3>
                <p className="text-sm text-muted-foreground">{bus.route?.name}</p>
              </div>
            </div>
            <Badge variant={bus.isActive ? "default" : "secondary"} className={bus.isActive ? "bg-success" : ""}>
              {bus.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{bus.route?.startTime} - {bus.route?.dropTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{bus.route?.stops.length || 0} Stops</span>
            </div>
          </div>

          <div className={cn("rounded-lg p-4 mb-4", getVacancyBg())}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className={cn("h-5 w-5", getVacancyColor())} />
                <span className="font-medium">Seat Availability</span>
              </div>
              <span className={cn("font-bold text-lg", getVacancyColor())}>
                {bus.vacantSeats}/{bus.capacity}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className={cn(
                  "h-full rounded-full",
                  vacancyPercentage > 50 ? "bg-success" : vacancyPercentage > 20 ? "bg-warning" : "bg-destructive"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${vacancyPercentage}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>

          {bus.driver && (
            <p className="text-sm text-muted-foreground mb-4">
              Driver: <span className="font-medium text-foreground">{bus.driver.name}</span>
            </p>
          )}

          {showBookButton && bus.vacantSeats > 0 && (
            <Button 
              className="w-full gradient-primary text-primary-foreground"
              onClick={onBook}
            >
              Book Seat <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          {bus.vacantSeats === 0 && (
            <Button className="w-full" variant="secondary" disabled>
              Fully Booked
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
