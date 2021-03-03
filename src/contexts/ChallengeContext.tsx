import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import challenges from '../../challenges.json';

interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengeContextData {
  level: number;
  currentExperience: number;
  experienceToNextLevel: number;
  challengesCompleted: number;
  activeChallenge: Challenge;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
}

type ChallengesProviderProps = {
  children: ReactNode;
}

const ChallengesContext = createContext({} as ChallengeContextData);

const ChallengesProvider = ({ children }: ChallengesProviderProps) => {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);

  const [activeChallenge, setActiveChallenge] = useState(null);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  const experienceToNextLevel = useMemo(() => {
    return Math.pow((level + 1) * 4, 2);
  }, [level]);

  const levelUp = useCallback(() => {
    setLevel(level + 1);
  }, [level]);

  const startNewChallenge = useCallback(() => {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge);

    if(Notification.permission === "granted") {
      new Audio('/notification.mp3').play();
      
      new Notification("Novo desafio 🎉", {
        body: `Valendo ${challenge.amount} xp!`
      })
    }

  }, [challenges]);

  const resetChallenge = useCallback(() => {
    setActiveChallenge(null);
  }, []);

  const completeChallenge = useCallback(() => {
    if(!activeChallenge) {
      return;
    };

    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if(finalExperience >= experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel;

      levelUp();
    };

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted(challengesCompleted + 1)
  }, [
    activeChallenge,
    currentExperience,
    experienceToNextLevel,
    challengesCompleted,
  ]);

  return (
    <ChallengesContext.Provider
      value={{
        level,
        currentExperience,
        experienceToNextLevel,
        challengesCompleted,
        activeChallenge,
        levelUp,
        startNewChallenge,
        resetChallenge,
        completeChallenge,
      }}
    >
      {children}
    </ChallengesContext.Provider>
  )
}

export { ChallengesContext, ChallengesProvider }