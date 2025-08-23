![devFlow1](https://github.com/user-attachments/assets/2fa59f3d-5b6f-4fbc-a463-cb5f4f91031f)
![devFlow2](https://github.com/user-attachments/assets/2be0569f-88f8-487e-8a28-ca9b7c2f361d)


# **DevFlow – Full-Stack Developer Q&A Platform with Next.js**  

This project is a **developer community platform** inspired by **Stack Overflow**, where users can **ask questions, share answers, explore tags, and connect with other developers**. Built with a **modern full-stack approach** using **Next.js, Auth.js, MongoDB, and Tailwind CSS**, the application provides a **collaborative space for knowledge exchange** with a clean and responsive UI.

---

## **Backend & Server-Side Services**  

- **Next.js API Routes & Server Actions**:  
  - Handles **authentication flows** (OAuth & Credentials) and API integrations.  
  - Server actions provide **secure data handling** for form submissions and database updates.  

- **Auth.js (NextAuth v5 beta)**:  
  - Provides **authentication and session management**.  
  - Supports **credentials-based login** and **OAuth (Google, GitHub)**.  

- **MongoDB with Mongoose**:  
  - Stores user data, questions, answers, tags, and bookmarks.  
  - Schema-based modeling with Mongoose for reliable queries.
 
 **AI Integration (Google AI via Vercel AI SDK)**:  
  - Helps developers **improve and refine their answers**.  
  - AI does not generate answers itself, but provides **suggestions for grammar, clarity, and correctness**.  
  - Integrated using **`@ai-sdk/google` from Vercel**.   

- **Zod Validation**:  
  - Ensures **type-safe form validation**.  
  - Integrated with **React Hook Form** for robust input handling.  

- **Environment Management**:  
  - Sensitive credentials (OAuth keys, database URL, etc.) are securely managed via `.env`.  

---

## **Frontend Development**  

- **Next.js with TypeScript**:  
  - Provides **SSR, routing, and full-stack capabilities**.  

- **Tailwind CSS**:  
  - Utility-first styling for **responsive and modern UI**.  

- **shadcn/ui Components**:  
  - Accessible and reusable UI components built on **Radix UI**.
 
- **MDX Editor**:  
  - Rich-text editor supporting **Markdown and code blocks**.  
  - Used in both **question form** and **answer form** to let developers write with formatting.

- **Lucide React Icons**:  
  - Minimal and consistent icons throughout the app.  

- **Form Handling**:  
  - **React Hook Form** for form state management.  
  - **Zod** integration for schema-based validation.  

- **User Notifications**:  
  - **Sonner** toast notifications for feedback (e.g., login success, profile update).  

---

## **Application Features & Page Flow**  

### **1. Home Page**  
- Displays all **questions posted by community members**.  
- Clicking a question opens the **Question Page** with full content and answers.  

### **2. Question Page**  
- Shows the **full question details**.  
- Lists **answers submitted by other developers**.
- Includes an **AI-powered "Improve Answer" feature** to refine responses.
- Provides a **rich-text MDX editor** for writing answers with markdown & code blocks. 

### **3. Community Page**  
- Displays a list of **all registered developers** in the community.  

### **4. Collections Page**  
- Shows the user’s **saved/bookmarked questions** for quick access.  

### **5. Find Jobs Page**  
- Displays **developer job listings**.  
- Includes a **search bar** to filter jobs by keyword.  

### **6. Tags Page**  
- Displays all **technology-related tags**.  
- Clicking a tag shows **questions associated with that tag**.  

### **7. Profile Page**  
- Shows the user’s **profile information**, including:  
  - Their **questions**  
  - Their **answers**  
  - The **tags** they frequently engage with  

### **8. Ask Question Page**  
- Form for submitting new questions with **title, content, and tags**.
- Includes **MDX editor** for writing rich-text questions.

### **9. Edit Question & Edit Profile Pages**  
- Allows users to **edit existing questions** or update **profile details**.  

---

## **Technologies Used**  

- ![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=next.js&logoColor=white&style=flat) **Next.js**  
- ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat) **TypeScript**  
- ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=flat) **MongoDB + Mongoose**  
- ![Auth.js](https://img.shields.io/badge/-Auth.js-000000?logo=auth0&logoColor=white&style=flat) **Auth.js (NextAuth v5)**
- ![Google AI](https://img.shields.io/badge/-Google%20AI-4285F4?logo=google&logoColor=white&style=flat) **Google AI (via Vercel AI SDK)**
- ![TailwindCSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?logo=tailwindcss&logoColor=white&style=flat) **Tailwind CSS**  
- ![shadcn/ui](https://img.shields.io/badge/-shadcn/ui-000000?style=flat) **shadcn/ui**  
- ![Radix UI](https://img.shields.io/badge/-Radix%20UI-111111?logo=radixui&logoColor=white&style=flat) **Radix UI**  
- ![Lucide](https://img.shields.io/badge/-Lucide%20Icons-000000?logo=lucide&logoColor=white&style=flat) **Lucide React**  
- ![React Hook Form](https://img.shields.io/badge/-React%20Hook%20Form-EC5990?logo=reacthookform&logoColor=white&style=flat) **React Hook Form**  
- ![Zod](https://img.shields.io/badge/-Zod-3E64FF?logo=zod&logoColor=white&style=flat) **Zod**
- ![MDX](https://img.shields.io/badge/-MDX%20Editor-1B1F24?logo=markdown&logoColor=white&style=flat) **MDX Editor** 
- ![Sonner](https://img.shields.io/badge/-Sonner-191919?style=flat&logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCI+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIvPjwvc3ZnPg==) **Sonner**  

---

## **Conclusion**  

The **DevFlow application** delivers a modern **developer Q&A platform** with a **clean, responsive UI**, **robust authentication system**, and **AI-powered answer improvements**. With **OAuth integration, community-driven question/answer flows, tagging, job search, and AI-assisted answer refinement**, it provides developers with a **central hub for collaboration and growth**. Built with **Next.js, MongoDB, Tailwind CSS, Auth.js, and Google AI**, this project highlights **scalable full-stack development for community platforms**.
