# AI-Based Automatic Answer Evaluation Using Semantic Similarity

An AI-powered web application that automatically evaluates descriptive answers by understanding their semantic meaning rather than relying on exact keyword matching. The system compares a student's response with a teacher's model answer using Natural Language Processing (NLP) and Sentence-BERT (SBERT), generates a similarity score, assigns marks, and provides personalized feedback for fair and consistent assessment.

---

## 📌 Table of Contents

- Overview
- Problem Statement
- Proposed Solution
- Features
- System Workflow
- Technology Stack
- Project Structure
- Installation
- Usage
- Future Enhancements
- Project Status
- Contributors
- License

---

## 📖 Overview

Traditional answer evaluation methods are often time-consuming and subjective. Existing automated grading systems primarily depend on keyword matching, which fails to capture the actual meaning of a student's response.

This project introduces an intelligent answer evaluation system that leverages semantic similarity techniques to assess descriptive answers more accurately. By understanding the context and meaning of text, the system provides reliable scores and constructive feedback, reducing manual effort while ensuring consistency in evaluation.

---

## ❗ Problem Statement

Manual evaluation of descriptive answers is labor-intensive, time-consuming, and prone to inconsistencies due to subjective judgment. Conventional automated grading systems rely on keyword matching, which often fails to recognize semantically correct answers expressed using different wording, resulting in unfair evaluation.

---

## 💡 Proposed Solution

The proposed system utilizes Natural Language Processing (NLP) and Sentence-BERT (SBERT) to compare a student's answer with the teacher's model answer based on semantic meaning rather than exact keywords.

The application automatically:

- Calculates semantic similarity
- Assigns marks based on similarity score
- Generates meaningful feedback
- Ensures fair and unbiased evaluation
- Reduces manual grading effort

---

## ✨ Features

- AI-based descriptive answer evaluation
- Semantic similarity using Sentence-BERT (SBERT)
- Automatic mark calculation
- Personalized feedback generation
- Teacher model answer comparison
- Student answer submission portal
- User-friendly web interface
- Fast and scalable backend
- Secure data storage

---

## ⚙️ System Workflow

```text
Student Answer
       │
       ▼
Text Preprocessing
       │
       ▼
Sentence-BERT Embedding Generation
       │
       ▼
Semantic Similarity Calculation
       │
       ▼
Score Generation
       │
       ▼
Feedback Generation
       │
       ▼
Final Marks Display
```

---

## 🛠 Technology Stack

### Frontend

- React.js
- HTML5
- CSS3
- JavaScript

### Backend

- Python
- FastAPI / Flask

### AI & Machine Learning

- Sentence-BERT (SBERT)
- Natural Language Processing (NLP)
- Scikit-learn

### Database

- MongoDB

### Development Tools

- Git
- GitHub
- VS Code

---

## 📂 Project Structure

```text
AI-Based-Automatic-Answer-Evaluation/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── app.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── dataset/
│
├── README.md
│
└── requirements.txt
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/<username>/AI-Based-Automatic-Answer-Evaluation-Using-SemanticSimilarity.git
```

### Navigate to the project

```bash
cd AI-Based-Automatic-Answer-Evaluation-Using-SemanticSimilarity
```

### Install backend dependencies

```bash
pip install -r requirements.txt
```

### Install frontend dependencies

```bash
cd frontend
npm install
```

### Start the backend server

```bash
python app.py
```

### Start the frontend

```bash
npm start
```

---

## 🖥️ Usage

1. Teacher uploads the model answer.
2. Student submits the descriptive answer.
3. The system preprocesses both answers.
4. Sentence-BERT generates semantic embeddings.
5. Similarity score is calculated.
6. Marks are assigned automatically.
7. Personalized feedback is generated.
8. Final evaluation is displayed.

---

## 🎯 Expected Outcomes

- Accurate semantic evaluation
- Reduced manual grading time
- Fair and consistent assessment
- Improved student feedback
- Scalable evaluation system for educational institutions

---

## 🚀 Future Enhancements

- Support for multiple languages
- Subject-specific evaluation models
- Explainable AI-based feedback
- AI-generated model answers
- LMS integration (Moodle, Google Classroom)
- Analytics dashboard for teachers
- Performance tracking and reports

---

## 📊 Project Status

| Task | Status |
|------|--------|
| Problem Identification | ✅ Completed |
| Literature Survey | ✅ Completed |
| Dataset Collection | 🔄 In Progress |
| AI Model Development | 🔄 In Progress |
| Backend Development | 🔄 In Progress |
| Frontend Development | 🔄 In Progress |
| Testing & Evaluation | ⏳ Planned |
| Deployment | ⏳ Planned |

---

## 👥 Contributors

- **Vaishnavi Subramaniam**
- **Sreya R**
- **Sri Akash I M**

---

## 📄 License

This project is developed for academic and research purposes. Feel free to use and extend it with proper attribution.

---

