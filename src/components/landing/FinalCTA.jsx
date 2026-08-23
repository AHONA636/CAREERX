import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-navy-900 px-8 py-16 text-center sm:px-16"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-10 h-56 w-56 rounded-full bg-navy-600/40 blur-3xl" />
        <h2 className="relative font-[var(--font-display)] text-3xl font-bold text-white text-balance sm:text-4xl">
          Your roadmap to placement starts with one verified skill.
        </h2>
        <p className="relative mx-auto mt-4 max-w-lg text-navy-300">
          Join CareerX today and see exactly where you stand, what stands in your way, and what to do next.
        </p>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" variant="success" iconRight={ArrowRight}>Get Started Free</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="onDark">
              Log In
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
