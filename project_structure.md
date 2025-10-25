## Project Structure

```
C:\DataLemur\
├── backend\
│   ├── app.js
│   ├── index.js
│   ├── package.json
│   ├── questions.json
│   ├── config\
│   │   └── db.js
│   ├── controllers\
│   │   ├── questionController.js
│   │   └── userController.js
│   ├── middleware\
│   │   └── authMiddleware.js
│   ├── routes\
│   │   ├── questionRoutes.js
│   │   └── userRoutes.js
│   └── utils\
│       └── compareResults.js
└── frontend\
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── src\
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── components\
    │   │   ├── HintBox.jsx
    │   │   ├── Playground.jsx
    │   │   ├── QuestionPanel.jsx
    │   │   ├── QuestionTabs.jsx
    │   │   ├── Solution.jsx
    │   │   ├── Stopwatch.jsx
    │   │   └── Submission.jsx
    │   └── pages\
    │       ├── AuthPage.jsx
    │       ├── Layout.jsx
    │       └── QuestionList.jsx
```

## File Descriptions

### Backend

- **app.js**: Express application setup, middleware, and route initialization.
- **index.js**: Main entry point for the backend server.
- **package.json**: Lists backend dependencies and scripts.
- **questions.json**: Contains the SQL questions, schema, and sample data.
- **config/db.js**: Manages the database connection pool.
- **controllers/questionController.js**: Handles logic for fetching and running SQL questions.
- **controllers/userController.js**: Manages user profile creation and retrieval.
- **middleware/authMiddleware.js**: Firebase authentication middleware to protect routes.
- **routes/questionRoutes.js**: Defines API routes for questions.
- **routes/userRoutes.js**: Defines API routes for users.
- **utils/compareResults.js**: Compares user's query result with the expected result.

### Frontend

- **package.json**: Lists frontend dependencies and scripts.
- **vite.config.js**: Vite build configuration.
- **index.html**: Main HTML entry point for the React application.
- **src/main.jsx**: Renders the root React component.
- **src/App.jsx**: Main application component with routing setup.
- **src/components/HintBox.jsx**: Displays hints for a question.
- **src/components/Playground.jsx**: The SQL editor and execution environment.
- **src/components/QuestionPanel.jsx**: Displays the question details, schema, and sample data.
- **src/components/QuestionTabs.jsx**: Manages the tabs for Question, Solution, and Submission.
- **src/components/Solution.jsx**: Shows the official solution and explanation.
- **src/components/Stopwatch.jsx**: A stopwatch to time the user.
- **src/components/Submission.jsx**: Displays the result of a user's query submission.
- **src/pages/AuthPage.jsx**: Handles user authentication with Firebase.
- **src/pages/Layout.jsx**: The main layout of the application, combining the question panel and playground.
- **src/pages/QuestionList.jsx**: Displays the list of all SQL questions.
