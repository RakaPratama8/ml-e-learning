// Curriculum & Data for Learning Machine E-Learning Platform
const COURSE_DATA = {
  title: "Machine Learning Foundations & Algorithms",
  description: "Interactive browser-based Machine Learning course with hands-on Pyodide sandboxes and visual parameter explorers.",
  modules: [
    {
      id: 1,
      title: "Module 1: Machine Learning Foundations & Linear Regression",
      description: "Understand supervised learning, hypothesis representations, and gradient descent optimization.",
      lessons: [
        {
          id: 101,
          title: "1.1 Introduction to Supervised Learning",
          youtubeId: "g9oESGzcA84", // Replace with your own YouTube Video ID
          durationSeconds: 75,
          videoTopic: "Supervised Learning Paradigm & Regression vs. Classification",
          objectives: [
            "Distinguish supervised learning from unsupervised learning",
            "Understand input features (X) and target labels (y)",
            "Explore real-world regression applications"
          ],
          keyTimestamps: [
            { time: 1, label: "What is Supervised Learning?" },
            { time: 13, label: "How Supervised Learning Works" },
            { time: 29, label: "Practical Example" },
            { time: 63, label: "Real-World Applications" }
          ],
          sandboxTemplate: `# Welcome to Pyodide Browser Python!
# Let's inspect a simple supervised dataset using numpy.
import numpy as np

# Feature X (e.g., house size in sqft / 1000) and Target y (price in $100k)
X = np.array([1.2, 1.5, 1.8, 2.1, 2.4])
y = np.array([2.5, 3.1, 3.8, 4.2, 4.9])

print("Features X shape:", X.shape)
print("Target y values:", y)
print("Average Price ($100k):", np.mean(y))
`,
          explainerType: "linear_regression"
        },
        {
          id: 102,
          title: "1.2 Gradient Descent & Linear Regression",
          youtubeId: "sDv4f4s2SB8", // Replace with your own YouTube Video ID
          durationSeconds: 240,
          videoTopic: "Minimizing Mean Squared Error (MSE) with Gradient Descent",
          objectives: [
            "Formulate the linear regression cost function J(w, b)",
            "Step through gradient descent update rules",
            "Tune learning rate (alpha) to avoid divergence"
          ],
          keyTimestamps: [
            { time: 30, label: "Mean Squared Error Formulation" },
            { time: 110, label: "Gradient Descent Algorithm Steps" },
            { time: 180, label: "Impact of Learning Rate Alpha" }
          ],
          sandboxTemplate: `# Train a Linear Regression model in your browser!
import numpy as np

# Synthetic training data
X = np.array([1, 2, 3, 4, 5], dtype=float)
y = np.array([2.2, 4.1, 5.9, 8.1, 9.8], dtype=float)

# Simple analytical Ordinary Least Squares fit
slope, intercept = np.polyfit(X, y, 1)

print(f"Fitted Line: y = {slope:.3f} * X + {intercept:.3f}")

# Predict on new point X = 6
y_pred_6 = slope * 6 + intercept
print(f"Prediction for X=6: {y_pred_6:.3f}")
`,
          explainerType: "linear_regression"
        }
      ]
    },
    {
      id: 2,
      title: "Module 2: Unsupervised Learning & K-Means Clustering",
      description: "Discover patterns in unlabeled datasets using centroid-based clustering algorithms.",
      lessons: [
        {
          id: 201,
          title: "2.1 Clustering & The K-Means Algorithm",
          youtubeId: "4b5d3muPQmA", // Replace with your own YouTube Video ID
          durationSeconds: 210,
          videoTopic: "Centroid Assignment & Centroid Update Iterations",
          objectives: [
            "Define unlabeled data and unsupervised discovery",
            "Understand the iterative 2-step K-Means algorithm",
            "Choose optimal K using visual inertia analysis"
          ],
          keyTimestamps: [
            { time: 20, label: "Unsupervised Clustering Overview" },
            { time: 85, label: "K-Means Step 1: Assigning Clusters" },
            { time: 145, label: "K-Means Step 2: Updating Centroids" }
          ],
          sandboxTemplate: `# Let's simulate distance calculations in K-Means clustering!
import numpy as np

# Centroid positions
c1 = np.array([2.0, 2.0])
c2 = np.array([8.0, 8.0])

# Sample data point
point = np.array([3.0, 2.5])

# Euclidean distance calculation
dist1 = np.linalg.norm(point - c1)
dist2 = np.linalg.norm(point - c2)

assigned_cluster = 1 if dist1 < dist2 else 2
print(f"Distance to C1: {dist1:.2f}, Distance to C2: {dist2:.2f}")
print(f"Assigned Cluster: {assigned_cluster}")
`,
          explainerType: "kmeans"
        }
      ]
    },
    {
      id: 3,
      title: "Module 3: Model Evaluation & Regularization",
      description: "Diagnose overfitting vs. underfitting and apply L1/L2 regularization to improve generalization.",
      lessons: [
        {
          id: 301,
          title: "3.1 Overfitting, Underfitting & Regularization",
          youtubeId: "Q81RR3yKn30", // Replace with your own YouTube Video ID
          durationSeconds: 200,
          videoTopic: "Bias-Variance Tradeoff & Ridge/Lasso Regularization",
          objectives: [
            "Recognize high bias vs. high variance behavior",
            "Understand train/validation split evaluation",
            "How L1 and L2 weight penalty terms work"
          ],
          keyTimestamps: [
            { time: 25, label: "Underfitting (High Bias) vs Overfitting (High Variance)" },
            { time: 95, label: "Train vs Validation Loss Curves" },
            { time: 150, label: "L2 Ridge & L1 Lasso Regularization" }
          ],
          sandboxTemplate: `# Evaluate model prediction error (MSE)
import numpy as np

y_true = np.array([3.0, -0.5, 2.0, 7.0])
y_pred = np.array([2.5,  0.0, 2.0, 8.0])

mse = np.mean((y_true - y_pred) ** 2)
print(f"Mean Squared Error (MSE): {mse:.4f}")
`,
          explainerType: "linear_regression"
        }
      ]
    }
  ],

  // Question Bank linked to Module IDs with remediation video links
  questions: [
    {
      id: "q1",
      moduleId: 1,
      lessonId: 101,
      questionText: "In supervised learning, what is the primary role of the target label vector (y)?",
      options: [
        "It represents the ground-truth values that the model aims to predict given feature inputs X.",
        "It stores hyperparameters like learning rate and epoch count.",
        "It acts as random noise added to prevent model overfitting.",
        "It represents the cluster assignments in unsupervised learning."
      ],
      correctIndex: 0,
      videoTimestampSec: 120,
      explanation: "Supervised learning relies on paired (X, y) data where X represents the feature matrix and y is the target ground-truth label vector the model learns to predict."
    },
    {
      id: "q2",
      moduleId: 1,
      lessonId: 102,
      questionText: "What happens if the learning rate (alpha) in gradient descent is set too large?",
      options: [
        "The model will converge instantly with zero error.",
        "Gradient descent may overshoot the minimum and diverge away from the solution.",
        "The algorithm will automatically switch to K-Means clustering.",
        "The cost function J(w, b) will become linear."
      ],
      correctIndex: 1,
      videoTimestampSec: 180,
      explanation: "If the learning rate alpha is too large, parameter updates take steps that are too big, causing gradient descent to overshoot the valley floor and diverge."
    },
    {
      id: "q3",
      moduleId: 2,
      lessonId: 201,
      questionText: "During the assignment step of the K-Means algorithm, how are data points assigned to clusters?",
      options: [
        "Each data point is assigned to the cluster whose centroid has the smallest Euclidean distance to that point.",
        "Points are assigned randomly to balance cluster sizes equally.",
        "Points are assigned based on their target label y.",
        "Only the top 10% of points are assigned to centroids."
      ],
      correctIndex: 0,
      videoTimestampSec: 85,
      explanation: "K-Means Step 1 calculates the Euclidean distance from every point to all K centroids and assigns each point to its nearest centroid."
    },
    {
      id: "q4",
      moduleId: 3,
      lessonId: 301,
      questionText: "A machine learning model achieves 99.8% training accuracy but only 62% validation accuracy. What phenomenon is occurring?",
      options: [
        "Overfitting (High Variance) - the model memorized training noise instead of general patterns.",
        "Underfitting (High Bias) - the model is too simple to capture patterns.",
        "Perfect Generalization.",
        "Centroid Collapse."
      ],
      correctIndex: 0,
      videoTimestampSec: 25,
      explanation: "A large gap between high training accuracy and poor validation accuracy is the classic hallmark of Overfitting (High Variance)."
    },
    {
      id: "q5",
      moduleId: 3,
      lessonId: 301,
      questionText: "How does L2 (Ridge) Regularization combat model overfitting?",
      options: [
        "It adds a penalty term proportional to the squared magnitude of model weights to the cost function.",
        "It removes 50% of the training dataset at random.",
        "It sets the learning rate alpha to zero.",
        "It doubles the number of hidden features."
      ],
      correctIndex: 0,
      videoTimestampSec: 150,
      explanation: "L2 Regularization penalizes large weight coefficients by adding the sum of squared weights lambda * ||w||^2 to the loss function, encouraging smoother generalization."
    }
  ]
};
