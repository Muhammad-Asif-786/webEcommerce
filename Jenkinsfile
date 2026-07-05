pipeline {
    agent any

    environment {
        SERVER_IMAGE = "web-ecommerce-server-image"
        CLIENT_IMAGE = "web-ecommerce-client-image"
        SERVER_CONTAINER = "web-ecommerce-server-container"
        CLIENT_CONTAINER = "web-ecommerce-client-container"
        PORT = "5050"
        EMAIL = "masifmeyo786@gmail.com"
    }

    stages {
        
        /* =========================
           🔥 scm = Source Control Management, Matlab: Git, GitHub, GitLab etc.repository clone karti hai,latest code Jenkins workspace mein laati hai,automatically branch fetch karti hai
        ========================= */
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }



        /* =========================
           🔥 SERVER BUILD
        ========================= */
        stage('Build Server Image') {
            steps {
                sh """
                docker build -t ${SERVER_IMAGE} ./server
                """
            }
        }

        stage('Run Server Container') {
            steps {
                withCredentials([file(credentialsId: 'webEcommerce', variable: 'ENV_FILE')]) {
                    sh """
                    docker stop ${SERVER_CONTAINER} || true
                    docker rm ${SERVER_CONTAINER} || true

                    docker run -d \
                    --restart unless-stopped \
                    --env-file \$ENV_FILE \
                    -p ${PORT}:${PORT} \
                    --name ${SERVER_CONTAINER} \
                    ${SERVER_IMAGE}
                    """
                }
            }
        }

        /* =========================
           🔥 CLIENT BUILD
        ========================= */
        stage('Build Client Image') {
            steps {
                sh """
                docker build -t ${CLIENT_IMAGE} ./client
                """
            }
        }

        stage('Run Client Container') {
            steps {
                sh """
                docker stop ${CLIENT_CONTAINER} || true
                docker rm ${CLIENT_CONTAINER} || true

                docker run -d -p 80:80 \
                --name ${CLIENT_CONTAINER} ${CLIENT_IMAGE}
                """
            }
        }

        /* =========================
           📩 EMAIL NOTIFICATION
        ========================= */
        stage('Send Email') {
            steps {
                emailext (
                    subject: "🚀 web-ecommerce (Grocery Store) Deployed Successfully",
                    body: """
                    Deployment Successful!

                    Backend: http://13.61.104.249:${PORT}
                    Frontend: http://13.61.104.249

                    Regards,
                    Jenkins CI/CD
                    """,
                    to: "${EMAIL}"
                )
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline Successful"
        }
        failure {
            echo "❌ Pipeline Failed"
        }
    }
}

// testing checking 