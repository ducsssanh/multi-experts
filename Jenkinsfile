// ====================================
// Jenkinsfile - Multi-Expert CI/CD Pipeline
// ====================================
// Trigger: GitHub webhook on push
// Stages: Checkout → Scan → Build → Push → Deploy
// ====================================

pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO   = 'ducsssanh13'
        BACKEND_IMAGE      = "${DOCKER_HUB_REPO}/multiexpert-backend"
        FRONTEND_IMAGE     = "${DOCKER_HUB_REPO}/multiexpert-frontend"
        IMAGE_TAG          = "${env.BUILD_NUMBER}-${env.GIT_COMMIT?.take(7) ?: 'unknown'}"
        SNYK_SEVERITY      = 'high'
        K8S_NAMESPACE      = 'multiexpert'
        // Tools installed in Jenkins home (non-root container)
        PATH               = "/var/jenkins_home:${env.PATH}"
        KUBECONFIG         = '/var/jenkins_home/.kube/config'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        // ========== 1. CHECKOUT ==========
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_SHORT}"
                }
                echo "Building: ${env.IMAGE_TAG}"
            }
        }

        // ========== 2. SECURITY SCAN (Snyk) ==========
        stage('Security Scan') {
            parallel {
                stage('Snyk: Backend Dependencies') {
                    steps {
                        dir('backend') {
                            withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
                                sh '''
                                    snyk auth $SNYK_TOKEN
                                    snyk test --file=requirements.txt \
                                        --package-manager=pip \
                                        --severity-threshold=${SNYK_SEVERITY} \
                                        --json > snyk-backend-deps.json || true
                                    snyk test --file=requirements.txt \
                                        --package-manager=pip \
                                        --severity-threshold=${SNYK_SEVERITY} || true
                                '''
                            }
                        }
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'backend/snyk-backend-deps.json', allowEmptyArchive: true
                        }
                    }
                }

                stage('Snyk: Backend Code') {
                    steps {
                        dir('backend') {
                            withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
                                sh '''
                                    snyk auth $SNYK_TOKEN
                                    snyk code test \
                                        --severity-threshold=${SNYK_SEVERITY} || true
                                '''
                            }
                        }
                    }
                }

                stage('Snyk: Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
                                sh '''
                                    snyk auth $SNYK_TOKEN
                                    snyk test \
                                        --severity-threshold=${SNYK_SEVERITY} \
                                        --json > snyk-frontend-deps.json || true
                                    snyk test \
                                        --severity-threshold=${SNYK_SEVERITY} || true
                                '''
                            }
                        }
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'frontend/snyk-frontend-deps.json', allowEmptyArchive: true
                        }
                    }
                }
            }
        }

        // ========== 3. BUILD DOCKER IMAGES ==========
        stage('Build Images') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh """
                                docker build \
                                    -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                                    -t ${BACKEND_IMAGE}:latest \
                                    .
                            """
                        }
                    }
                }

                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh """
                                docker build \
                                    --build-arg BACKEND_URL=http://backend:8000 \
                                    -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                                    -t ${FRONTEND_IMAGE}:latest \
                                    .
                            """
                        }
                    }
                }
            }
        }

        // ========== 4. SCAN DOCKER IMAGES (Snyk Container) ==========
        stage('Scan Images') {
            parallel {
                stage('Snyk: Backend Image') {
                    steps {
                        withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
                            sh """
                                snyk auth \$SNYK_TOKEN
                                snyk container test ${BACKEND_IMAGE}:${IMAGE_TAG} \
                                    --severity-threshold=${SNYK_SEVERITY} || true
                            """
                        }
                    }
                }

                stage('Snyk: Frontend Image') {
                    steps {
                        withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
                            sh """
                                snyk auth \$SNYK_TOKEN
                                snyk container test ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                                    --severity-threshold=${SNYK_SEVERITY} || true
                            """
                        }
                    }
                }
            }
        }

        // ========== 5. PUSH TO DOCKER HUB ==========
        stage('Push Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''

                    sh """
                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }

        // ========== 6. DEPLOY TO K8S ==========
        stage('Deploy to K8s') {
            steps {
                echo "Deploying ${IMAGE_TAG} to K8s namespace ${K8S_NAMESPACE}..."

                // Apply K8s manifests
                sh """
                    kubectl apply -f k8s/app/namespace.yml
                    kubectl apply -f k8s/app/configmap.yml
                    kubectl apply -f k8s/app/secrets.yml
                    kubectl apply -f k8s/app/backend-service.yml
                    kubectl apply -f k8s/app/frontend-service.yml
                    kubectl apply -f k8s/app/backend-deployment.yml
                    kubectl apply -f k8s/app/frontend-deployment.yml
                """

                // Update image tags (rolling update)
                sh """
                    kubectl set image deployment/backend \
                        backend=${BACKEND_IMAGE}:${IMAGE_TAG} \
                        -n ${K8S_NAMESPACE}

                    kubectl set image deployment/frontend \
                        frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        -n ${K8S_NAMESPACE}
                """

                // Wait for rollout
                sh """
                    kubectl rollout status deployment/backend \
                        -n ${K8S_NAMESPACE} --timeout=120s

                    kubectl rollout status deployment/frontend \
                        -n ${K8S_NAMESPACE} --timeout=120s
                """
            }
        }

        // ========== 7. VERIFY DEPLOYMENT ==========
        stage('Verify') {
            steps {
                sh """
                    echo "=== Pods ==="
                    kubectl get pods -n ${K8S_NAMESPACE} -o wide

                    echo ""
                    echo "=== Services ==="
                    kubectl get svc -n ${K8S_NAMESPACE}

                    echo ""
                    echo "=== Deployment Status ==="
                    kubectl get deployments -n ${K8S_NAMESPACE}
                """

                // Health check backend
                sh """
                    BACKEND_POD=\$(kubectl get pod -n ${K8S_NAMESPACE} \
                        -l component=backend -o jsonpath='{.items[0].metadata.name}')
                    kubectl exec -n ${K8S_NAMESPACE} \$BACKEND_POD -- \
                        python -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8000/health').read().decode())"
                """
            }
        }
    }

    post {
        success {
            echo """
            =========================================
            ✅ Pipeline SUCCESS - Build #${env.BUILD_NUMBER}
            =========================================
            Tag:      ${env.IMAGE_TAG}
            Backend:  ${env.BACKEND_IMAGE}:${env.IMAGE_TAG}
            Frontend: ${env.FRONTEND_IMAGE}:${env.IMAGE_TAG}
            =========================================
            """
        }

        failure {
            echo """
            =========================================
            ❌ Pipeline FAILED - Build #${env.BUILD_NUMBER}
            =========================================
            Check logs for details.
            """
        }

        always {
            // Cleanup Docker images để tiết kiệm disk
            sh """
                docker rmi ${BACKEND_IMAGE}:${IMAGE_TAG} || true
                docker rmi ${FRONTEND_IMAGE}:${IMAGE_TAG} || true
                docker image prune -f || true
            """
        }
    }
}
