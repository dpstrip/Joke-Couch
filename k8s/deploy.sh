#!/bin/bash

# Joke-Couch Kubernetes Deployment Script
# This script automates the deployment of the Joke-Couch application to a Kubernetes cluster

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
NAMESPACE=""
COUCHDB_USER="admin"
COUCHDB_PASSWORD="password"
SKIP_INGRESS=false
DEPLOY_ALL=false
CLEANUP=false
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Deploy Joke-Couch application to Kubernetes cluster.

OPTIONS:
    -n, --namespace NAME        Deploy to specific namespace (optional)
    -u, --user USERNAME         CouchDB username (default: admin)
    -p, --password PASSWORD     CouchDB password (default: password)
    -s, --skip-ingress          Skip ingress deployment
    -a, --all                   Deploy everything including ingress
    -c, --cleanup               Remove all resources
    -h, --help                  Show this help message

EXAMPLES:
    # Deploy with default settings
    $0

    # Deploy to specific namespace
    $0 --namespace joke-couch

    # Deploy with custom credentials
    $0 --user myuser --password mypassword

    # Deploy everything including ingress
    $0 --all

    # Clean up all resources
    $0 --cleanup

    # Deploy to namespace with custom credentials, skip ingress
    $0 -n joke-couch -u admin -p secretpass -s

EOF
    exit 0
}

# Function to check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl not found. Please install kubectl first."
        exit 1
    fi
    print_success "kubectl is installed"
}

# Function to check if cluster is accessible
check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
        exit 1
    fi
    print_success "Connected to Kubernetes cluster"
}

# Function to create namespace if specified
create_namespace() {
    if [ -n "$NAMESPACE" ]; then
        if kubectl get namespace "$NAMESPACE" &> /dev/null; then
            print_info "Namespace '$NAMESPACE' already exists"
        else
            print_info "Creating namespace '$NAMESPACE'..."
            kubectl create namespace "$NAMESPACE"
            print_success "Namespace '$NAMESPACE' created"
        fi
    fi
}

# Function to set kubectl context namespace
set_namespace_context() {
    if [ -n "$NAMESPACE" ]; then
        KUBECTL_CMD="kubectl -n $NAMESPACE"
    else
        KUBECTL_CMD="kubectl"
    fi
}

# Function to create secret
create_secret() {
    print_info "Creating CouchDB credentials secret..."
    
    if $KUBECTL_CMD get secret couchdb-credentials &> /dev/null; then
        print_warning "Secret 'couchdb-credentials' already exists. Deleting and recreating..."
        $KUBECTL_CMD delete secret couchdb-credentials
    fi
    
    $KUBECTL_CMD create secret generic couchdb-credentials \
        --from-literal=username="$COUCHDB_USER" \
        --from-literal=password="$COUCHDB_PASSWORD"
    
    print_success "Secret created successfully"
}

# Function to deploy CouchDB
deploy_couchdb() {
    print_info "Deploying CouchDB..."
    
    print_info "  - Applying PersistentVolumeClaim..."
    $KUBECTL_CMD apply -f "$SCRIPT_DIR/couchdb-pvc.yaml"
    
    print_info "  - Applying CouchDB Deployment..."
    $KUBECTL_CMD apply -f "$SCRIPT_DIR/couchdb-deployment.yaml"
    
    print_info "  - Applying CouchDB Service..."
    $KUBECTL_CMD apply -f "$SCRIPT_DIR/couchdb-service.yaml"
    
    print_info "Waiting for CouchDB to be ready (timeout: 120s)..."
    if $KUBECTL_CMD wait --for=condition=ready pod -l app=couchdb --timeout=120s; then
        print_success "CouchDB is ready"
    else
        print_error "CouchDB failed to become ready within timeout"
        exit 1
    fi
}

# Function to deploy API
deploy_api() {
    print_info "Deploying API..."
    
    print_info "  - Applying API Deployment..."
    $KUBECTL_CMD apply -f "$SCRIPT_DIR/api-deployment.yaml"
    
    print_info "  - Applying API Service..."
    $KUBECTL_CMD apply -f "$SCRIPT_DIR/api-service.yaml"
    
    print_info "Waiting for API to be ready (timeout: 120s)..."
    if $KUBECTL_CMD wait --for=condition=ready pod -l app=joke-couch-api --timeout=120s; then
        print_success "API is ready"
    else
        print_error "API failed to become ready within timeout"
        exit 1
    fi
}

# Function to deploy Web
deploy_web() {
    print_info "Deploying Web frontend..."
    
    print_info "  - Applying Web Deployment..."
    $KUBECTL_CMD apply -f "$SCRIPT_DIR/web-deployment.yaml"
    
    print_info "  - Applying Web Service..."
    $KUBECTL_CMD apply -f "$SCRIPT_DIR/web-service.yaml"
    
    print_info "Waiting for Web to be ready (timeout: 120s)..."
    if $KUBECTL_CMD wait --for=condition=ready pod -l app=joke-couch-web --timeout=120s; then
        print_success "Web frontend is ready"
    else
        print_error "Web frontend failed to become ready within timeout"
        exit 1
    fi
}

# Function to deploy Ingress
deploy_ingress() {
    print_info "Deploying Ingress..."
    $KUBECTL_CMD apply -f "$SCRIPT_DIR/ingress.yaml"
    print_success "Ingress deployed"
    print_warning "Remember to update the host field in ingress.yaml to match your domain"
}

# Function to show deployment status
show_status() {
    echo ""
    print_info "=== Deployment Status ==="
    echo ""
    
    print_info "Pods:"
    $KUBECTL_CMD get pods
    echo ""
    
    print_info "Services:"
    $KUBECTL_CMD get services
    echo ""
    
    if ! $SKIP_INGRESS || $DEPLOY_ALL; then
        print_info "Ingress:"
        $KUBECTL_CMD get ingress
        echo ""
    fi
}

# Function to show access instructions
show_access_instructions() {
    echo ""
    print_success "=== Deployment Complete! ==="
    echo ""
    print_info "Access the application using port-forward:"
    echo ""
    echo "  Web UI:"
    if [ -n "$NAMESPACE" ]; then
        echo "    kubectl port-forward -n $NAMESPACE service/joke-couch-web 8080:80"
    else
        echo "    kubectl port-forward service/joke-couch-web 8080:80"
    fi
    echo "    Then open: http://localhost:8080"
    echo ""
    echo "  API + Swagger:"
    if [ -n "$NAMESPACE" ]; then
        echo "    kubectl port-forward -n $NAMESPACE service/joke-couch-api 3000:3000"
    else
        echo "    kubectl port-forward service/joke-couch-api 3000:3000"
    fi
    echo "    Then open: http://localhost:3000/docs"
    echo ""
    echo "  CouchDB Fauxton:"
    if [ -n "$NAMESPACE" ]; then
        echo "    kubectl port-forward -n $NAMESPACE service/couchdb 5984:5984"
    else
        echo "    kubectl port-forward service/couchdb 5984:5984"
    fi
    echo "    Then open: http://localhost:5984/_utils/"
    echo "    Login with: $COUCHDB_USER / $COUCHDB_PASSWORD"
    echo ""
    
    if ! $SKIP_INGRESS || $DEPLOY_ALL; then
        print_info "Ingress is deployed. If you have configured DNS and ingress controller:"
        echo "    Update the host in ingress.yaml and access via your domain"
    fi
    echo ""
}

# Function to cleanup resources
cleanup() {
    print_warning "This will delete all Joke-Couch resources from the cluster!"
    read -p "Are you sure you want to continue? (yes/no): " -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Cleanup cancelled"
        exit 0
    fi
    
    print_info "Cleaning up resources..."
    
    set_namespace_context
    
    print_info "Deleting Ingress..."
    $KUBECTL_CMD delete -f "$SCRIPT_DIR/ingress.yaml" --ignore-not-found=true
    
    print_info "Deleting Web..."
    $KUBECTL_CMD delete -f "$SCRIPT_DIR/web-service.yaml" --ignore-not-found=true
    $KUBECTL_CMD delete -f "$SCRIPT_DIR/web-deployment.yaml" --ignore-not-found=true
    
    print_info "Deleting API..."
    $KUBECTL_CMD delete -f "$SCRIPT_DIR/api-service.yaml" --ignore-not-found=true
    $KUBECTL_CMD delete -f "$SCRIPT_DIR/api-deployment.yaml" --ignore-not-found=true
    
    print_info "Deleting CouchDB..."
    $KUBECTL_CMD delete -f "$SCRIPT_DIR/couchdb-service.yaml" --ignore-not-found=true
    $KUBECTL_CMD delete -f "$SCRIPT_DIR/couchdb-deployment.yaml" --ignore-not-found=true
    
    print_info "Deleting Secret..."
    $KUBECTL_CMD delete secret couchdb-credentials --ignore-not-found=true
    
    print_warning "Persistent Volume Claim will NOT be deleted to preserve data"
    print_info "To delete PVC and all data, run:"
    if [ -n "$NAMESPACE" ]; then
        echo "    kubectl delete -n $NAMESPACE -f $SCRIPT_DIR/couchdb-pvc.yaml"
    else
        echo "    kubectl delete -f $SCRIPT_DIR/couchdb-pvc.yaml"
    fi
    
    if [ -n "$NAMESPACE" ]; then
        echo ""
        print_info "To delete the namespace, run:"
        echo "    kubectl delete namespace $NAMESPACE"
    fi
    
    print_success "Cleanup complete"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -n|--namespace)
            NAMESPACE="$2"
            shift 2
            ;;
        -u|--user)
            COUCHDB_USER="$2"
            shift 2
            ;;
        -p|--password)
            COUCHDB_PASSWORD="$2"
            shift 2
            ;;
        -s|--skip-ingress)
            SKIP_INGRESS=true
            shift
            ;;
        -a|--all)
            DEPLOY_ALL=true
            shift
            ;;
        -c|--cleanup)
            CLEANUP=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            print_error "Unknown option: $1"
            usage
            ;;
    esac
done

# Main execution
print_info "Joke-Couch Kubernetes Deployment Script"
echo ""

# Check prerequisites
check_kubectl
check_cluster

if $CLEANUP; then
    cleanup
    exit 0
fi

# Create namespace if specified
create_namespace

# Set namespace context for kubectl commands
set_namespace_context

# Deploy application
create_secret
deploy_couchdb
deploy_api
deploy_web

if $DEPLOY_ALL || ! $SKIP_INGRESS; then
    deploy_ingress
fi

# Show status and instructions
show_status
show_access_instructions

print_success "All done! 🎉"
