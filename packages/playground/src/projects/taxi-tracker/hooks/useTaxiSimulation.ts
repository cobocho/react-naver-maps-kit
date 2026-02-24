import { useState, useCallback, useRef, useEffect } from "react";
import type { TaxiState, Position } from "../types";
import { generateInitialTaxis, generateBatchUpdates, calculateBearing } from "../data/mockData";

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

function interpolatePosition(from: Position, to: Position, progress: number): Position {
  return {
    lat: lerp(from.lat, to.lat, progress),
    lng: lerp(from.lng, to.lng, progress)
  };
}

interface UseTaxiSimulationOptions {
  updateInterval?: number;
  enabled?: boolean;
}

export function useTaxiSimulation(options: UseTaxiSimulationOptions = {}) {
  const { updateInterval = 1000, enabled = true } = options;

  const [taxis, setTaxis] = useState<TaxiState[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const prevStateRef = useRef<TaxiState[]>([]);

  useEffect(() => {
    const initial = generateInitialTaxis(20);
    const initialStates: TaxiState[] = initial.map((taxi) => ({
      ...taxi,
      targetPosition: taxi.position,
      animationProgress: 1
    }));
    setTaxis(initialStates);
    prevStateRef.current = initialStates;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const updatePositions = () => {
      setTaxis((currentTaxis) => {
        prevStateRef.current = currentTaxis.map((t) => ({ ...t }));
        const updates = generateBatchUpdates(currentTaxis);

        return currentTaxis.map((taxi) => {
          const update = updates.find((u) => u.id === taxi.id);
          if (!update) return taxi;

          const newHeading = update.heading ?? calculateBearing(taxi.position, update.position);

          return {
            ...taxi,
            targetPosition: update.position,
            heading: newHeading,
            speed: update.speed ?? taxi.speed,
            lastUpdate: update.timestamp,
            animationProgress: 0
          };
        });
      });

      setLastUpdate(new Date());
      startTimeRef.current = performance.now();
    };

    const intervalId = setInterval(updatePositions, updateInterval);
    updatePositions();

    return () => clearInterval(intervalId);
  }, [enabled, updateInterval]);

  useEffect(() => {
    if (!enabled || taxis.length === 0) return;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / updateInterval, 1);

      setTaxis((currentTaxis) => {
        return currentTaxis.map((taxi, index) => {
          const prevTaxi = prevStateRef.current[index];
          if (!prevTaxi || taxi.animationProgress === 1) return taxi;

          const newPosition = interpolatePosition(prevTaxi.position, taxi.targetPosition, progress);

          return {
            ...taxi,
            position: newPosition,
            animationProgress: progress
          };
        });
      });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [taxis, enabled, updateInterval, lastUpdate]);

  const reset = useCallback(() => {
    const initial = generateInitialTaxis(20);
    const initialStates: TaxiState[] = initial.map((taxi) => ({
      ...taxi,
      targetPosition: taxi.position,
      animationProgress: 1
    }));
    setTaxis(initialStates);
    prevStateRef.current = initialStates;
    setLastUpdate(new Date());
  }, []);

  return { taxis, lastUpdate, reset };
}
