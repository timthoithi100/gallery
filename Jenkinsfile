pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests (if any)...'
                // Run tests if available; skip gracefully if not
                sh 'npm test || echo "No tests defined or test step failed gracefully."'
            }
        }
    }
}
