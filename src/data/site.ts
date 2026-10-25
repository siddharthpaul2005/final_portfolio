/**
 * Site-wide config. Any value containing "PLACEHOLDER" (or left empty) still
 * needs real data — see PLACEHOLDERS.md at the repo root.
 */

export const isPlaceholder = (value?: string | null) =>
  !value || value === '#' || value.includes('PLACEHOLDER');

export const site = {
  // Live URL (also hardcoded in index.html; sitemap/robots/feed are generated from this).
  url: 'https://siddharthdev-eta.vercel.app',
  name: 'Siddharth Paul',
  shortName: 'Siddharth',
  title: 'Siddharth Paul - Software Engineer',
  description:
    'Backend and AI/ML engineer: multithreaded C++ tools, Go services over gRPC, and retrieval systems that answer in milliseconds. Open to backend SWE and AI/ML roles.',
  githubUsername: 'siddharthpaul2005',
  // Timezone drives the status-bar clock.
  city: 'Mohali',
  hometown: 'Howrah, West Bengal',
  timezone: 'Asia/Kolkata',
  // Resume PDF: drop the file at public/assets/Siddharth_Paul_Resume.pdf
  resumePath: '/assets/Siddharth_Paul_Resume.pdf',
  // Formspree form IDs are public (they appear in every form submission), so a default here is safe.
  formspreeId: import.meta.env?.VITE_FORMSPREE_FORM_ID || 'mvkkgbke', // env is undefined in Node scripts
};

export const education = {
  degree: 'B.E. Computer Science & Engineering',
  campus: 'Mohali, Punjab',
  institution: 'Chandigarh University',
  institutionUrl: 'https://www.cuchd.in/',
  years: 'Jun 2024 – May 2028',
  cgpa: '7.99 / 10',
  coursework: [
    'Data Structures & Algorithms',
    'Operating Systems',
    'Computer Networks',
    'DBMS',
    'Computer Architecture',
    'System Design',
    'Competitive Coding',
  ],
};

// Giscus blog comments — generate values at https://giscus.app for the repo.
// Comments are hidden while repoId/categoryId are empty.
export const giscus = {
  repo: 'siddharthpaul2005/siddharth-portfolio' as `${string}/${string}`,
  repoId: '',
  category: 'Blog Comments',
  categoryId: '',
};
