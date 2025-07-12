import { Router } from "express";
import {
  renderSignUpForm,
  signup,
  renderSigninForm,
  signin,
  logout,
  createStripeAccount, 
  stripeOnboardingComplete,
  regenerateOnboardingLink
} from "../controllers/auth.controllers.js";
import { isAuthenticated } from "../helpers/auth.js"; // ya lo tienes
const router = Router();

// Routes
router.get("/auth/signup", renderSignUpForm);

router.post("/auth/signup", signup);

router.get("/auth/signin", renderSigninForm);

router.post("/auth/signin", signin);

router.get("/auth/logout", logout);

// Nueva ruta para crear la cuenta Stripe Connect y obtener link onboarding
router.post("/auth/stripe/account", isAuthenticated, createStripeAccount);

// Ruta de retorno desde Stripe después del onboarding
router.get("/auth/stripe/complete", isAuthenticated, stripeOnboardingComplete);

router.get("/stripe/onboarding", isAuthenticated, regenerateOnboardingLink);
export default router;
