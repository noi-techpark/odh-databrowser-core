pipeline {
    agent any

    environment {
        DOCKER_PROJECT_NAME = "odh-databrowser-core"
        DOCKER_IMAGE = '755952719952.dkr.ecr.eu-west-1.amazonaws.com/odh-databrowser-core'
        DOCKER_TAG = "test-$BUILD_NUMBER"
	ASPNETCORE_ENVIRONMENT = "Development"   
	SERVER_PORT = "1022"                
    }

    stages {
        stage('Configure') {
            steps {
                sh """
                    rm -f .env
                    cp .env.example .env
                    echo 'COMPOSE_PROJECT_NAME=${DOCKER_PROJECT_NAME}' >> .env
                    echo 'DOCKER_IMAGE=${DOCKER_IMAGE}' >> .env
                    echo 'DOCKER_TAG=${DOCKER_TAG}' >> .env
		    echo 'DOCKER_TAG=${ASPNETCORE_ENVIRONMENT}' >> .env		    
                    echo 'SERVER_PORT=${SERVER_PORT}' >> .env                                        
                """
            }
        }
        stage('Build') {
            steps {
                sh '''
                    aws ecr get-login --region eu-west-1 --no-include-email | bash
                    docker-compose --no-ansi -f docker-compose.yml build --pull
                    docker-compose --no-ansi -f docker-compose.yml push
                '''
            }
        }
        stage('Deploy') {
            steps {
               sshagent(['jenkins-ssh-key']) {
                    sh """
                        (cd infrastructure/ansible && ansible-galaxy install -f -r requirements.yml)
                        (cd infrastructure/ansible && ansible-playbook --limit=test deploy.yml --extra-vars "release_name=${BUILD_NUMBER}")
                    """
                }
            }
        }
    }
}
