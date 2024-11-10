import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  const navigate = useNavigate();
 
  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  // Log environment variables in development (remove in production)
  if (import.meta.env.DEV) {
    console.log('Auth0 Environment Variables:', {
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID
    });
  }

  // Check for environment variables with more specific error messages
  if (!import.meta.env.VITE_AUTH0_DOMAIN) {
    console.error('Missing VITE_AUTH0_DOMAIN environment variable');
    return <div>Auth0 Configuration Error: Missing domain configuration</div>;
  }

  if (!import.meta.env.VITE_AUTH0_CLIENT_ID) {
    console.error('Missing VITE_AUTH0_CLIENT_ID environment variable');
    return <div>Auth0 Configuration Error: Missing client ID configuration</div>;
  }

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;