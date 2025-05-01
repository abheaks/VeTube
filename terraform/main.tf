provider "aws" {
  region = "us-east-1"
}

# S3 Bucket for raw video uploads
resource "aws_s3_bucket" "upload_bucket" {
  bucket = "vetube-upload-bucket"
}

# S3 Bucket for processed videos
resource "aws_s3_bucket" "processed_bucket" {
  bucket = "vetube-processed-bucket"
}

# SQS queue to decouple S3 events and Lambda
resource "aws_sqs_queue" "vetube_queue" {
  name = "VeTubeQueue"
}

# IAM Role for Lambda execution
resource "aws_iam_role" "lambda_exec" {
  name = "vetube_lambda_exec"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Attach basic execution + S3 + SQS access
resource "aws_iam_role_policy" "lambda_policy" {
  name = "vetube_lambda_policy"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:*"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ],
        Resource = [
          "${aws_s3_bucket.upload_bucket.arn}/*",
          "${aws_s3_bucket.processed_bucket.arn}/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ],
        Resource = aws_sqs_queue.vetube_queue.arn
      }
    ]
  })
}

# Lambda function for video processing
resource "aws_lambda_function" "video_processor" {
  function_name = "vetube-video-processor"
  runtime       = "python3.9"
  handler       = "lambda_function.lambda_handler"
  timeout       = 900
  memory_size   = 1024
  role          = aws_iam_role.lambda_exec.arn

  filename         = "lambda.zip"
  source_code_hash = filebase64sha256("lambda.zip")

  environment {
    variables = {
      OUTPUT_BUCKET = aws_s3_bucket.processed_bucket.bucket
    }
  }
}

# Trigger Lambda via SQS
resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = aws_sqs_queue.vetube_queue.arn
  function_name    = aws_lambda_function.video_processor.arn
  batch_size       = 1
  enabled          = true
}

# S3 → SQS notification setup (when video is uploaded)
resource "aws_s3_bucket_notification" "upload_notification" {
  bucket = aws_s3_bucket.upload_bucket.id

  queue {
    queue_arn     = aws_sqs_queue.vetube_queue.arn
    events        = ["s3:ObjectCreated:Put"]
    filter_prefix = "videos/"
    filter_suffix = ".mp4"
  }

  depends_on = [aws_sqs_queue.vetube_queue]
}
