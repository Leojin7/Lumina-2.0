

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StudySquad, SquadMember, CurrentUser } from '../types';
import { useUserStore } from './useUserStore';
import { encrypt } from '../services/encryptionService';

interface SquadState {
  squads: StudySquad[];
  createSquad: (name: string, topic: string) => StudySquad | null;
  joinSquad: (squadId: string) => boolean;
  joinSquadByCode: (code: string) => StudySquad | null;
  leaveSquad: (squadId: string) => void;
  getSquadById: (squadId: string) => StudySquad | undefined;
  sendMessage: (squadId: string, content: string) => void;
  postAIMessage: (squadId: string, content: string) => void;
  // Timer controls
  toggleTimer: (squadId: string) => void;
  resetTimer: (squadId: string) => void;
  decrementTimer: (squadId: string) => void;
}

const MOCK_SQUADS: StudySquad[] = [
  {
    id: 'squad-1', name: 'Late Night Study Crew', topic: 'Calculus II', hostId: 'mock-user-1',
    members: [{ uid: 'mock-user-1', displayName: 'Alex', photoURL: 'https://i.pravatar.cc/40?u=alex' }],
    messages: [], timerState: { mode: 'pomodoro', timeLeft: 25 * 60, isActive: false },
    isPrivate: false, createdAt: new Date().toISOString(), joinCode: 'CALC123'
  },
  {
    id: 'squad-2', name: 'Frontend Masters', topic: 'React & TypeScript', hostId: 'mock-user-2',
    members: [
        { uid: 'mock-user-2', displayName: 'Samantha', photoURL: 'https://i.pravatar.cc/40?u=samantha' },
        { uid: 'mock-user-3', displayName: 'Jordan', photoURL: 'https://i.pravatar.cc/40?u=jordan' },
    ],
    messages: [], timerState: { mode: 'pomodoro', timeLeft: 25 * 60, isActive: true },
    isPrivate: false, createdAt: new Date().toISOString(), joinCode: 'REACTUX'
  },
];


export const useSquadStore = create<SquadState>()(
  persist(
    (set, get) => ({
      squads: MOCK_SQUADS,
      
      getSquadById: (squadId) => get().squads.find(s => s.id === squadId),

      createSquad: (name, topic) => {
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser) return null;

        const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const newSquad: StudySquad = {
          id: `squad-${Date.now()}`,
          name,
          topic,
          hostId: currentUser.uid,
          members: [{ uid: currentUser.uid, displayName: currentUser.displayName || 'User', photoURL: currentUser.photoURL || `https://i.pravatar.cc/40?u=${currentUser.uid}` }],
          messages: [],
          timerState: { mode: 'pomodoro', timeLeft: 25 * 60, isActive: false },
          isPrivate: false,
          createdAt: new Date().toISOString(),
          joinCode,
        };
        set(state => ({ squads: [newSquad, ...state.squads] }));
        return newSquad;
      },
      
      joinSquad: (squadId) => {
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser) return false;

        const squad = get().getSquadById(squadId);
        if (!squad) return false;

        if (squad.members.some(m => m.uid === currentUser.uid)) return true; // Already in squad

        const newMember: SquadMember = {
            uid: currentUser.uid, 
            displayName: currentUser.displayName || 'User', 
            photoURL: currentUser.photoURL || `https://i.pravatar.cc/40?u=${currentUser.uid}`
        };

        set(state => ({
          squads: state.squads.map(s => s.id === squadId ? { ...s, members: [...s.members, newMember] } : s),
        }));
        return true;
      },
      
      joinSquadByCode: (code) => {
        const squad = get().squads.find(s => s.joinCode === code.toUpperCase());
        if (!squad) {
            return null;
        }
        const success = get().joinSquad(squad.id);
        return success ? squad : null;
      },

      leaveSquad: (squadId) => {
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser) return;
        
        set(state => ({
          squads: state.squads.map(s => 
            s.id === squadId 
            ? { ...s, members: s.members.filter(m => m.uid !== currentUser.uid) } 
            : s
          ).filter(s => s.members.length > 0) // Remove squad if it becomes empty
        }));
      },
      
      sendMessage: (squadId, content) => {
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser) return;

        const author: SquadMember = {
            uid: currentUser.uid, 
            displayName: currentUser.displayName || 'User', 
            photoURL: currentUser.photoURL || `https://i.pravatar.cc/40?u=${currentUser.uid}`
        };

        const newMessage = {
            id: `msg-${Date.now()}`,
            author,
            content: encrypt(content),
            timestamp: new Date().toISOString(),
        }

        set(state => ({
            squads: state.squads.map(s => s.id === squadId ? { ...s, messages: [...s.messages, newMessage] } : s)
        }));
      },

      postAIMessage: (squadId, content) => {
          const aiAuthor: SquadMember = {
              uid: 'lumina-ai-observer',
              displayName: 'AI Observer',
              photoURL: '', // No avatar for AI
          };
          const aiMessage = {
              id: `ai-msg-${Date.now()}`,
              author: aiAuthor,
              content, // AI messages are not encrypted
              timestamp: new Date().toISOString(),
              isAIMessage: true,
          };
          set(state => ({
              squads: state.squads.map(s => s.id === squadId ? {...s, messages: [...s.messages, aiMessage] } : s)
          }));
      },

      // Timer controls
      toggleTimer: (squadId: string) => {
        const currentUser = useUserStore.getState().currentUser;
        const squad = get().getSquadById(squadId);
        if (!currentUser || !squad || squad.hostId !== currentUser.uid) return; // Only host can control timer

        set(state => ({
          squads: state.squads.map(s => s.id === squadId 
            ? { ...s, timerState: { ...s.timerState, isActive: !s.timerState.isActive } } 
            : s
          ),
        }));
      },

      resetTimer: (squadId: string) => {
        const currentUser = useUserStore.getState().currentUser;
        const squad = get().getSquadById(squadId);
        if (!currentUser || !squad || squad.hostId !== currentUser.uid) return;

        set(state => ({
          squads: state.squads.map(s => s.id === squadId 
            ? { ...s, timerState: { ...s.timerState, timeLeft: 25 * 60, isActive: false } } 
            : s
          ),
        }));
      },
      
      decrementTimer: (squadId) => {
        set(state => {
            const squad = state.squads.find(r => r.id === squadId);
            if (!squad || squad.timerState.timeLeft <= 0) return state;
            
            const newTimeLeft = squad.timerState.timeLeft - 1;
            const newIsActive = newTimeLeft > 0 ? squad.timerState.isActive : false;
    
            return {
                squads: state.squads.map(s => s.id === squadId
                    ? { ...s, timerState: { ...s.timerState, timeLeft: newTimeLeft, isActive: newIsActive } }
                    : s
                ),
            };
        });
      },
    }),
    {
      name: 'lumina-squad-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);