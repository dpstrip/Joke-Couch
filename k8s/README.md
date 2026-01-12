# Kubernetes Deployment for Joke-Couch

This directory contains Kubernetes manifests for deploying the Joke-Couch application to a Kubernetes cluster.

## Architecture

The application consists of three main components:

- **CouchDB** - Database service (single replica with persistent storage)
- **API** - Backend API service (2 replicas for high availability)
- **Web** - Frontend Next.js application (2 replicas for high availability)

## Prerequisites

- A running Kubernetes cluster (minikube, kind, GKE, EKS, AKS, etc.)
- `kubectl` CLI installed and configured to access your cluster
- Docker images available at Docker Hub: `dpstrip/joke-couch-*:1.4`

## Files Overview

- `deploy.sh` - Automated deployment script
- `couchdb-deployment.yaml` - CouchDB deployment configuration
- `couchdb-service.yaml` - CouchDB service (ClusterIP)
- `couchdb-pvc.yaml` - Persistent volume claim for CouchDB data
- `api-deployment.yaml` - API deployment configuration
- `api-service.yaml` - API service (ClusterIP)
- `web-deployment.yaml` - Web frontend deployment configuration
- `web-service.yaml` - Web service (ClusterIP)
- `ingress.yaml` - Ingress resource for external access
- `secret.yaml.example` - Example secret for CouchDB credentials

## Quick Start

### Option A: Using the Deployment Script (Recommended)

The easiest way to deploy is using the provided bash script:

```bash
# Basic deployment with default settings
./deploy.sh

# Deploy to a specific namespace
./deploy.sh --namespace joke-couch

# Deploy with custom CouchDB credentials
./deploy.sh --user admin --password your-secure-password

# Deploy everything including ingress
./deploy.sh --all

# Deploy to namespace with custom credentials
./deploy.sh -n joke-couch -u admin -p secretpass
```

**Script Options:**
- `-n, --namespace NAME` - Deploy to specific namespace (optional)
- `-u, --user USERNAME` - CouchDB username (default: admin)
- `-p, --password PASSWORD` - CouchDB password (default: password)
- `-s, --skip-ingress` - Skip ingress deployment
- `-a, --all` - Deploy everything including ingress
- `-c, --cleanup` - Remove all resources
- `-h, --help` - Show help message

**Cleanup:**
```bash
# Remove all deployed resources (preserves PVC)
./deploy.sh --cleanup

# Or if deployed to a namespace
./deploy.sh --namespace joke-couch --cleanup
```

### Option B: Manual Deployment

If you prefer to deploy manually:

#### 1. Create the namespace (optional)

```bash
kubectl create namespace joke-couch
kubectl config set-context --current --namespace=joke-couch
```

Or deploy everything in the `default` namespace.

#### 2. Create the secret for CouchDB credentials

**Option A: From the example file (for development/testing only)**

```bash
cp secret.yaml.example secret.yaml
kubectl apply -f secret.yaml
```

**Option B: Using kubectl (recommended for production)**

```bash
kubectl create secret generic couchdb-credentials \
  --from-literal=username=admin \
  --from-literal=password=your-secure-password
```

#### 3. Deploy the persistent volume claim

```bash
kubectl apply -f couchdb-pvc.yaml
```

#### 4. Deploy CouchDB

```bash
kubectl apply -f couchdb-deployment.yaml
kubectl apply -f couchdb-service.yaml
```

Wait for CouchDB to be ready:

```bash
kubectl wait --for=condition=ready pod -l app=couchdb --timeout=120s
```

#### 5. Deploy the API

```bash
kubectl apply -f api-deployment.yaml
kubectl apply -f api-service.yaml
```

Wait for API pods to be ready:

```bash
kubectl wait --for=condition=ready pod -l app=joke-couch-api --timeout=120s
```

#### 6. Deploy the Web frontend

```bash
kubectl apply -f web-deployment.yaml
kubectl apply -f web-service.yaml
```

#### 7. Deploy the Ingress (optional)

Before deploying the ingress, update the `host` field in `ingress.yaml` to match your domain:

```bash
# Edit ingress.yaml and change joke-couch.example.com to your domain
kubectl apply -f ingress.yaml
```

### Option C: Deploy Everything at Once Manually

To deploy all components in the correct order without the script:

```bash
# Create secret
kubectl create secret generic couchdb-credentials \
  --from-literal=username=admin \
  --from-literal=password=your-secure-password

# Apply all manifests
kubectl apply -f couchdb-pvc.yaml
kubectl apply -f couchdb-deployment.yaml
kubectl apply -f couchdb-service.yaml
kubectl apply -f api-deployment.yaml
kubectl apply -f api-service.yaml
kubectl apply -f web-deployment.yaml
kubectl apply -f web-service.yaml
kubectl apply -f ingress.yaml
```

Or use a single command to apply all YAML files (after creating the secret):

```bash
kubectl apply -f .
```

## Accessing the Application

### Using Port Forwarding (for testing)

Forward the web service to your local machine:

```bash
kubectl port-forward service/joke-couch-web 8080:80
```

Then access the application at http://localhost:8080

Forward the API service:

```bash
kubectl port-forward service/joke-couch-api 3000:3000
```

Access the API and Swagger docs at http://localhost:3000/docs

Forward CouchDB (for admin access):

```bash
kubectl port-forward service/couchdb 5984:5984
```

Access Fauxton at http://localhost:5984/_utils/

### Using Ingress

If you've configured the ingress with a valid domain and have an ingress controller installed:

1. Update your DNS to point to your ingress controller's external IP
2. Access the application at `http://your-domain.com`
3. Access the API at `http://your-domain.com/api`
4. Access CouchDB Fauxton at `http://your-domain.com/_utils`

## Monitoring and Debugging

Check the status of all pods:

```bash
kubectl get pods
```

View logs for a specific service:

```bash
# CouchDB logs
kubectl logs -l app=couchdb -f

# API logs
kubectl logs -l app=joke-couch-api -f

# Web logs
kubectl logs -l app=joke-couch-web -f
```

Describe a deployment for troubleshooting:

```bash
kubectl describe deployment couchdb
kubectl describe deployment joke-couch-api
kubectl describe deployment joke-couch-web
```

Check service endpoints:

```bash
kubectl get endpoints
```

## Scaling

Scale the API or Web deployments:

```bash
# Scale API to 3 replicas
kubectl scale deployment joke-couch-api --replicas=3

# Scale Web to 4 replicas
kubectl scale deployment joke-couch-web --replicas=4
```

**Note:** CouchDB should remain at 1 replica unless you configure a CouchDB cluster.

## Updating the Application

To update to a new version (e.g., 1.5):

```bash
# Update API
kubectl set image deployment/joke-couch-api api=dpstrip/joke-couch-api:1.5

# Update Web
kubectl set image deployment/joke-couch-web web=dpstrip/joke-couch-web:1.5

# Update CouchDB (be careful with database updates)
kubectl set image deployment/couchdb couchdb=dpstrip/joke-couch-db:1.5
```

Or edit the YAML files and reapply:

```bash
kubectl apply -f api-deployment.yaml
kubectl apply -f web-deployment.yaml
```

## Cleanup
### Using the Script

```bash
# Remove all resources (preserves PVC to protect data)
./deploy.sh --cleanup

# Or with namespace
./deploy.sh --namespace joke-couch --cleanup
```

The script will preserve the PersistentVolumeClaim to protect your data. To delete it:

```bash
kubectl delete -f couchdb-pvc.yaml
# Or with namespace: kubectl delete -n joke-couch -f couchdb-pvc.yaml
```

### Manual Cleanup

Remove all resources:

```bash
kubectl delete -f .
```

Delete the secret:

```bash
kubectl delete secret couchdb-credentials
```

To completely remove the namespace (if you created one):

```bash
kubectl delete namespace joke-couch
```

**Warning:** Deleting the namespace
**Warning:** This will delete the persistent volume and all data!

## Production Considerations

### Security

1. **Use strong passwords**: Don't use default credentials in production
2. **Use proper secrets management**: Consider using external secret managers (AWS Secrets Manager, HashiCorp Vault, etc.)
3. **Enable TLS**: Configure TLS certificates for the ingress
4. **Network Policies**: Add network policies to restrict traffic between pods
5. **RBAC**: Configure proper role-based access control

### High Availability

1. **Multiple replicas**: The API and Web services already have 2 replicas
2. **Pod Disruption Budgets**: Add PDBs to ensure availability during updates
3. **CouchDB clustering**: For production, consider configuring CouchDB in cluster mode

### Storage

1. **Storage Class**: Specify an appropriate storage class for your cloud provider
2. **Backup**: Implement regular backups of the CouchDB persistent volume
3. **Volume expansion**: Ensure your storage class supports volume expansion

### Resource Management

1. **Resource limits**: Adjust CPU and memory limits based on your workload
2. **Autoscaling**: Consider implementing Horizontal Pod Autoscaler (HPA) for API and Web
3. **Monitoring**: Set up Prometheus and Grafana for monitoring

### Example HPA Configuration

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: joke-couch-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: joke-couch-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Ingress Controllers

The ingress configuration works with most ingress controllers. Common options:

- **NGINX Ingress Controller** - Most widely used
- **Traefik** - Cloud-native with automatic TLS
- **Kong** - API Gateway with advanced features
- **Cloud Provider Ingress** - GKE, EKS, AKS native ingress

Install NGINX Ingress Controller:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

## TLS/HTTPS Setup

To enable HTTPS with Let's Encrypt:

1. Install cert-manager:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

2. Create a ClusterIssuer:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

3. Uncomment the TLS section in `ingress.yaml` and the cert-manager annotation

## Support

For issues or questions about the application, refer to the main [README.md](../README.md) in the repository root.
