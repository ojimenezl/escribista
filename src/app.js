import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import methodOverride from "method-override";
import flash from "connect-flash";
import passport from "passport";
import morgan from "morgan";
import MongoStore from "connect-mongo";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { MONGODB_URI, PORT } from "./config.js";

import indexRoutes from "./routes/index.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import userRoutes from "./routes/auth.routes.js";
import "./config/passport.js";
import bodyParser from 'body-parser';

// Stripe
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initializations
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

// settings
app.set("port", PORT);
app.set("views", join(__dirname, "views"));

// config view engine
const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: join(app.get("views"), "layouts"),
  partialsDir: join(app.get("views"), "partials"),
  extname: ".hbs",
    helpers: {
    // Define el helper personalizado llamado 'ifEquals'
    ifEquals: function (arg1, arg2, options) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
    ifEqualsOr: function (arg1, arg2, arg3, options) {
      const condition1 = arg1 == arg2;
      const condition2 = arg3;
  
      if (condition1 || condition2) {
        return options.fn(this); // Ejecutar el bloque {{#if}}
      } else {
        return options.inverse(this); // Ejecutar el bloque {{else}}
      }
    }
    
  }
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// middlewares
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  if (req.user) {
    const user = req.user.toJSON();
    res.locals.user = user || null;
  }
  next();
});
// Middleware inline para obtener el balance de Stripe
app.use(async (req, res, next) => {
  if (req.user && req.user.stripe_account_id) {
    try {
      const balance = await stripe.balance.retrieve({
        stripeAccount: req.user.stripe_account_id,
      });

      const available = balance.available.find(b => b.currency === 'eur');
      const pending = balance.pending.find(b => b.currency === 'eur');

      res.locals.stripeBalanceAvailable = available ? (available.amount / 100).toFixed(2) : "0.00";
      res.locals.stripeBalancePending = pending ? (pending.amount / 100).toFixed(2) : "0.00";
    } catch (error) {
      console.error("Error obteniendo el saldo de Stripe:", error.message);
      res.locals.stripeBalanceAvailable = "0.00";
      res.locals.stripeBalancePending = "0.00";
    }
  } else {
    res.locals.stripeBalanceAvailable = null;
    res.locals.stripeBalancePending = null;
  }

  next();
});


// routes
app.use(indexRoutes);
app.use(userRoutes);
app.use(notesRoutes);

// static files
app.use(express.static(join(__dirname, "public")));





app.use((req, res, next) => {
  return res.status(404).render("404");
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error", {
    error,
  });
});

export default app;
