// Static data: career roles and their required skills.
// Used by the analyzer to compare against user-entered skills.
export type Role = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  skills: string[];
};

export const ROLES: Role[] = [
  {
    id: "frontend",
    name: "Frontend Developer",
    emoji: "🎨",
    description: "Build beautiful, responsive user interfaces.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "backend",
    name: "Backend Developer",
    emoji: "⚙️",
    description: "Design APIs, databases, and server logic.",
    skills: ["Node.js", "Express", "SQL", "MongoDB", "REST APIs", "Git", "Docker", "Authentication"],
  },
  {
    id: "fullstack",
    name: "Full Stack Developer",
    emoji: "🚀",
    description: "End-to-end web development across the stack.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs", "TypeScript"],
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    emoji: "📊",
    description: "Turn data into insights and models.",
    skills: ["Python", "SQL", "Pandas", "NumPy", "Statistics", "Machine Learning", "Data Visualization", "Jupyter"],
  },
  {
    id: "ai-ml",
    name: "AI / ML Engineer",
    emoji: "🤖",
    description: "Build and deploy machine learning systems.",
    skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Math", "MLOps"],
  },
  {
    id: "cyber",
    name: "Cybersecurity Analyst",
    emoji: "🛡️",
    description: "Protect systems, detect and respond to threats.",
    skills: ["Networking", "Linux", "Cryptography", "SIEM", "Penetration Testing", "Risk Assessment", "Python", "Security Tools"],
  },
  {
    id: "cloud",
    name: "Cloud Engineer",
    emoji: "☁️",
    description: "Architect scalable cloud infrastructure.",
    skills: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Networking"],
  },
];

// Predefined learning suggestions keyed by skill (case-insensitive lookup).
export const LEARNING_SUGGESTIONS: Record<string, { title: string; resource: string; url: string }[]> = {
  react: [
    { title: "React Official Tutorial", resource: "react.dev", url: "https://react.dev/learn" },
    { title: "Build 5 React Projects", resource: "freeCodeCamp", url: "https://www.freecodecamp.org/news/tag/react/" },
  ],
  javascript: [
    { title: "JavaScript.info Modern Guide", resource: "javascript.info", url: "https://javascript.info/" },
    { title: "MDN JS Reference", resource: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  ],
  typescript: [
    { title: "TypeScript Handbook", resource: "typescriptlang.org", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
  ],
  python: [
    { title: "Python for Everybody", resource: "Coursera", url: "https://www.coursera.org/specializations/python" },
    { title: "Real Python Tutorials", resource: "realpython.com", url: "https://realpython.com/" },
  ],
  sql: [
    { title: "SQLBolt Interactive Lessons", resource: "sqlbolt.com", url: "https://sqlbolt.com/" },
    { title: "Mode SQL Tutorial", resource: "Mode", url: "https://mode.com/sql-tutorial/" },
  ],
  "machine learning": [
    { title: "Andrew Ng's ML Course", resource: "Coursera", url: "https://www.coursera.org/learn/machine-learning" },
    { title: "Hands-On ML with Scikit-Learn", resource: "Book", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/" },
  ],
  tensorflow: [
    { title: "TensorFlow Beginner Quickstart", resource: "tensorflow.org", url: "https://www.tensorflow.org/tutorials/quickstart/beginner" },
    { title: "Deep Learning Specialization", resource: "Coursera", url: "https://www.coursera.org/specializations/deep-learning" },
  ],
  pytorch: [
    { title: "PyTorch 60-Minute Blitz", resource: "pytorch.org", url: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html" },
  ],
  "deep learning": [
    { title: "Deep Learning Specialization", resource: "Coursera", url: "https://www.coursera.org/specializations/deep-learning" },
  ],
  docker: [
    { title: "Docker Get Started", resource: "docs.docker.com", url: "https://docs.docker.com/get-started/" },
  ],
  kubernetes: [
    { title: "Kubernetes Basics", resource: "kubernetes.io", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" },
  ],
  aws: [
    { title: "AWS Cloud Practitioner", resource: "AWS Training", url: "https://aws.amazon.com/training/learn-about/cloud-practitioner/" },
  ],
  git: [
    { title: "Pro Git Book", resource: "git-scm.com", url: "https://git-scm.com/book/en/v2" },
  ],
};

export const DEFAULT_SUGGESTION = (skill: string) => [
  {
    title: `Learn ${skill} Fundamentals`,
    resource: "Search on YouTube",
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " tutorial")}`,
  },
  {
    title: `${skill} on freeCodeCamp`,
    resource: "freeCodeCamp",
    url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skill)}`,
  },
];

// Community poll seed data — engagement element on the dashboard.
export const POLLS = [
  {
    id: "trending",
    question: "Which skill should I learn next in 2026?",
    options: [
      { label: "AI / LLMs", votes: 412 },
      { label: "Rust", votes: 187 },
      { label: "Kubernetes", votes: 156 },
      { label: "TypeScript", votes: 298 },
    ],
  },
];
