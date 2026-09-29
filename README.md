# Click Fit

Click Fit is a responsive one-page sports and fitness website developed as a full-stack technical assignment.

## Features

- Responsive sports and fitness landing page
- Modern fitness-focused UI
- CSS animations and interactive elements
- Bootstrap for responsive layout
- jQuery and jQuery AJAX
- REST API integration
- Displays data from `https://api.restful-api.dev/objects`
- Drag-and-drop image upload
- Click-to-browse image upload
- Image preview before upload
- Node.js and Express backend
- Uploaded images stored locally in the `upload_images` folder
- MySQL database script with `users` table
- `addUser` stored procedure

## Technologies

### Frontend

- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- jQuery
- jQuery AJAX

### Backend

- Node.js
- Express.js
- Multer
- CORS

### Database

- MySQL
- Stored Procedure

## Project Structure

```text
click-fit/
├── Backend/
│   ├── routes/
│   └── server.js
├── Frontend/
│   ├── css/
│   ├── js/
│   └── index.html
├── database/
│   └── database.sql
├── upload_images/
│   └── .gitkeep
├── .gitignore
├── package.json
├── package-lock.json
└── README.md


## Running the Project

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/ReemaGwd/click-fit.git

2. Navigate to the Project Folder
cd click-fit

3. Install Dependencies
npm install

4. Start the Application
npm start

5. Open the Application

Open your browser and go to:

http://localhost:3000

The Click Fit website will now be running locally.
