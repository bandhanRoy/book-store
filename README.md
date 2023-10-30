# Book Store API Readme

Welcome to the Book Store API! This repository contains the backend code for a book store application. In this readme, you will find information on how to set up and run the API, as well as where to find the API documentation.

## API Documentation

You can access the API documentation at the following URL:

- [API Documentation](http://localhost:4000/v1/api/docs)

The API documentation provides detailed information about the available endpoints, request methods, request and response formats, and how to use the API effectively.

## Getting Started

To get the Book Store API up and running on your local machine, follow the steps below:

### 1. Create a `.env` File

Create a `.env` file in the root directory of the project. This file will contain environment variables that are required for the API to function properly. You can use a text editor to create and edit this file.

Example `.env` file:

```env
APP_PORT=4000
ENV='LOCAL'
MONGO_URI='mongodb://127.0.0.1:27017'
DB_NAME='video_store'
```

Replace the example values with your own configurations as needed.

### 2. Install Dependencies

Before running the API, you need to install the project dependencies. Open your terminal and navigate to the project directory, then run the following command:

```
npm install
```

This command will install all the required packages and dependencies specified in the `package.json` file.

### 3. Start the API

To start the API in development mode, use the following command:

```
npm run start:dev
```

This command will launch the API, and it will be available at http://localhost:4000 (or the app port specified in your .env file).

## Issues and Support

If you encounter any issues, have questions, or need support, please open an issue on this repository or contact our support team at [support@gmail.com](mailto:bandhan.roy1@gmail.com).

Thank you for using the Book Store API! We hope you find it useful for your book store application. If you have any feedback or suggestions, please feel free to reach out.
