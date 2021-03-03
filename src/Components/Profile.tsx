import { useContext } from 'react';

import styles from '../styles/components/Profile.module.css';

import { ChallengesContext } from '../contexts/ChallengeContext';


const Profile = () => {
  const { level } = useContext(ChallengesContext);

  return (
    <div className={styles.profileContainer}>

      <img
        src="https://github.com/diogonan.png"
        alt="Diogo NaN"
      />

      <div>
        <strong>Diogo Nan</strong>
        <p>
          <img src="icons/level.svg" alt="Level"/>
          Level {level}
        </p>
      </div>

    </div>
  )
}

export { Profile };