import User from "../models/User.js";
import passport from "passport";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const renderSignUpForm = (req, res) => res.render("auth/signup");

export const signup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }

  if (password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }

  if (errors.length > 0) {
    return res.render("auth/signup", {
      errors,
      name,
      email,
      password,
      confirm_password,
    });
  }

  // Look for email coincidence
  const userFound = await User.findOne({ email: email });
  if (userFound) {
    req.flash("error_msg", "The Email is already in use.");
    return res.redirect("/auth/signup");
  }

  // Saving a New User
  const newUser = new User({ name, email, password });
  newUser.password = await newUser.encryptPassword(password);
  await newUser.save();
  req.flash("success_msg", "You are registered.");
  res.redirect("/auth/signin");
};

export const renderSigninForm = (req, res) => res.render("auth/signin");

export const signin = passport.authenticate("local", {
  successRedirect: "/notes",
  failureRedirect: "/auth/signin",
  failureFlash: true,
});

export const logout = async (req, res, next) => {
  await req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "You are logged out now.");
    res.redirect("/auth/signin");
  });
};

// -----------------------------------
// Nuevo método para crear cuenta Stripe Connect y obtener link onboarding

export const createStripeAccount = async (req, res) => {
  try {
    const user = req.user;

    // Crear cuenta de Stripe
    const account = await stripe.accounts.create({
      type: "express",
      country: "ES",
      email: user.email,
      business_type: "individual",
      business_profile: {
        product_description: "Venta de capítulos y contenido literario",
        support_url: "https://groviie.com"
      },
      individual: {
        first_name: user.name, // O pídele el nombre completo después
      },
    });

    // Guardar el ID de Stripe en el usuario
    user.stripe_account_id = account.id;
    await user.save();

    // Crear link de onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `http://localhost:4000/auth/stripe/account`,
      return_url: `http://localhost:4000/auth/stripe/complete`,
      type: "account_onboarding",
    });

    res.redirect(accountLink.url);
  } catch (err) {
    console.error("🚨 Stripe Error:", err); // <-- AGREGA ESTO
    res.status(500).json({ message: "Something went wrong creating Stripe account" });
  }
};

export const stripeOnboardingComplete = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.stripe_account_id) {
      req.flash("error_msg", "No se encontró la cuenta Stripe asociada.");
      return res.redirect("/notes");
    }

    // Verificamos el estado real de la cuenta
    const account = await stripe.accounts.retrieve(user.stripe_account_id);

    if (account.charges_enabled) {
      res.render("auth/onboarding-complete", { account });
    } else {
      res.render("auth/onboarding-pending", { account });
    }
  } catch (err) {
    console.error("Error verificando cuenta Stripe:", err);
    req.flash("error_msg", "Ocurrió un error al verificar tu cuenta Stripe.");
    res.redirect("/notes");
  }
};


export const regenerateOnboardingLink = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.stripe_account_id) {
      req.flash("error_msg", "No se encontró la cuenta Stripe asociada.");
      return res.redirect("/notes");
    }

    const accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: "https://tusitio.com/stripe/refresh",
      return_url: "https://tusitio.com/stripe/success",
      type: "account_onboarding",
    });

    res.redirect(accountLink.url);
  } catch (err) {
    console.error("Error generando link de onboarding:", err);
    req.flash("error_msg", "No se pudo generar el enlace de Stripe.");
    res.redirect("/notes");
  }
};
