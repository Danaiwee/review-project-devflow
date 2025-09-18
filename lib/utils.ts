import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { BADGE_CRITERIA } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDeviconClassName(techName: string) {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase(); // Next.js Core >> next.jscore

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

    // extra aliases for Express, Django, Flask
    express: "devicon-express-original",
    django: "devicon-django-plain",
    flask: "devicon-flask-original",
    laravel: "devicon-laravel-plain",
    spring: "devicon-spring-original",
    rails: "devicon-rails-plain",
    nestjs: "devicon-nestjs-plain",

    // databases
    cassandra: "devicon-apachecassandra-plain",
    couchdb: "devicon-couchdb-plain",
    neo4j: "devicon-neo4j-plain",
    mariadb: "devicon-mariadb-plain",
    firebase: "devicon-firebase-plain",

    // devops
    terraform: "devicon-terraform-plain",
    ansible: "devicon-ansible-plain",
    jenkins: "devicon-jenkins-line",
    gitlab: "devicon-gitlab-plain",

    // mobile
    reactnative: "devicon-react-original",
    flutter: "devicon-flutter-plain",
    ionic: "devicon-ionic-original",

    // ai/ml/data
    tensorflow: "devicon-tensorflow-original",
    pytorch: "devicon-pytorch-original",
    pandas: "devicon-pandas-original",
    numpy: "devicon-numpy-original",
    jupyter: "devicon-jupyter-plain",

    // misc tools
    jira: "devicon-jira-plain",
    postman: "devicon-postman-plain",
    graphql: "devicon-graphql-plain",
    nginx: "devicon-nginx-plain",
    apache: "devicon-apache-plain",
    prometheus: "devicon-prometheus-original",
    grafana: "devicon-grafana-original",
  };

  return `${techMap[normalizedTech] || "devicon-devicon-plain"} colored`;
}

export function getTechDescription(techName: string): string {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  // Mapping technology names to descriptions
  const techDescriptionMap: { [key: string]: string } = {
    // --- Programming Languages ---
    javascript:
      "JavaScript is the language of the web, enabling dynamic and interactive experiences.",
    typescript:
      "TypeScript adds types to JavaScript, improving scalability and developer productivity.",
    python:
      "Python is a versatile language popular in AI, web dev, automation, and data science.",
    java: "Java is widely used in enterprise software, Android development, and backend systems.",
    c: "C is a foundational language for systems programming and embedded development.",
    "c++":
      "C++ powers high-performance apps, from games to large-scale systems.",
    csharp:
      "C# is Microsoft's modern language for .NET, desktop, and game development (Unity).",
    ruby: "Ruby is known for its elegant syntax and powers the Rails web framework.",
    php: "PHP is a server-side scripting language commonly used in web development.",
    go: "Go (Golang) is efficient and concurrent, great for scalable systems and APIs.",
    rust: "Rust ensures memory safety and high performance, widely used in systems programming.",
    kotlin:
      "Kotlin is a modern, expressive language for Android and multiplatform development.",
    swift:
      "Swift is Apple’s language for building iOS, macOS, and watchOS applications.",
    dart: "Dart is optimized for UI development, powering Flutter cross-platform apps.",
    scala:
      "Scala blends object-oriented and functional programming, often used with Spark.",
    r: "R is a statistical language popular in data analysis and machine learning.",
    matlab:
      "MATLAB is used in engineering, simulations, and scientific computing.",
    perl: "Perl is a flexible language once popular for web and text processing.",
    haskell:
      "Haskell is a purely functional language focused on immutability and correctness.",
    lua: "Lua is a lightweight scripting language often embedded in games and applications.",

    // --- Web Frameworks & Libraries ---
    react: "React is a component-based library for building modern, fast UIs.",
    nextjs:
      "Next.js is a React framework with SSR, SSG, and API routes for production apps.",
    angular:
      "Angular is a full-featured web framework by Google for dynamic SPAs.",
    vue: "Vue.js is a progressive framework for building reactive user interfaces.",
    svelte:
      "Svelte compiles UI components into highly optimized vanilla JavaScript.",
    express:
      "Express.js is a fast, minimalist Node.js framework for building APIs.",
    nestjs:
      "NestJS is a scalable Node.js framework with TypeScript and modular design.",
    spring:
      "Spring Boot simplifies Java backend development with ready-to-use tools.",
    django:
      "Django is a Python web framework that emphasizes speed and clean design.",
    flask:
      "Flask is a lightweight Python web framework ideal for APIs and microservices.",
    rubyrails:
      "Ruby on Rails accelerates web development with conventions and productivity.",
    laravel:
      "Laravel is a PHP framework with elegant syntax and built-in features.",
    fastapi:
      "FastAPI is a modern, fast Python framework for APIs with async support.",
    astro: "Astro is a modern static site generator optimized for performance.",
    remix: "Remix is a React-based framework for full-stack web applications.",

    // --- Databases ---
    mongodb:
      "MongoDB is a NoSQL database that stores flexible JSON-like documents.",
    mysql:
      "MySQL is a relational database known for reliability and ease of use.",
    postgresql:
      "PostgreSQL is a powerful open-source relational database with rich features.",
    redis:
      "Redis is an in-memory key-value store used for caching and fast operations.",
    sqlite:
      "SQLite is a lightweight, file-based database popular in mobile apps.",
    cassandra:
      "Apache Cassandra is a NoSQL database designed for high scalability.",
    firestore: "Cloud Firestore is Google’s NoSQL database for realtime apps.",
    dynamodb: "DynamoDB is AWS’s fully managed NoSQL database.",
    elasticsearch:
      "Elasticsearch is a search and analytics engine for big data.",

    // --- Cloud & DevOps ---
    aws: "AWS is a cloud platform with computing, storage, and AI services.",
    azure:
      "Azure is Microsoft’s cloud platform for enterprises and developers.",
    gcp: "Google Cloud Platform offers scalable services for computing and data.",
    docker: "Docker packages apps into portable containers for consistency.",
    kubernetes: "Kubernetes orchestrates containerized applications at scale.",
    terraform:
      "Terraform is infrastructure-as-code for automating cloud resources.",
    jenkins: "Jenkins is an automation server for CI/CD pipelines.",
    githubactions:
      "GitHub Actions automates workflows and CI/CD inside GitHub.",
    gitlab: "GitLab offers DevOps lifecycle tools with built-in CI/CD.",
    circleci: "CircleCI automates builds, testing, and deployment.",
    ansible: "Ansible automates infrastructure provisioning and configuration.",

    // --- Tools & Version Control ---
    git: "Git is a distributed version control system for tracking changes.",
    github:
      "GitHub is a code hosting platform with collaboration and CI/CD tools.",
    gitlabtool: "GitLab is a self-hosted Git platform with DevOps tools.",
    bitbucket:
      "Bitbucket is Atlassian’s Git-based source code management tool.",
    vscode: "Visual Studio Code is a popular, lightweight code editor.",
    intellij: "IntelliJ IDEA is a powerful IDE for JVM-based languages.",
    eclipse: "Eclipse is a classic open-source IDE, widely used for Java.",
    postman: "Postman is a collaboration tool for testing APIs.",
    swagger:
      "Swagger (OpenAPI) is a framework for documenting and testing APIs.",
    eslint: "ESLint helps maintain code quality with linting rules.",
    prettier: "Prettier formats code consistently across projects.",

    // --- Mobile & Cross-Platform ---
    reactnative:
      "React Native builds native mobile apps using React and JavaScript.",
    flutter: "Flutter is Google’s UI framework for cross-platform mobile apps.",
    ionic: "Ionic builds hybrid apps using web technologies.",
    xamarin: "Xamarin builds cross-platform apps with .NET and C#.",

    // --- AI / ML ---
    tensorflow:
      "TensorFlow is an open-source library for machine learning and deep learning.",
    pytorch:
      "PyTorch is a flexible deep learning framework popular in research and production.",
    scikitlearn:
      "Scikit-learn is a Python library for machine learning and data mining.",
    keras:
      "Keras is a high-level deep learning API running on top of TensorFlow.",
    opencv: "OpenCV is a library for computer vision and image processing.",
    huggingface: "Hugging Face provides transformers and NLP tools.",

    // --- Testing ---
    jest: "Jest is a JavaScript testing framework with great developer experience.",
    mocha: "Mocha is a flexible JavaScript test framework.",
    chai: "Chai is an assertion library often used with Mocha.",
    jasmine: "Jasmine is a BDD testing framework for JavaScript.",
    playwright: "Playwright automates browser testing with modern APIs.",
    cypress: "Cypress is a JavaScript framework for fast end-to-end testing.",

    // --- Others ---
    graphql:
      "GraphQL is a query language for APIs, enabling efficient data fetching.",
    restapi: "REST API is an architectural style for building web services.",
    websocket:
      "WebSockets enable real-time, two-way communication between client and server.",
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

export function processJobTitle(title: string | undefined | null): string {
  // Check if title is undefined or null
  if (title === undefined || title === null) {
    return "No Job Title";
  }

  // Split the title into words
  const words = title.split(" ");

  // Filter out undefined or null and other unwanted words
  const validWords = words.filter((word) => {
    return (
      word !== undefined &&
      word !== null &&
      word.toLowerCase() !== "undefined" &&
      word.toLowerCase() !== "null"
    );
  });

  // If no valid words are left, return the general title
  if (validWords.length === 0) {
    return "No Job Title";
  }

  // Join the valid words to create the processed title
  const processedTitle = validWords.join(" ");

  return processedTitle;
}

export function formatNumber(number: number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
}

export function assignBadges(params: {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}) {
  const badgesCounts: Badges = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgesLevels = BADGE_CRITERIA[type];

    Object.keys(badgesLevels).forEach((level) => {
      if (count >= badgesLevels[level as keyof typeof badgesLevels]) {
        badgesCounts[level as keyof Badges] += 1;
      }
    });
  });

  return badgesCounts;
}
