

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { BackgroundPaths } from '../components/BackgroundPaths';

const LandingPage = () => {
  const navigate = ReactRouterDOM.useNavigate();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <BackgroundPaths
      title="Lumina"
      subtitle="Your potential, illuminated."
      buttonText={'Get Started'}
      onButtonClick={handleNavigateToLogin}
    />
  );
};

export default LandingPage;