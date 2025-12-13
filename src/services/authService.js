import firebaseConfig from "./firebase";

const API_KEY = firebaseConfig.apiKey;

export const signUp = async (email, password, name) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error.message);

  // Update profile with name
  await updateProfile(data.idToken, name);

  return { ...data, displayName: name };
};

export const signIn = async (email, password) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error.message);

  return data;
};

export const updateProfile = async (idToken, displayName) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken,
        displayName,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error.message);

  return data;
};

export const getUserInfo = async (idToken) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error.message);

  return data.users[0];
};
