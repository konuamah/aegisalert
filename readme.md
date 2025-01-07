# AegisAlert: Disaster Management System

AegisAlert is a full-stack web application designed to provide real-time disaster alerts, resource management, and geospatial visualization. Built with **Django** for the backend and **Svelte** for the frontend, AegisAlert integrates modern web technologies to deliver a seamless user experience, real-time updates, and robust functionality. Below is a detailed breakdown of the key features and technologies used in the application.

---

## Screenshots

### Homepage
![Homepage](https://github.com/konuamah/aegisalert/blob/main/project_images/homepage.png)  
*The homepage provides an overview of the application, including navigation links and key features.*

### Disaster Detection
![Disaster Detection](https://github.com/konuamah/aegisalert/blob/main/project_images/disaster.png)  
*The disaster detection page displays real-time alerts and anomalies detected by the sensor API.*

---

## Features

### User Authentication
- AegisAlert uses **Django's built-in authentication system** to handle user sign-in, sign-out, and session management. This ensures secure and reliable user access control.

### Real-Time Updates with Server-Sent Events (SSE)
- **Announcements** and **resources** are dynamically updated in real-time using **Server-Sent Events (SSE)**. This allows the admin to push updates from the Django admin panel, which are instantly reflected on the frontend without requiring a page reload.

### Map Integration with Mapbox
- AegisAlert integrates **Mapbox** for interactive and visually appealing map displays. This is particularly useful for visualizing geospatial data or location-based features.

### Email Notifications with Celery and Redis
- The app leverages **Celery** and **Redis** for asynchronous task processing. When an anomaly or disaster is detected via the **sensor API**, the system automatically sends email notifications to users. This ensures timely alerts and enhances user safety.

### Backend Control with Django
- The entire app is controlled by the **Django backend**, which serves as the central hub for all data processing and management. All data consumed by the frontend is fetched from the Django backend.

### RESTful API with Django REST Framework
- AegisAlert uses **Django REST Framework (DRF)** to create a robust and scalable RESTful API. This enables seamless communication between the frontend and backend, ensuring efficient data exchange.

### Database with PostgreSQL and Django GIS
- The app uses **PostgreSQL** as its primary database, with **Django GIS** for handling geospatial data. This combination is ideal for applications that require location-based functionalities.

### Dockerized Deployment
- AegisAlert is containerized using **Docker**, making it easy to deploy and scale across different environments. The Docker setup includes Django, PostgreSQL, and other dependencies, ensuring consistency across development, staging, and production environments.

---

## Tech Stack

### Frontend
- **Svelte**: A modern JavaScript framework for building fast and reactive user interfaces.
- **Mapbox**: For interactive and customizable map displays.

### Backend
- **Django**: A high-level Python web framework for rapid development and clean design.
- **Django REST Framework (DRF)**: For building RESTful APIs.
- **Django GIS**: For handling geospatial data and integrating with PostgreSQL.
- **Celery**: For asynchronous task processing (e.g., sending emails).
- **Redis**: As a message broker for Celery and for caching.

### Database
- **PostgreSQL**: A powerful, open-source relational database system.
- **PostGIS**: An extension for PostgreSQL that adds support for geographic objects.

### Deployment
- **Docker**: For containerization and easy deployment.
- **Docker Compose**: For managing multi-container Docker applications.

### Other Tools
- **Server-Sent Events (SSE)**: For real-time updates from the backend to the frontend.
- **Sensor API**: For detecting anomalies or disasters and triggering notifications.

---

## Getting Started

### Prerequisites
- Docker and Docker Compose installed on your machine.
- Python 3.x installed (if running locally without Docker).

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/aegisalert.git
   cd aegisalert
   ```
2. Set up environment variables:
   - Create a `.env` file in the root directory and add the necessary variables (e.g., database credentials, Mapbox API key, email settings, etc.).

3. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```
4. Access the app:
   - Frontend: `http://localhost:5173` (or the port configured for Svelte).
   - Backend: `http://localhost:8000` (or the port configured for Django).

### Running Locally (Without Docker)
1. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Django development server:
   ```bash
   python manage.py runserver
   ```
4. Run the Svelte development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to the branch.
4. Submit a pull request with a detailed description of your changes.

