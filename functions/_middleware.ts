import { PagesFunctionArgs } from "./types";

export async function onRequest(context: PagesFunctionArgs) {
  const { next } = context;
  return next();
}
