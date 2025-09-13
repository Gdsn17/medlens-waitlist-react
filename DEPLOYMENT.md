# MedLens Waitlist - GCP GKE Deployment Guide

This guide will help you deploy the MedLens Waitlist application to Google Cloud Platform using Google Kubernetes Engine (GKE).

## Prerequisites

1. **Google Cloud Platform Account**
2. **Docker installed** (already done)
3. **Google Cloud SDK (gcloud)**
4. **kubectl**
5. **MongoDB Atlas account** (for production database)

## Setup Steps

### 1. Google Cloud Setup

```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Login to Google Cloud
gcloud auth login

# Set your project ID
export PROJECT_ID="your-gcp-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable container.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable compute.googleapis.com
```

### 2. Create Artifact Registry

```bash
# Create Artifact Registry repository
gcloud artifacts repositories create medlens-waitlist \
    --repository-format=docker \
    --location=us-central1 \
    --description="MedLens Waitlist Docker repository"

# Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### 3. Create GKE Cluster

```bash
# Create GKE cluster
gcloud container clusters create medlens-cluster \
    --zone=us-central1-a \
    --num-nodes=2 \
    --machine-type=e2-medium \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=5 \
    --enable-autorepair \
    --enable-autoupgrade

# Get cluster credentials
gcloud container clusters get-credentials medlens-cluster --zone=us-central1-a
```

### 4. Set up MongoDB

For production, use MongoDB Atlas:

1. Create a MongoDB Atlas account
2. Create a cluster
3. Get the connection string
4. Update the secret in `k8s/mongodb-secret.yaml`

```bash
# Encode your MongoDB URI
echo -n "mongodb+srv://username:password@cluster.mongodb.net/medlens-waitlist" | base64

# Update the secret file
# Replace the base64 encoded string in k8s/mongodb-secret.yaml
```

### 5. Build and Push Images

```bash
# Make the script executable
chmod +x scripts/build-and-push.sh

# Update PROJECT_ID in the script
# Edit scripts/build-and-push.sh and replace "your-gcp-project-id" with your actual project ID

# Run the build and push script
./scripts/build-and-push.sh
```

### 6. Deploy to GKE

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb-secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml

# Check deployment status
kubectl get pods -n medlens-waitlist
kubectl get services -n medlens-waitlist
kubectl get ingress -n medlens-waitlist
```

### 7. Set up GitHub Actions (Optional)

1. Go to your GitHub repository settings
2. Navigate to Secrets and Variables > Actions
3. Add the following secrets:
   - `GCP_PROJECT_ID`: Your Google Cloud project ID
   - `GCP_SA_KEY`: Service account key JSON (create a service account with necessary permissions)

### 8. Domain Setup (Future)

When you're ready to use a custom domain:

1. Reserve a static IP address:
```bash
gcloud compute addresses create medlens-ip --global
```

2. Update the ingress configuration:
```bash
# Update k8s/ingress.yaml with your domain
# Replace "medlens.yourdomain.com" with your actual domain
```

3. Set up SSL certificate:
```bash
# Create managed SSL certificate
kubectl apply -f - <<EOF
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: medlens-ssl-cert
  namespace: medlens-waitlist
spec:
  domains:
    - medlens.yourdomain.com
EOF
```

## Local Development with Docker

```bash
# Start all services locally
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Useful Commands

```bash
# View pod logs
kubectl logs -f deployment/medlens-backend -n medlens-waitlist
kubectl logs -f deployment/medlens-frontend -n medlens-waitlist

# Scale deployments
kubectl scale deployment medlens-backend --replicas=3 -n medlens-waitlist

# Port forward for local testing
kubectl port-forward service/medlens-frontend-service 3000:80 -n medlens-waitlist
kubectl port-forward service/medlens-backend-service 5001:80 -n medlens-waitlist

# Delete everything
kubectl delete namespace medlens-waitlist
```

## Troubleshooting

1. **Pods not starting**: Check logs with `kubectl logs <pod-name> -n medlens-waitlist`
2. **Image pull errors**: Ensure images are pushed to Artifact Registry
3. **Database connection issues**: Verify MongoDB URI in the secret
4. **Ingress not working**: Check if static IP is assigned and domain is configured

## Cost Optimization

- Use preemptible nodes for development
- Set up cluster autoscaling
- Use appropriate machine types
- Monitor resource usage with Cloud Monitoring
