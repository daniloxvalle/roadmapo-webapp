import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, sendPasswordResetEmail, UserCredential, onAuthStateChanged, getAdditionalUserInfo } from 'firebase/auth'

import AppUserService from '@/services/app_user_service';
import AppUser from '@/models/app_user';
import { useLoadingStore } from '@/store/loading_store'
import { useSnackbarStore } from '@/store/snackbar_store'
import router from '@/router';

export class AuthService {

   public login(username: string, password: string) {
      useLoadingStore().isLoading = true
      signInWithEmailAndPassword(getAuth(), username, password)
         .then((userCredential) => {
            // Successfully logged in
         })
         .catch((error) => {
            useSnackbarStore().showSnackbar('error', this.authErrorMessage(error))
         }).finally(() => {
            useLoadingStore().isLoading = false
         })
   }

   public async register(username: string, password: string) {
      useLoadingStore().isLoading = true
      createUserWithEmailAndPassword(getAuth(), username, password)
         .then((userCredential) => {
            this.registerAppUser(userCredential).then((message) => {
               useSnackbarStore().showSnackbar('success', message)
               // Reload the page and show the First Product created automatically
               router.go(0)
            })
         })
         .catch((error) => {
            useSnackbarStore().showSnackbar('error', this.authErrorMessage(error))
         }).finally(() => {
            useLoadingStore().isLoading = false
         })
   }

   public signInWithGoogle() {
      useLoadingStore().isLoading = true
      const provider = new GoogleAuthProvider()
      signInWithPopup(getAuth(), provider)
         .then((userCredential) => {
            const isNewUser = getAdditionalUserInfo(userCredential)?.isNewUser
            if (isNewUser) {
               this.registerAppUser(userCredential).then((message) => {
                  useSnackbarStore().showSnackbar('success', message)
                  // Reload the page and show the First Product created automatically
                  router.go(0)
               })
            }
         }).catch((error) => {
            useSnackbarStore().showSnackbar('error', this.authErrorMessage(error))
         }).finally(() => {
            useLoadingStore().isLoading = false
         })
   }

   public forgotPassword(username: string) {
      sendPasswordResetEmail(getAuth(), username)
         .then(() => {
            useSnackbarStore().showSnackbar('success', 'Please check your e-mail to reset your password')
         })
         .catch((error) => {
            useSnackbarStore().showSnackbar('error', this.authErrorMessage(error))
         });
   }

   public runAfterToken(nextFunction: any) {
      onAuthStateChanged(getAuth(), (user) => {
         if (user) {
            user.getIdToken().then((token) => {
               // console.log(token)
               nextFunction(token)
            })
         } else {
            // Not logged in - Allow usage without authentication
            nextFunction('')
         }
      });
   }

   private async registerAppUser(userCredential: UserCredential) {
      const appUser = new AppUser()
      const appUserService: AppUserService = new AppUserService()

      if (userCredential.user.email)
         appUser.username = userCredential.user.email
      appUser.uid_firebase = userCredential.user.uid
      const token = await userCredential.user.getIdToken()

      const message = await appUserService.addAppUser(appUser, token)
      return message
   }

   private authErrorMessage(error: any): string {
      switch (error.code) {
         case 'auth/missing-email':
            return 'Enter an e-mail'

         case 'auth/invalid-email':
            return 'Invalid e-mail'

         case 'auth/user-not-found':
            return 'No account with that e-mail was found. Create account?'

         case 'auth/wrong-password':
            return 'Incorrect password'

         case 'auth/missing-password':
            return 'Enter a password'

         case 'auth/weak-password':
            return 'The password is too short'

         case 'auth/too-many-requests':
            return 'Too many requests, try again after some time'

         case 'auth/cancelled-popup-request':
            return 'Operation cancelled due to another conflicting popup being opened.'

         case 'auth/email-already-in-use':
            return 'The email address is already in use. Do you have an account? Sign in'

         case 'auth/popup-closed-by-user':
            return 'The popup has been closed before finalizing the operation'

         default:
            return error.message
      }
   }
}

export default AuthService
