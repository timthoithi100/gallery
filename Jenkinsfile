pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')
    }

    environment {
        RECIPIENT = 'tim.thoithi@student.moringaschool.com'
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
                echo 'Running tests...'
                sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Starting Node.js server...'
                sh 'node server.js'
            }
        }
    }

    post {
        failure {
            echo 'Tests failed! Sending email...'
            mail to: "${RECIPIENT}",
                 subject: "🚨 Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: """\
Hi,

The build for job ${env.JOB_NAME} [#${env.BUILD_NUMBER}] has failed.
You can view the build details at: ${env.BUILD_URL}

Regards,
Jenkins
"""
        }
        success {
            echo 'Deployment successful! Sending Slack notification...'
            // Add your Slack notification here for Milestone 4
            // Example: slackSend channel: '#YourFirstName_IP1', message: "Build ${env.BUILD_NUMBER} of ${env.JOB_NAME} deployed successfully to Render: YOUR_RENDER_URL_HERE"
        }
    }
}