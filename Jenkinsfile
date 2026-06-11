pipeline {
    agent any

    environment {
        SERVER_IMAGE = "webEcommerce-server-image"
        CLIENT_IMAGE = "webEcommerce-client-image"
        SERVER_CONTAINER = "webEcommerce-server-container"
        CLIENT_CONTAINER = "webEcommerce-client-container"
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
                sh """
                docker stop ${SERVER_CONTAINER} || true
                docker rm ${SERVER_CONTAINER} || true

                docker run -d -p ${PORT}:${PORT} \
                --name ${SERVER_CONTAINER} ${SERVER_IMAGE}
                """
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
                    subject: "🚀 webEcommerce (Grocery Store) Deployed Successfully",
                    body: """
                    Deployment Successful!

                    Backend: http://13.49.228.189:${PORT}
                    Frontend: http://13.49.228.189

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

