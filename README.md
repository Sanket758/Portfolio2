
# Sanket Gadge - Full-Stack Personal Portfolio

This repository contains the source code for a modern, responsive, and fully dynamic personal portfolio website for Sanket Gadge, an AI & ML Engineer. The project is built with React, Vite, and Tailwind CSS for the frontend, and leverages Google's Firebase for backend services, including Authentication and Firestore as a NoSQL database.

The portfolio features a secure, dedicated admin portal where all content—such as projects, skills, and work experience—can be managed dynamically without touching the code.

![Portfolio Screenshot](https://i.imgur.com/example.png) <!-- It's a good idea to replace this with an actual screenshot of your portfolio -->

---

## ✨ Features

-   **Dynamic Content Management**: All portfolio data is fetched in real-time from a Firestore database.
-   **Secure Admin Portal**: A private `/admin` route protected by Firebase Authentication for CRUD (Create, Read, Update, Delete) operations on all portfolio content.
-   **Modern Tech Stack**: Built with React 18, Vite for lightning-fast development, and Tailwind CSS for utility-first styling.
-   **Fully Responsive**: Mobile-first design that looks great on all devices, from phones to desktops.
-   **Serverless Architecture**: No need to manage a backend server. The entire application is powered by Firebase's Backend-as-a-Service (BaaS).
-   **CI/CD Ready**: Set up for seamless continuous integration and deployment using Vercel.

---

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or newer)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A Google account to create a Firebase project.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env` in the root of your project directory. Copy the contents of `.env.example` into it. You will populate this file with your Firebase credentials in the next step.

    ```
    # .env
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    VITE_FIREBASE_STORAGE_BUCKET=...
    VITE_FIREBASE_MESSAGING_SENDER_ID=...
    VITE_FIREBASE_APP_ID=...
    ```

---

## 🔥 Firebase Setup (Backend)

This project uses Firebase for its database and authentication. You'll need to create a free Firebase project to get the necessary credentials.

1.  **Create a Firebase Project:**
    -   Go to the [Firebase Console](https://console.firebase.google.com/).
    -   Click "Add project" and follow the on-screen instructions.

2.  **Register a Web App:**
    -   In your project's dashboard, click the Web icon (`</>`) to start the setup process.
    -   Give your app a nickname (e.g., "Portfolio Website") and click "Register app".
    -   Firebase will provide you with a `firebaseConfig` object. **Copy these keys** and paste them into your `.env` file.

3.  **Enable Authentication:**
    -   In the left sidebar, go to **Build > Authentication**.
    -   Click "Get started".
    -   Select **Email/Password** from the list of sign-in providers and enable it.
    -   Go to the **Users** tab and click "Add user". Create your admin account with an email and a secure password. This will be your login for the admin portal.

4.  **Set Up Firestore Database:**
    -   In the left sidebar, go to **Build > Firestore Database**.
    -   Click "Create database".
    -   Start in **production mode** and choose a server location near you.
    -   In the Firestore **Data** tab, create three collections: `projects`, `skills`, and `experiences`. You can leave them empty for now; you'll populate them using your admin dashboard.

5.  **Configure Security Rules:**
    -   Go to the **Rules** tab in Firestore.
    -   Paste the following rules to allow public read access to your portfolio data but restrict write access to only your authenticated admin user.
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Allow public read access for all collections
        match /{collection}/{docId} {
          allow read: if true;
          // Allow write (create, update, delete) only for authenticated users
          allow write: if request.auth != null;
        }
      }
    }
    ```
    -   Click **Publish**.

---

## 💻 Running the Project Locally

Once you have set up Firebase and populated your `.env` file, you can run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`. The admin portal can be accessed at `http://localhost:5173/admin`.

---

## ☁️ Deployment with Vercel

This project is optimized for deployment on Vercel, which offers a seamless CI/CD pipeline with its free hobby plan.

1.  **Push to GitHub:**
    -   Create a new repository on [GitHub](https://github.com) and push your project code to it.

2.  **Import Project on Vercel:**
    -   [Sign up for Vercel](https://vercel.com) with your GitHub account.
    -   On your dashboard, click "Add New... -> Project".
    -   Select your project's GitHub repository and click "Import".

3.  **Configure Environment Variables:**
    -   Vercel will automatically detect that you have a Vite project.
    -   Expand the **"Environment Variables"** section.
    -   Add each variable from your `.env` file. For example:
        -   **Name:** `VITE_FIREBASE_API_KEY`, **Value:** `your-api-key`
        -   **Name:** `VITE_FIREBASE_AUTH_DOMAIN`, **Value:** `your-auth-domain`
        -   ...and so on for all the keys.

4.  **Deploy:**
    -   Click the "Deploy" button. Vercel will build and deploy your site.
    -   After a minute, you will have a live URL for your portfolio! Any subsequent pushes to your `main` branch will automatically trigger a new deployment.

---

## 🛠️ Tech Stack

-   **Frontend:** React, Vite, TypeScript
-   **Styling:** Tailwind CSS
-   **Backend & Database:** Firebase (Authentication, Firestore)
-   **Deployment:** Vercel
