import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDeviconClassName(techName: string) {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  const techMap: { [key: string]: string } = {
    // JavaScript variations
    javascript: "devicon-javascript-plain",
    js: "devicon-javascript-plain",

    // TypeScript
    typescript: "devicon-typescript-plain",
    ts: "devicon-typescript-plain",

    // React
    react: "devicon-react-original",
    reactjs: "devicon-react-original",

    // Next.js
    nextjs: "devicon-nextjs-plain",
    next: "devicon-nextjs-plain",

    // Vue.js
    vue: "devicon-vuejs-plain",
    vuejs: "devicon-vuejs-plain",

    // Angular
    angular: "devicon-angular-plain",

    // Svelte
    svelte: "devicon-svelte-plain",

    // Node.js
    nodejs: "devicon-nodejs-plain",
    node: "devicon-nodejs-plain",

    // Bun.js
    bun: "devicon-bun-plain",
    bunjs: "devicon-bun-plain",

    // Deno.js
    deno: "devicon-denojs-original",
    denojs: "devicon-denojs-plain",

    // Python
    python: "devicon-python-plain",

    // Java
    java: "devicon-java-plain",

    // C++
    "c++": "devicon-cplusplus-plain",
    cpp: "devicon-cplusplus-plain",

    // C#
    "c#": "devicon-csharp-plain",
    csharp: "devicon-csharp-plain",

    // PHP
    php: "devicon-php-plain",

    // Ruby
    ruby: "devicon-ruby-plain",

    // Go
    go: "devicon-go-plain",
    golang: "devicon-go-plain",

    // Swift
    swift: "devicon-swift-plain",

    // Kotlin
    kotlin: "devicon-kotlin-plain",

    // HTML
    html: "devicon-html5-plain",
    html5: "devicon-html5-plain",

    // CSS
    css: "devicon-css3-plain",
    css3: "devicon-css3-plain",

    // Git
    git: "devicon-git-plain",

    // Docker
    docker: "devicon-docker-plain",

    // Kubernetes
    kubernetes: "devicon-kubernetes-plain",

    // Databases
    mongodb: "devicon-mongodb-plain",
    mongo: "devicon-mongodb-plain",
    mysql: "devicon-mysql-plain",
    postgresql: "devicon-postgresql-plain",
    postgres: "devicon-postgresql-plain",
    redis: "devicon-redis-plain",
    sqlite: "devicon-sqlite-plain",

    // Cloud & DevOps
    aws: "devicon-amazonwebservices-original",
    amazonwebservices: "devicon-amazonwebservices-original",
    gcp: "devicon-googlecloud-plain",
    googlecloud: "devicon-googlecloud-plain",
    azure: "devicon-azure-plain",

    // Styling & UI
    tailwind: "devicon-tailwindcss-original",
    tailwindcss: "devicon-tailwindcss-original",
    bootstrap: "devicon-bootstrap-plain",
    materialui: "devicon-materialui-plain",

    // Build Tools
    webpack: "devicon-webpack-plain",
    vite: "devicon-vite-plain",
    babel: "devicon-babel-plain",

    // Testing
    jest: "devicon-jest-plain",
    cypress: "devicon-cypressio-plain",

    // Other
    linux: "devicon-linux-plain",
    figma: "devicon-figma-plain",
    vscode: "devicon-vscode-plain",
  };

  return `${techMap[normalizedTech] || "devicon-devicon-plain"} colored`;
}

export function getTechDescription(techName: string): string {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  // Mapping technology names to descriptions
  const techDescriptionMap: { [key: string]: string } = {
    javascript:
      "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
    typescript:
      "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
    react:
      "React is a popular library for building fast, component-based user interfaces and web applications.",
    nextjs:
      "Next.js is a React framework for building fast, SEO-friendly, and production-grade web applications.",
    nodejs:
      "Node.js is a runtime for building fast and scalable server-side applications using JavaScript.",
    python:
      "Python is a beginner-friendly language known for its versatility and simplicity in various fields.",
    java: "Java is a versatile, cross-platform language widely used in enterprise and Android development.",
    "c++":
      "C++ is a high-performance language ideal for system programming, games, and large-scale applications.",
    git: "Git is a version control system that helps developers track changes and collaborate on code efficiently.",
    docker:
      "Docker simplifies app deployment by containerizing environments, ensuring consistency across platforms.",
    mongodb:
      "MongoDB is a flexible NoSQL database ideal for handling unstructured data and scalable applications.",
    mysql:
      "MySQL is a popular open-source relational database management system known for its stability and performance.",
    postgresql:
      "PostgreSQL is a powerful open-source SQL database known for its scalability and robustness.",
    aws: "Amazon Web Services (AWS) is a cloud computing platform that offers a wide range of services for building, deploying, and managing web and mobile applications.",
  };

  return (
    techDescriptionMap[normalizedTech] ||
    `${techName} is a technology or tool widely used in software development, providing valuable features and capabilities.`
  );
}

export const getTimeStamp = (createdAt: Date): string => {
  const date = new Date(createdAt);
  const now = new Date();

  const diffMilliseconds = now.getTime() - date.getTime();
  const diffSeconds = Math.round(diffMilliseconds / 1000);
  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  }

  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  const diffDays = Math.round(diffHours / 24);

  return `${diffDays} days ago`;
};
