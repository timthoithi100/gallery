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
                script {
                    try {
                        sh 'npm test'
                    } catch (err) {
                        currentBuild.result = 'FAILURE'
                        echo 'Tests failed. Sending failure email...'
                        mail to: "${RECIPIENT}",
                             subject: "🚨 Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                             body: """\
Hi,

The build for job ${env.JOB_NAME} [#${env.BUILD_NUMBER}] has failed during the test stage.
You can view the build details at: ${env.BUILD_URL}

Regards,
Jenkins
"""
                        error("Build failed due to test failure.")
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Starting Node.js server...'
                sh 'node server.js'
            }
        }
    }
}
