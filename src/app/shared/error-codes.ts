const firebaseErrorCodes = {
    'auth/invalid-credential': 'Wrong email or password.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-not-found': 'User not found.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/user-disabled': 'User account is disabled.',
    'auth/email-already-in-use': 'Email is already in use.',
    'auth/weak-password': 'Password is too weak.',
    'auth/operation-not-allowed': 'Operation is not allowed.',
    'auth/credential-already-in-use': 'Credential is already in use.',
    'auth/account-exists-with-different-credential': 'Account exists with different credential.',
    'auth/provider-already-linked': 'Provider is already linked to the user.',
    'auth/too-many-requests': 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.',
    // Add more error codes and their messages here
};

export default firebaseErrorCodes;