import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ChallengesContext } from './ChallengeContext';

interface CountdownContextData {
  minutes: number;
  seconds: number;
  hasFinished: boolean;
  isActive: boolean;
  startCountdown: () => void;
  resetCountdown: () => void;
}

type CountdownProviderProps = {
  children: ReactNode;
}

let countdownTimeout: NodeJS.Timeout;

const CountdownContext = createContext({} as CountdownContextData);

const CountdownProvider = ({ children }: CountdownProviderProps) => {

  const { startNewChallenge } = useContext(ChallengesContext);

  const waitTimeMinutes = 25

  const [time, setTime] = useState(waitTimeMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);


  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  useEffect(() => {
    if(isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000)
    } else if(isActive && time === 0) {
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, time]);

  function startCountdown() {
    setIsActive(true);
  };

  function resetCountdown() {
    clearTimeout(countdownTimeout)
    setIsActive(false);
    setTime(waitTimeMinutes * 60);
    setHasFinished(false);
  }

  return (
    <CountdownContext.Provider
      value={{
        minutes,
        seconds,
        hasFinished,
        isActive,
        startCountdown,
        resetCountdown,
      }}
    >
      {children}
    </CountdownContext.Provider>
  )
}

export { CountdownContext, CountdownProvider };