#!/usr/bin/env -S deno run --allow-env --allow-net
/**
 * send.ts
 *
 * Sends a message to an AWS SQS Queue using the AWS SDK for JavaScript v3.
 * Uses environment variables for configuration:
 *   - AWS_REGION (default: "us-east-1")
 *   - AWS_ACCESS_KEY_ID
 *   - AWS_SECRET_ACCESS_KEY
 *   - SQS_QUEUE_URL
 *
 * To run:
 *   deno run --allow-env --allow-net send.ts
 */

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

// Read configuration from environment variables.
const region = Deno.env.get("AWS_REGION") || "us-east-1";
const accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
const secretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
const queueUrl = Deno.env.get("SQS_QUEUE_URL");

if (!accessKeyId || !secretAccessKey || !queueUrl) {
  console.error(
    "Missing required environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SQS_QUEUE_URL"
  );
  Deno.exit(1);
}

// Create an SQS client instance.
const client = new SQSClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

// Define the message to be sent.
const messageBody = "Hello from Deno v2 using ES2024 and Web APIs!";

// Prepare the send message command.
const command = new SendMessageCommand({
  QueueUrl: queueUrl,
  MessageBody: messageBody,
});

try {
  // Send the message.
  const response = await client.send(command);
  console.log("Message sent successfully with MessageId:", response.MessageId);
} catch (error) {
  console.error("Error sending message:", error);
}
