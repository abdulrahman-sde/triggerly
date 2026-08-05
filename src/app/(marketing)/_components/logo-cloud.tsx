"use client";

import { motion } from "motion/react";

const brands = [
  { name: "Google Forms", src: "/assets/icons/google-form.svg" },
  { name: "HTTP", src: "/assets/icons/http-request.svg" },
  { name: "Gemini", src: "/assets/icons/gemini.svg" },
  { name: "OpenAI", src: "/assets/icons/openai.svg" },
  { name: "Discord", src: "/assets/icons/discord.svg" },
];

export function LogoCloud() {
  return (
    <div
      className="relative z-20 pb-24 pt-8"
      style={{ backgroundColor: "#09090B" }}
    >
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg text-zinc-300 mb-2"
          >
            Works with the tools you already use.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-zinc-500 mb-16"
          >
            Trigger from Google Forms, call any API, and power steps with AI.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
