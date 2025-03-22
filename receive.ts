#!/usr/bin/env -S deno run --allow-env --allow-net
/**
 * receive.ts
 *
 * Receives messages from an AWS SQS Queue using the AWS SDK for JavaScript v3.
 * Uses environment variables for configuration:
 *   - AWS_REGION (default: "us-east-1")
 *   - AWS_ACCESS_KEY_ID
 *   - AWS_SECRET_ACCESS_KEY
 *   - SQS_QUEUE_URL
 *
 * To run:
 *   deno run --allow-env --allow-net receive.ts
 */

import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";

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

// Prepare the receive message command with long polling (10 seconds).
const command = new ReceiveMessageCommand({
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 1,
  WaitTimeSeconds: 10,
});

try {
  // Receive messages from the queue.
  const response = await client.send(command);
  if (response.Messages && response.Messages.length > 0) {
    const message = response.Messages[0];
    console.log("Received message:", message.Body);

    // If the message was received, delete it from the queue.
    if (message.ReceiptHandle) {
      const deleteCommand = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      });
      await client.send(deleteCommand);
      console.log("Message deleted from the queue.");
    }
  } else {
    console.log("No messages received.");
  }
} catch (error) {
  console.error("Error receiving message:", error);
}
