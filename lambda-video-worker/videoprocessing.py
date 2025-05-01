import json
import boto3
import subprocess
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client('s3')

def lambda_handler(event, context):
    logger.info(f"Event received: {json.dumps(event)}")
    try:
        for record in event['Records']:
            s3_info = record['s3']

            input_bucket = s3_info['bucket']['name']
            input_key = s3_info['object']['key']
            input_filename = os.path.basename(input_key)
            local_input_path = f"/tmp/{input_filename}"
            local_output_path = f"/tmp/processed_{input_filename}"

            output_bucket = "vetubebucket"
            output_key = f"processed/720p/{input_filename}"

            logger.info(f"Downloading from s3://{input_bucket}/{input_key}")
            s3.download_file(input_bucket, input_key, local_input_path)

            ffmpeg_command = [
                "/opt/ffmpeg/ffmpeg",
                "-i", local_input_path,
                "-vf", "scale=-1:720",
                "-c:v", "libx264",
                "-preset", "fast",
                "-crf", "28",
                local_output_path
            ]

            logger.info(f"Running FFmpeg command: {' '.join(ffmpeg_command)}")
            subprocess.run(ffmpeg_command, check=True)

            logger.info(f"Uploading to s3://{output_bucket}/{output_key}")
            s3.upload_file(local_output_path, output_bucket, output_key)

            return {
                "statusCode": 200,
                "body": f"Video processed and uploaded to s3://{output_bucket}/{output_key}"
            }

    except Exception as e:
        logger.error(f"Error: {e}")
        return {
            "statusCode": 500,
            "body": str(e)
        }
