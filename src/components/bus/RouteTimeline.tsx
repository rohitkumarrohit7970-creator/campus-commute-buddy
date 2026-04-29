import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowDown, ArrowUp } from 'lucide-react';
import { Stop } from '@/types/bus';

interface RouteTimelineProps {
  stops: Stop[];
  dropTime: string;
  startTime?: string;
  direction?: 'to_college' | 'from_college';
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({ stops, dropTime, startTime, direction = 'to_college' }) => {
  const isFromCollege = direction === 'from_college';

  return (
    <div className="relative">
      {/* Starting point for from_college */}
      {isFromCollege && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-4 pb-6"
        >
          <div className="relative flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-success-foreground">
              <ArrowUp className="h-5 w-5" />
            </div>
            <div className="flex-1 w-0.5 bg-border mt-2">
              <motion.div className="w-full bg-success" initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ duration: 0.5 }} />
            </div>
          </div>
          <div className="flex-1 pt-1.5">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-success" />
              <h4 className="font-medium text-success">GEU Campus</h4>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Departs at {startTime || '16:00'}</span>
            </div>
          </div>
        </motion.div>
      )}

      {stops.map((stop, index) => (
        <motion.div
          key={stop.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: (isFromCollege ? index + 1 : index) * 0.1 }}
          className="flex gap-4 pb-6 last:pb-0"
        >
          <div className="relative flex flex-col items-center">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {isFromCollege ? index + 1 : index + 1}
            </div>
            {(isFromCollege || index < stops.length - 1) && index < stops.length - 1 && (
              <div className="flex-1 w-0.5 bg-border mt-2">
                <motion.div
                  className="w-full bg-primary"
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                />
              </div>
            )}
          </div>
          <div className="flex-1 pt-1.5">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-primary" />
              <h4 className="font-medium">{stop.name}</h4>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{isFromCollege ? 'Drop at' : 'Pickup at'} {stop.pickupTime}</span>
            </div>
          </div>
        </motion.div>
      ))}

      {/* College destination for to_college */}
      {!isFromCollege && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: stops.length * 0.1 }}
          className="flex gap-4"
        >
          <div className="relative flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-success-foreground">
              <ArrowDown className="h-5 w-5" />
            </div>
          </div>
          <div className="flex-1 pt-1.5">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-success" />
              <h4 className="font-medium text-success">GEU Campus</h4>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Drop at {dropTime}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
