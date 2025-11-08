# Saqr – Smart Library Assistant

Welcome to Saqr, the smart library assistant for the Emirates Falcon International Private School. This is a modern, production-ready React web application designed to enhance the library experience for students and staff.

## Features

-   **Bilingual Interface**: Full support for Arabic (RTL) and English (LTR), with a seamless language toggle.
-   **Dual Search Modes**:
    -   **Manual Search**: A responsive search interface to find books by title, author, or subject using filter dropdowns.
    -   **Smart Search**: A dedicated, full-page chat interface with "Saqr," the smart assistant, ready for future AI integration to handle complex queries.
-   **Interactive Book Details**: View book location ("Shelf" and "Row") in a clean modal.
-   **Usage Reports**: Visual charts displaying the most searched titles and most viewed books, with data tracked in `localStorage`.
-   **Modern UAE-inspired UI**: A clean, elegant design with a color palette and aesthetic inspired by the UAE's visual identity.
-   **Responsive Design**: Excellent user experience across desktops, tablets, and mobile devices.

## Tech Stack

-   **Frontend**: React 18+, Vite, TypeScript
-   **Styling**: Tailwind CSS
-   **Routing**: React Router (`HashRouter`)
-   **Charts**: Recharts

---

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

-   Node.js (v18.x or later)
-   npm (v9.x or later) or a compatible package manager like Yarn or pnpm.

### Installation

1.  Clone the repository to your local machine:
    ```sh
    git clone <your-repository-url>
    cd saqr-library-assistant
    ```

2.  Install the required NPM packages:
    ```sh
    npm install
    ```
    This will install React, React Router, Recharts, and other necessary development dependencies.

### Running the Development Server

To start the Vite development server and view the application in your browser, run:

```sh
npm run dev
```

The application will typically be available at `http://localhost:5173`. The server supports Hot Module Replacement (HMR) for a fast and efficient development experience.

---

## Future Backend Integration (`/api/chat` for Smart Search)

The "Saqr" smart search is currently a UI-only feature. It is designed to communicate with a backend endpoint for processing natural language queries.

### Placeholder Location

The API call logic will be located in:

`src/pages/SmartSearchPage.tsx`

Inside a future `handleSendMessage` function, you will implement the API call:

```typescript
// TODO: Replace with your actual backend endpoint for Groq, OpenAI, or other AI model integration.
// const response = await fetch('/api/chat', { ... });
```

### Expected API Contract

The frontend will send a `POST` request to `/api/chat` with the following JSON body structure:

```json
{
  "messages": [
    { "role": "user", "content": "Could you recommend a book about science for a 7th grader?" }
  ],
  "locale": "en" // "ar" | "en"
}
```

The backend should be configured to handle this request and stream back a response that the frontend can process.

---

## Deployment

This Vite-based React application is optimized for static site hosting platforms. Vercel is an excellent choice for easy and fast deployment.

### Deploying to Vercel

1.  **Push to a Git Repository**: Ensure your project is pushed to a GitHub, GitLab, or Bitbucket repository.

2.  **Import Project on Vercel**:
    -   Log in to your Vercel account.
    -   Click "Add New..." -> "Project".
    -   Import the Git repository containing your project.

3.  **Configure Project**:
    -   Vercel will automatically detect that you are using Vite and configure the build settings correctly. The standard settings should work out of the box:
        -   **Framework Preset**: `Vite`
        -   **Build Command**: `npm run build`
        -   **Output Directory**: `dist`
        -   **Install Command**: `npm install`
    -   You do not need to configure any environment variables for the current version of this project.

4.  **Deploy**:
    -   Click the "Deploy" button. Vercel will build and deploy your application. Once complete, you will be provided with a live URL.

Vercel's CI/CD pipeline will automatically redeploy the application every time you push new changes to the connected Git branch (e.g., `main`).