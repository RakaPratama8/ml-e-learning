# Learning Machine — Interactive Machine Learning Platform

**Learning Machine** is a modern, interactive browser-based E-Learning web application designed to teach beginner Machine Learning concepts through hands-on coding, visual simulations, and structured assessments.

---

## ✨ Features

- **🎬 Video Lessons**: Integrated YouTube video playback with chapter bookmarks and automatic completion tracking.
- **📊 Interactive Explainers**: Real-time interactive simulators allowing students to drag parameter sliders and observe visual updates:
  - **Linear Regression & Gradient Descent Simulator**: Adjust slope ($w$) and intercept ($b$) to observe real-time Mean Squared Error (MSE) changes.
  - **K-Means Clustering Simulator**: Adjust $K$ and cluster compactness with live Voronoi scatter plots.
- **🐍 Pyodide Code Sandbox**: Run real Python 3.11 scripts (`numpy`, `scikit-learn`) directly inside the browser using WebAssembly workers—no server setup required.
- **📝 Interactive Assessments**: Module quizzes with immediate feedback and chapter remediation links.
- **🎓 Certificate of Completion**: Automated printable certificate unlocked upon finishing all lessons and quizzes.

---

## 📚 Curriculum

1. **Module 1: Machine Learning Foundations & Linear Regression**
   - Lesson 1.1: Introduction to Supervised Learning
   - Lesson 1.2: Gradient Descent & Linear Regression
2. **Module 2: Unsupervised Learning & K-Means Clustering**
   - Lesson 2.1: Clustering & The K-Means Algorithm
3. **Module 3: Model Evaluation & Regularization**
   - Lesson 3.1: Overfitting, Underfitting & Regularization

---

## 🚀 Getting Started (Run Locally)

You can launch the platform locally using any static HTTP server.

### Using `npx serve`:
```bash
npx serve .
```

Then open your browser to `http://localhost:3000` (or the local port shown in your terminal).

---

## 📁 Project Structure

```text
ml-e-learning/
├── index.html                  # Single-Page Application (SPA) layout
├── index.css                   # Core design system & dark-mode styling
├── README.md                   # Project documentation
└── js/
    ├── app.js                  # Application controller & router
    ├── course-data.js          # Curriculum, lessons, YouTube IDs & quiz questions
    ├── state-store.js          # Reactive frontend progress store
    ├── video-system.js         # YouTube IFrame API integration & completion gates
    ├── visual-explainer.js     # Canvas interactive parameter simulators
    ├── sandbox-system.js       # Pyodide browser Python editor & terminal
    ├── pyodide-worker.js       # Web Worker for WebAssembly Python execution
    ├── quiz-system.js          # Assessment logic
    └── certificate-system.js   # Printable credential generator
```
