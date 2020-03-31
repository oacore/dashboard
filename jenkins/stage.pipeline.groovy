def slack

pipeline {
    agent {
        label "master"
    }

    options {
        ansiColor colorMapName: "XTerm"
    }

    parameters {
        string(
            name: 'SERVERS_TO_DEPLOY',
            defaultValue: '',
            description: 'Servers where to deploy dashboard. (Separated by semicolon)'
        )
    }

    environment {
        NODE_ENV = "production"
    }

    stages {
        stage("Load libraries and global variables") {
            steps {
                script {
                    rootDir = pwd()
                    utils = load "${rootDir}/jenkins/pipeline/utils/slack.groovy"
                }
            }
        }

        stage("Build application") {
            steps {
                script {
                  sh """
                    npm ci
                    npm run build
                  """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
