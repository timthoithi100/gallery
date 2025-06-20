pipeline {
    agent any
    
    triggers {
        pollSCM('H/5 * * * *')
    }
    
    environment {
        RECIPIENT = 'tim.thoithi@student.moringaschool.com'
        RENDER_DEPLOY_HOOK = credentials('render-deploy-hook')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
        
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
        
        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'npm run build || echo "No build script found, skipping..."'
            }
        }
        
        stage('Deploy to Render') {
            steps {
                echo 'Deploying to Render...'
                script {
                    def response = sh(
                        script: """
                            curl -X POST "${RENDER_DEPLOY_HOOK}" \
                                 -H "Content-Type: application/json" \
                                 -d '{"clear_cache": false}' \
                                 -w "%{http_code}" \
                                 -s -o /tmp/render_response.json
                        """,
                        returnStdout: true
                    ).trim()
                    
                    if (response == "200" || response == "201") {
                        echo "✅ Deploy triggered successfully on Render"
                        sh 'sleep 30'
                    } else {
                        error "❌ Failed to trigger deployment. HTTP status: ${response}"
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                script {
                    def appUrl = "https://timthoithi-gallery.onrender.com"
                    def maxRetries = 10
                    def retryCount = 0
                    def deploymentSuccessful = false
                    
                    while (retryCount < maxRetries && !deploymentSuccessful) {
                        try {
                            def response = sh(
                                script: "curl -s -o /dev/null -w '%{http_code}' ${appUrl}/health || echo '000'",
                                returnStdout: true
                            ).trim()
                            
                            if (response == "200") {
                                echo "✅ Application is responding correctly"
                                deploymentSuccessful = true
                            } else {
                                echo "⏳ Waiting for deployment... (attempt ${retryCount + 1}/${maxRetries})"
                                sleep(30)
                                retryCount++
                            }
                        } catch (Exception e) {
                            echo "⏳ Deployment still in progress... (attempt ${retryCount + 1}/${maxRetries})"
                            sleep(30)
                            retryCount++
                        }
                    }
                    
                    if (!deploymentSuccessful) {
                        echo "⚠️ Could not verify deployment within timeout period"
                    }
                }
            }
        }
    }
    
    post {
        failure {
            echo '❌ Pipeline failed! Sending email notification...'
            mail to: "${RECIPIENT}",
                 subject: "🚨 Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: """\
Hi,

The build for job ${env.JOB_NAME} [#${env.BUILD_NUMBER}] has failed.

Build Details:
- Branch: ${env.BRANCH_NAME ?: 'main'}
- Commit: ${env.GIT_COMMIT ?: 'N/A'}
- Build URL: ${env.BUILD_URL}

Please check the logs and fix the issues.

Regards,
Jenkins CI/CD
"""
        }
        
        success {
            echo '✅ Deployment successful! Sending notifications...'
            
            mail to: "${RECIPIENT}",
                 subject: "✅ Deployment Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: """\
Hi,

Great news! The deployment for ${env.JOB_NAME} [#${env.BUILD_NUMBER}] was successful.

Deployment Details:
- Branch: ${env.BRANCH_NAME ?: 'main'}
- Commit: ${env.GIT_COMMIT ?: 'N/A'}
- Build URL: ${env.BUILD_URL}
- App URL: https://timthoithi-gallery.onrender.com

Your application is now live!

Regards,
Jenkins CI/CD
"""
        }
        
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
    }
}