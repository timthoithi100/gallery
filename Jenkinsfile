pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'npm install'
            }
        }
        stage('Deploy to Render') {
            steps {
                echo 'Deploying to Render...'
                // This is a placeholder. Actual Render deployment involves Render's specific hooks/CLI.
                // For now, we're simulating the start command as Render would run it.
                sh 'node server.js & disown' // Start server in background
            }
        }
    }
}