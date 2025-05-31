# Gamify Language Mastery

_Read this in other languages:_
[_አማርኛ_](README.am-AM.md) [_English_](README.md)\

## Project Overview


Gamify Language Mastery is an interactive learning platform designed to make language acquisition fun and effective. Leveraging gamification techniques and AI assistance, it provides users with courses, challenges, learning paths, and personalized missions to enhance their skills in various programming languages.

![Contact Manager](./contact_manager.png)

This documentation outlines the project's structure, usage, and key features to help you understand and contribute to its development.


## Core Features

-   **Lesson Platform:** Interactive lesson interface with progress tracking.
-   **Course Dashboard:** Overview page displaying progress, modules, and completion status with gamified elements.
-   **User Profile:** Profile page to view badges, completed courses, and personalized statistics.
-   **Gamification System:** Points and Badges for completing lessons and courses.
-   **AI-Powered Assistant:** AI tool for code examples and error explanation.
-   **Site Navigation:** Search for specific topics to allow user to quickly access materials.
-   **Accessibility Settings:** Comprehensive accessibility settings for users with disabilities.
-   **Leaderboards:** Compare progress with peers in courses.
-   **Daily Streaks:** Daily Streak bonuses.
-   **Challenges and Quests:** Challenges and quests to earn extra points and badges.
-   **XP (Experience Points):** Earned for completing lessons, quizzes, or challenges.
-   **Graded Badges:** Bronze, Silver, Gold based on performance.
-   **Leaderboards:** Compare progress with peers (global, course-specific, or friend-based).
-   **Skill Points:** Allocated based on mastery (e.g., "JavaScript Level 5").
-   **Completion Badges:** For finishing courses or modules.
-   **Skill Badges:** For mastering specific topics (e.g., "Python Expert").
-   **Hidden Achievements:** Surprise rewards for extra engagement (e.g., "Night Owl" for studying late).
-   **Progress Animations:** Show course completion percentage.
-   **Learning Paths:** Visual roadmap with unlockable levels.
-   **Streaks & Daily Goals:** Reward consistent logins (e.g., "7-Day Streak Bonus").
-   **Personalized Missions:** AI tool suggests challenges based on weak areas.
-   **Certificates & Micro-Credentials:** Shareable on LinkedIn.
-   **Scholarship Points:** Top performers get discounts on paid courses.
-   **Job/Internship Referrals:** For top-ranking learners.
-   **Instant Feedback:** Celebrate correct answers with animations/sounds.
-   **Hints & Power-Ups:** Limited-use helps for tough questions.
-   **Redemption Quizzes:** Retake failed tests for partial credit.

## Project Structure

The project follows a Next.js structure with the following key directories:

-   `docs/`: Documentation files, including the project blueprint.
-   `src/`: Source code for the application.
    -   `ai/`: AI-related logic and flows.
        -   `dev.ts`: Initializes AI flows and configurations.
        -   `flows/`: Contains AI flows for specific features.
            -   `ai-powered-code-explanation.ts`: Flow for explaining code snippets.
            -   `suggest-personalized-challenges.ts`: Flow for suggesting personalized challenges based on user's weak areas.
        -   `genkit.ts`: Genkit AI setup and configuration.
    -   `app/`: Next.js app router directory.
        -   `(app)/`: Application routes.
            -   `ai-assistant/`: Pages related to the AI assistant.
                -   `page.tsx`: AI Assistant page, integrating code explanation and personalized missions.
            -   `challenges/`: Pages related to challenges and quests.
                -   `page.tsx`: Challenges page displaying various types of challenges.
            -   `courses/`: Pages related to courses.
                -   `[courseId]/`: Dynamic route for individual course pages.
                    -   `certificate/`: Pages related to course certificates.
                        -   `page.tsx`: Certificate display page.
                    -   `lessons/`: Pages related to course lessons.
                        -   `[lessonId]/`: Dynamic route for individual lesson pages.
                            -   `page.tsx`: Lesson page displaying lesson content and progress.
                    -   `page.tsx`: Course page displaying course details and modules.
            -   `dashboard/`: Dashboard page.
                -   `page.tsx`: User dashboard with featured courses, personalized missions, and activity summaries.
            -   `leaderboard/`: Leaderboard page.
                -   `page.tsx`: Leaderboard page displaying user rankings.
            -   `learning-paths/`: Learning Paths page.
                -   `page.tsx`: Page displaying available learning paths.
            -   `profile/`: Profile page.
                -   `page.tsx`: User profile page displaying user information and progress.
            -   `settings/`: Settings pages.
                -   `accessibility/`: Accessibility settings page.
                    -   `page.tsx`: Accessibility settings page with customization options.
            -   `subscription/`: Subscription management page.
                -   `page.tsx`: Subscription management page for users to manage their subscription status.
            -   `layout.tsx`: Main application layout.
            -   `page.tsx`: Home page.
        -   `auth/`: Authentication pages.
            -   `page.tsx`: Authentication page for sign-in and sign-up.
        -   `globals.css`: Global CSS stylesheet.
        -   `layout.tsx`: Root layout for the application.
        -   `page.tsx`: Landing page for the application.
    -   `components/`: Reusable components.
        -   `accessibility/`: Accessibility-related components.
            -   `accessibility-settings-form.tsx`: Form for accessibility settings.
        -   `ai/`: AI-related components.
            -   `ai-code-explainer.tsx`: Component for explaining code using AI.
            -   `personalized-challenges-display.tsx`: Component for displaying personalized challenges suggested by AI.
        -   `layout/`: Layout-related components.
            -   `header.tsx`: Application header component.
            -   `main-nav.tsx`: Main navigation component.
            -   `user-nav.tsx`: User navigation component.
        -   `payment/`: Payment-related components.
            -   `payment-modal.tsx`: Payment modal component.
        -   `shared/`: Shared components used across the application.
            -   `logo.tsx`: Logo component.
            -   `search-bar.tsx`: Search bar component.
        -   `ui/`: UI components built with Radix UI and Tailwind CSS.
            -   `*`: Various UI components such as buttons, cards, tabs, etc.
        -   `accessibility-settings-form.tsx`: Component for the accessibility settings form.
        -   `ai-code-explainer.tsx`: Component for the AI-powered code explainer.
        -   `personalized-challenges-display.tsx`: Component for displaying personalized challenges.
    -   `hooks/`: Custom React hooks.
        -   `use-mobile.tsx`: Hook to detect mobile devices.
        -   `use-toast.ts`: Hook for managing toast notifications.
    -   `lib/`: Utility and helper functions.
        -   `mock-data.ts`: Mock data for development and testing.
        -   `utils.ts`: Utility functions.
    -   `services/`: External services integration.
        -   `paymentService.ts`: Mock payment service.
    -   `types/`: TypeScript type definitions.
        -   `index.ts`: Type definitions for various data structures used in the application.

## Setting Up the Project

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd Gamify-Language-Mastery
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory and add any necessary environment variables, such as API keys for external services. Refer to `.env.example` if available.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This command starts the Next.js development server, typically on port 3000.

5.  **Start the Genkit AI server (optional):**

    For AI-powered features to work, start the Genkit server:

    ```bash
    npm run genkit:dev
    ```

    Or, to watch for changes and automatically restart:

    ```bash
    npm run genkit:watch
    ```

## Running Lighthouse audits.

   ```bash
    npx -y lighthouse "http://0.0.0.0:9000/"     --output-path /tmp/lighthouse-1748639769199.html     --only-categories=performance,accessibility,best-practices,seo,pwa     --no-enable-error-reporting     --ignore-status-code     --chrome-flags="--headless=new --disable-dev-shm-usage" 

   ```

## Key Technologies

-   **Next.js:** React framework for building web applications.
-   **TypeScript:** Superset of JavaScript that adds static typing.
-   **Tailwind CSS:** Utility-first CSS framework for styling.
-   **Radix UI:** Unstyled, accessible components for building UIs.
-   **Genkit AI:** Framework for building generative AI applications.
-   **Firebase:** Backend services for authentication, data storage, and more.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Test your changes thoroughly.
5.  Submit a pull request.

## License

This project is licensed under the [License Name] License - see the [LICENSE.md](LICENSE.md) file for details.

