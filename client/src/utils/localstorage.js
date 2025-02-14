import Cookie from "js-cookie";

// Admin Token Management
export function getAdminAccessToken() {
  return localStorage.getItem('adminAccessToken');
}

export function getAdminRefreshToken() {
  return localStorage.getItem('adminRefreshToken');
}

export function setAdminAccessToken(token) {
  localStorage.setItem('adminAccessToken', token);
}

export function setAdminRefreshToken(token) {
  localStorage.setItem('adminRefreshToken', token);
}

export function LoadCookie() {
  try {
    // Retrieve tokens from cookies
    const accessToken = Cookie.get('accessToken');
    const refreshToken = Cookie.get('refreshToken');

    // Store tokens in localStorage if they exist
    if (accessToken) {
      localStorage.setItem('userAccessToken', accessToken);
    }

    if (refreshToken) {
      localStorage.setItem('userRefreshToken', refreshToken);
    }

    // Return an object with the tokens, using empty string if undefined
    return {
      accessToken: accessToken || '',
      refreshToken: refreshToken || ''
    };
  } catch (error) {
    console.error('Error loading cookies:', error);
    return {
      accessToken: '',
      refreshToken: ''
    };
  }
}

export function cleanAdminTokens() {
  localStorage.removeItem('adminAccessToken');
  localStorage.removeItem('adminRefreshToken');
}

// User Token Management
export function getUserAccessToken() {
  return localStorage.getItem('userAccessToken');
}

export function getUserRefreshToken() {
  return localStorage.getItem('userRefreshToken');
}

export function setUserAccessToken(token) {
  localStorage.setItem('userAccessToken', token);
}

export function setUserRefreshToken(token) {
  localStorage.setItem('userRefreshToken', token);
}

export function cleanUserTokens() {
  localStorage.removeItem('userAccessToken');
  localStorage.removeItem('userRefreshToken');
}

// Instructor Token Management
export function getInstructorAccessToken() {
  return localStorage.getItem('instructorAccessToken');
}

export function getInstructorRefreshToken() {
  return localStorage.getItem('instructorRefreshToken');
}

export function setInstructorAccessToken(token) {
  localStorage.setItem('instructorAccessToken', token);
}

export function setInstructorRefreshToken(token) {
  localStorage.setItem('instructorRefreshToken', token);
}

export function cleanInstructorTokens() {
  localStorage.removeItem('instructorAccessToken');
  localStorage.removeItem('instructorRefreshToken');
}
