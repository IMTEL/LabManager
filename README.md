# VR Lab Manager

The purpose of this project of is to create system for organizing and managing equipment in addition to managing borrowing and returning of equipment.
Initially made for the IMTEL VR Lab at NTNU but it is also usable for other inventories.

## Features

- Add edit and delete equipment
- Manage borrowing and returning of equipment
- Keep track of borrowers and equipment usage
- Manage inventory administrators

## Build and run your own instance

### Requirements

- A computer with Docker installed

### Instructions

1. Build a Docker image using the Dockerfile in ./labman. Run ``docker build -t labman .``
2. Use the provided compose.yaml to run the application and make to make a .env file in the same directory containing the variables reqiored by compose.yaml.
3. In compose.yaml, replace the labman image with name of the image you built in step 1.
4. Start the application by running `docker compose up -d` in the same directory as compose.yaml
5. Open `http://localhost:5000` and login with your own preferred credentials to start using the application

## Develop

### Database
This project uses PostgreSQL as the database, using Prisma as the ORM.

1. Create a PostgreSQL database using your preferred method
2. Make an .env file with the database connection string: `DATABASE_URL=postgres://{username}:{password}@{route}/{database}?schema=public

### Run the application

1. Clone the repository
2. Run `cd labman`
3. Run `npm install`
4. Run `npm prisma generate` to generate the Prisma client
5. Run `npm prisma migrate dev` to run the database migrations
6. Run `npm run dev` to start the development server
7. Open `http://localhost:3000` and login with your own preferred credentials to make a user to access the application


# FAQ

- **Can I use this application for managing other types of inventory?**

Yes, the current name is misleading. The application is perfectly suitable for other things than VR equipment too.

- **I forgot the credentials to my accounts?**

As of now, there is no way to recover lost accounts. If no one has access to create a new account for you, you can directly manipulate the database to delete all users,
which will force the creation of a new account on the next login attempt.

- **Is it safe to store sensitive information in the database?**

Everything is hosted locally with no external connections, and the login passwords are encrypted. Though if you are hosting the application publicly, it is your own responsibility to host it securely.






