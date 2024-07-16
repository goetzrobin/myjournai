import { useState } from 'react';
import { Button } from '~myjournai/components';
import AlternatingMessages from './-alternating-messages';

const Welcome = () => {
  const [isWelcomeComplete, setWelcomeComplete] = useState(localStorage.getItem('journai-welcome-complete') !== null);
  const completeWelcome = () => {
    setWelcomeComplete(true);
    localStorage.setItem('journai-welcome-complete', 'true');
  };
  const messages = ['Welcome to journai!', 'We\'re excited to have you!', 'Before we get started, we want to get to know you!', 'Ready?'];
  return <AlternatingMessages showing={isWelcomeComplete} messages={messages}>
    <Button onPress={completeWelcome}
            className="w-full animate-in slide-in-from-bottom-2 fade-in-5">Let's do it!</Button>
  </AlternatingMessages>;
};

export default Welcome;
