type DemoUser = {
  firstName: string;
  fullName: string;
  imageUrl?: string;
  primaryEmailAddress?: { emailAddress: string };
};

export function useAuth() {
  return {
    isLoaded: true,
    isSignedIn: false,
    signOut: async () => {},
  };
}

export function useUser() {
  return {
    isLoaded: true,
    user: null as DemoUser | null,
  };
}
