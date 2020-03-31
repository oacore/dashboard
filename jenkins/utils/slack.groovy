def sendSlackNotification(String message, String color = "#32CD32") {
    slackSend channel: "#dashboard", message: message, color: "$color"
}
