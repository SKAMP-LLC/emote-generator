import { HelmetOptions } from "helmet";
import path from "path";

export const blueprintPath = path.resolve(`${__dirname}`, "../assets/blueprints");

export const emotePath = path.resolve(`${__dirname}`, "../assets/emotes");

export const cachePath = path.resolve(`${__dirname}`, "../assets/emotes/cache");

export const environment = process.env.NODE_ENV;

export const port = 4000;

export const rateLimitOptions = {
  max: 5000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests."
};

export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "img-src": ["'self'"],
      "script-src": null,
      "style-src": ["'self'"],
      "script-src-attr": null
    }
  },
  crossOriginResourcePolicy: {
    policy: "cross-origin"
  }
} as HelmetOptions;

export const payloadLimit = { limit: "10kb" };
