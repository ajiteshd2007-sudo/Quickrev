<p align="center">
  <h1 align="center">QuickRev</h1>
  <p align="center">AI-powered flashcard & revision platform that turns your notes into smart, adaptive practice questions.</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/AI-Anthropic%20API-D97757" alt="Anthropic API">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
</p>

---

## About

Self-study revision is broken — notes are scattered, students don't know their weak topics until the exam, and writing practice questions manually takes too long. QuickRev fixes this: upload a note or PDF, and it extracts topics, generates practice questions, builds a knowledge graph, and tracks which topics need more attention — solo or with friends.

## Demo

<p align="center">
  <img src="https://via.placeholder.com/800x450?text=QuickRev+Screenshot" alt="QuickRev demo screenshot">
</p>

*(Replace the image above with an actual screenshot or GIF of your dashboard/app in action.)*

## Features

- 🧠 **AI Question Generator** — auto-generates MCQ, short-answer, and flashcard formats from your notes, tagged by difficulty
- 🕸️ **Knowledge Graph** — maps topics and sub-concepts so you see how ideas connect across subjects
- 📉 **Weak Topic Detection** — tracks accuracy and response time to flag topics needing more revision
- 📊 **Revision Dashboard** — daily streaks, mastery scores, and subject-wise progress at a glance
- 👥 **Collaboration** — share decks with friends, compare mastery scores, and revise in group sessions

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, HTML5, CSS3, JavaScript |
| Backend | Spring Boot (Java) |
| Database | MySQL |
| AI Layer | Anthropic API |
| Auth | JWT, Spring Security |

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8+
- An Anthropic API key

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/<your-username>/quickrev.git
cd quickrev

# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd ../frontend
npm install
npm start
\`\`\`

### Configuration

Create a \`.env\` file in the backend root:

\`\`\`
DB_URL=jdbc:mysql://localhost:3306/quickrev
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
ANTHROPIC_API_KEY=your_api_key
\`\`\`

## Usage

1. Register an account and log in.
2. Upload a note or PDF from the dashboard.
3. QuickRev extracts topics and generates flashcards automatically.
4. Review flashcards — weak topics are flagged and queued for revision.
5. Add friends to share decks and compare mastery scores.

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/your-feature\`)
3. Commit your changes (\`git commit -m 'Add your feature'\`)
4. Push to the branch and open a pull request

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

QuickRev · Coimbatore Institute of Technology · M.Sc. Software Systems

