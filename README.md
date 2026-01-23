# InternMatch - Internship Recommendation Portal

InternMatch is a full-stack web application designed to connect students with internship opportunities. It features a robust recommendation system, user profiles for candidates and employers, and a seamless application process.

## 🚀 Features

*   **User Authentication**: Secure login and registration for Candidates and Employers (JWT-based).
*   **Dashboard**: Personalized dashboards for managing internships and applications.
*   **Internship Listings**: Employers can post, edit, and manage internship opportunities.
*   **Smart Search & Filter**: Candidates can search for internships based on skills, location, and domain.
*   **Application System**: Easy application process for candidates with status tracking.
*   **Profile Management**: Detailed user profiles to showcase skills and experience.
*   **Responsive Design**: Built with a modern UI that works great on desktop and mobile.

## 🛠️ Tech Stack

### Frontend
*   **React.js**: Component-based UI library.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **Framer Motion**: For smooth animations and transitions.
*   **React Router**: For client-side routing.
*   **Axios**: For making HTTP requests.

### Backend
*   **Node.js & Express.js**: RESTful API server.
*   **MongoDB**: NoSQL database for flexible data storage.
*   **Mongoose**: ODM for MongoDB.
*   **JWT (JSON Web Tokens)**: For secure authentication.
*   **Bcrypt**: For password hashing.

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
*   Node.js (v14 or higher)
*   MongoDB (Local or Atlas URL)
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/Priyanshu055/InternMatch
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```




Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Start the React development server:
```bash
npm start
```
The application will open at `http://localhost:3000`.

## 📂 Project Structure

```
InternMatch/
├── backend/          # Node.js/Express API
│   ├── models/       # Database schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth & error handling
│   └── server.js     # Entry point
├── frontend/         # React Application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Full page views
│   │   ├── context/     # State management
│   │   └── App.js       # Main component
└── README.md         # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.
