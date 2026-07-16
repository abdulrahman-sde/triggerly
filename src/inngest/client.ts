import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "triggerly",
  fetch: fetch.bind(globalThis),
});
