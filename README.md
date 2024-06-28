## WEBRTC

<p>This project is built using NestJS, a progressive Node.js framework for building efficient and scalable server-side applications. The project adheres to Clean Architecture principles to ensure a robust, maintainable, and scalable codebase.</p>

## Getting Started

### Prerequisites

1. Node.js (version 20.x or later)
2. Docker
3. Docker Compose

### Installation

1. Clone the repository:
   `git clone https://github.com/IgorSolonskiy/webrtc_nest.git
   cd your-repo`

2. Install dependencies:
   `npm install`

3. Environment Variables:
   `cp .env.example .env
   `

### Setting Up the Database

<p>This project uses PostgreSQL as its database. The database can be easily set up using Docker Compose.</p>

1. Start the PostgreSQL container:
   `docker-compose up -d`
2. Check if the container is running:
   `docker-compose ps`

### Running the Application

1. Start the development server:
   `npm run start:dev`
2. Access the application:
   `Open your browser and navigate to http://localhost:3000.`

### Building for Production

1. To build the application for production, run:
   `npm run build`

### Clean Architecture

<p>This project follows Clean Architecture principles, which separates the code into distinct layers. The main layers are:</p>

1. Domain: Contains the business logic and domain entities.
2. UseCases: Handles application-specific business rules.
3. Infrastructure: Deals with external systems such as databases, web frameworks, etc.

### Project Structure
    .
    ├──src
         ├── domain                   
         ├── infrastructure                    
         ├── usecases                     
         ├── app.module.ts                   
         ├── main.ts
    ├── docker-compose.yml
    └── README.md