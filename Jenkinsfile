pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {
        stage("Clone code:") {
            steps {
                git branch: "master", url: "https://github.com/timthoithi100/gallery.git"
            }
        }
        
        stage("Build code") {
            steps {
                sh "npm install"
            }
        }

        stage("Run tests") {
            steps {
                sh "npm test"
            }
            post {
                failure {
                    mail to: 'tim.thoithi@student.moringaschool.com',
                         subject: "Jenkins Pipeline Failed: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                         body: "The 'Run tests' stage of your Jenkins pipeline '${env.JOB_NAME}' (Build #${env.BUILD_NUMBER}) failed."
                }
            }
        }
        
        stage("Deploy to Render") {
            steps {
                withCredentials([string(credentialsId: 'RENDER_DEPLOY_HOOK_URL', variable: 'RENDER_DEPLOY_HOOK')]) {
                    sh "curl -X POST $RENDER_DEPLOY_HOOK"
                }
            }
            post {
                success {
                    script {
                        withCredentials([string(credentialsId: 'SLACK_WEBHOOK_URL', variable: 'SLACK_WEBHOOK')]) {
                            slackSend(
                                webhook: "$SLACK_WEBHOOK",
                                channel: '#social',
                                message: "Deployment to Render successful! \n" +
                                         "Build ID: ${env.BUILD_NUMBER}\n" +
                                         "Render Link: https://gallery-aort.onrender.com/\n"
                            )
                        }
                    }
                }
            }
        }
    }
}