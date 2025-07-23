# AegisAlert Deployment

## Overview

AegisAlert is deployed using a two-EC2 instance architecture on AWS:

* **Public EC2:** Hosts the frontend and handles internet traffic.
* **Private EC2:** Hosts backend services including Django app, PostgreSQL (with PostGIS), Redis, and Celery workers, all containerized via Docker.

## Key Features

* Backend runs securely in a private subnet with no direct internet exposure.
* Public EC2 forwards traffic to backend via IP forwarding and iptables rules.
* Docker Compose manages multi-container backend and frontend services separately.
* Ansible automates server setup and Docker installation.

## How to Use

1. SSH into the public EC2 instance.
2. Use SCP or SSH forwarding to transfer files to the private EC2.
3. Deploy backend containers on private EC2 using Docker Compose.
4. Deploy frontend containers on public EC2 separately.
5. Access the frontend via the public EC2’s public IP on port 80 (or configured port).
6. Backend APIs are accessible through the routed port 8000 on the public EC2.

## Network Setup

* Security groups restrict direct backend access.
* IP forwarding on public EC2 routes frontend requests to backend securely.

