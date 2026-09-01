'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ArcContext = createContext(null);

export function ArcProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [arc, setArc] = useState(null);
  const [checkInsMap, setCheckInsMap] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [meRes, arcRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/arc')
      ]);

      const meData = await meRes.json();
      const arcData = await arcRes.json();

      if (!meData.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(meData.user);

      if (arcData.arc) {
        setArc(arcData.arc);

        const cMap = {};
        if (arcData.arc.checkIns) {
          arcData.arc.checkIns.forEach((c) => {
            if (!cMap[c.date]) {
              cMap[c.date] = { completedIds: [], saved: true, isMissed: false };
            }
            if (c.completed) {
              cMap[c.date].completedIds.push(c.commitmentId);
            }
          });
        }
        setCheckInsMap(cMap);

        if (arcData.arc.reviews) {
          setReviews(arcData.arc.reviews);
        }
      } else {
        setArc(null);
      }

      setLoading(false);
    } catch (err) {
      console.error('ArcContext load error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveCheckIn = async (dateStr, completedIds) => {
    // Optimistic UI update
    setCheckInsMap((prev) => ({
      ...prev,
      [dateStr]: { completedIds, saved: true, isMissed: false }
    }));

    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr, completedCommitmentIds: completedIds })
      });
      const data = await res.json();
      if (data.checkIns) {
        const cMap = {};
        data.checkIns.forEach((c) => {
          if (!cMap[c.date]) {
            cMap[c.date] = { completedIds: [], saved: true, isMissed: false };
          }
          if (c.completed) {
            cMap[c.date].completedIds.push(c.commitmentId);
          }
        });
        setCheckInsMap(cMap);
      }
    } catch (err) {
      console.error('Failed to save check-in:', err);
    }
  };

  const saveReview = async (reviewData) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const data = await res.json();
      if (data.review) {
        setReviews((prev) => {
          const filtered = prev.filter((r) => r.weekNumber !== data.review.weekNumber);
          return [...filtered, data.review].sort((a, b) => a.weekNumber - b.weekNumber);
        });
      }
    } catch (err) {
      console.error('Failed to save review:', err);
    }
  };

  return (
    <ArcContext.Provider
      value={{
        user,
        setUser,
        arc,
        setArc,
        checkInsMap,
        reviews,
        loading,
        loadData,
        saveCheckIn,
        saveReview
      }}
    >
      {children}
    </ArcContext.Provider>
  );
}

export function useArc() {
  const context = useContext(ArcContext);
  if (!context) {
    throw new Error('useArc must be used within an ArcProvider');
  }
  return context;
}
