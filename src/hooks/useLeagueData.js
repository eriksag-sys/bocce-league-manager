import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { SEASONS } from '../logic/constants';

// Hook to sync all league data with a single Firestore document
export function useLeagueData() {
    const [data, setData] = useState({
        seasonDates: {
            spring: { start: SEASONS.spring.defaultStart, end: SEASONS.spring.defaultEnd },
            summer: { start: SEASONS.summer.defaultStart, end: SEASONS.summer.defaultEnd },
            fall:   { start: SEASONS.fall.defaultStart,   end: SEASONS.fall.defaultEnd },
        },
        holidays: { spring: [], summer: [], fall: [] },
        leagueTeams: {},
        schedules: {},
        loading: true
    });

    useEffect(() => {
        const docRef = doc(db, 'appData', 'leagueState');
        
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const docData = docSnap.data();
                setData({
                    seasonDates: docData.seasonDates || data.seasonDates,
                    holidays: docData.holidays || { spring: [], summer: [], fall: [] },
                    leagueTeams: docData.leagueTeams || {},
                    schedules: docData.schedules || {},
                    loading: false
                });
            } else {
                setData(prev => ({ ...prev, loading: false }));
            }
        }, (error) => {
            console.error("Error fetching league data:", error);
            setData(prev => ({ ...prev, loading: false }));
        });

        return () => unsubscribe();
    }, []);

    const updateLeagueData = async (updates) => {
        const docRef = doc(db, 'appData', 'leagueState');
        try {
            await setDoc(docRef, updates, { merge: true });
        } catch (error) {
            console.error("Error updating league data:", error);
            throw error;
        }
    };
    
    return {
        ...data,
        updateLeagueData
    };
}
