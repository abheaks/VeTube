# VeTube – A Scalable YouTube Clone

## 🚀 Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (React Framework)  
- **Backend API:** [Spring Boot](https://spring.io/projects/spring-boot) (Java), deployed on **AWS Elastic Beanstalk**  
- **Video Processing Backend:**
  - **Serverless Compute:** AWS Lambda (Python)
  - **Media Processing:** FFmpeg via Lambda Layers  
- **Storage & Messaging:** Amazon S3, Amazon SQS  
- **Caching:** Redis with AWS ElastiCache  
- **Infrastructure as Code:** Terraform, AWS IAM  
- **Monitoring & Logging:** Amazon CloudWatch Logs  
- **Architecture Pattern:** Event-driven, serverless microservices

---

## 📦 Overview

**VeTube** is a cloud-native, scalable YouTube-like platform where users can upload videos that are automatically transcoded into multiple resolutions (e.g., 720p, 480p) for adaptive streaming.

The system uses a modern serverless architecture built on AWS to deliver scalable video processing with minimal operational overhead.

---

## 🔁 Architecture Flow

1. **Frontend Upload:**  
   Users upload raw video files via the **Next.js** frontend.

2. **Metadata Storage:**  
   The **Spring Boot** backend stores video metadata (e.g., title, description, uploader info) in a database and uploads the raw video to:  
   `s3://vetubebucket/videos/`

3. **Trigger:**  
   S3 `PutObject` event triggers and sends a message to **Amazon SQS** queue.

4. **Video Processing:**  
   - **Lambda** polls the SQS queue and downloads the raw video.
   - **FFmpeg** (via Lambda Layer) transcodes the video into 720p and/or 480p.

5. **Processed Storage:**  
   Processed videos are uploaded back to:  
   `s3://vetubebucket/processed/`

6. **Monitoring:**  
   System activity and logs are tracked using **CloudWatch Logs**.

---

## 🧠 Caching Layer (Redis + ElastiCache)

To optimize performance and reduce database load, **Redis caching** is implemented using **AWS ElastiCache**. The Spring Boot backend uses Redis to store frequently accessed metadata such as video titles, descriptions, and view counts.

### 🔄 What is Cached?
- Video metadata (`title`, `views`, `uploader`)
- Trending/recently viewed video lists
- User-specific content like watch history

### ⚙️ How It Works:
- Uses `@Cacheable`, `@CachePut`, and `@CacheEvict` annotations in Spring Boot.
- Redis TTL (Time-To-Live) is configured for auto-expiry of cache entries.
- Caching fallback to DB ensures fault tolerance.

### 🔧 Tech Used:
- [Spring Boot Cache Abstraction](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#io.caching)
- [AWS ElastiCache for Redis](https://aws.amazon.com/elasticache/redis/)
- Local Redis for development

### 📈 Benefits:
- ⚡ Faster API responses
- 🔁 Reduced load on the database
- 🌐 Improves scalability of metadata-heavy operations

---

## ✅ Key Highlights

- ⚙️ **Scalable serverless video pipeline**
- 🎞️ **Efficient transcoding with FFmpeg on AWS Lambda**
- 🌍 **Cloud-native design using S3, SQS, and Lambda**
- 🛡️ **Infrastructure-as-Code with Terraform**
- 🧠 **Metadata caching with Redis + ElastiCache**
- 💬 **Modular microservice architecture – easy to extend**
- 📈 **Real-time logging and monitoring with CloudWatch**

---

## 📌 Future Enhancements

- Thumbnail generation
- Multi-resolution adaptive streaming (HLS)
- User authentication and playlists
- CDN integration for video delivery
- User Interaction (Like, Comment)
- Load Balancing

---

## 📸 Screenshots

<img width="976" alt="Screenshot 2025-04-24 at 10 14 31 PM" src="https://github.com/user-attachments/assets/217b4e24-9de4-4286-adcc-06a4f6924913" />

---

## 📁 Repository Structure

```bash
├── VeTubeClient/            # Next.js UI
├── VeTubeServer/           # Spring Boot metadata API
├── lambda-video-worker/    # Python Lambda for FFmpeg processing
├── terraform/              # IaC for AWS resources
