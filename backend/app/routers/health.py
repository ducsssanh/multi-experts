from fastapi import APIRouter
import time

router = APIRouter(tags=["health"])

# Track service start time
START_TIME = time.time()


@router.get("/health")
async def health():
    """Health check for Docker HEALTHCHECK and load balancers."""
    uptime_seconds = int(time.time() - START_TIME)
    return {
        "status": "healthy",
        "service": "mlops-backend",
        "uptime_seconds": uptime_seconds
    }


@router.get("/healthz")
async def healthz():
    """Kubernetes liveness probe."""
    return {"status": "ok"}


@router.get("/readyz")
async def readyz():
    """Kubernetes readiness probe."""
    # TODO: check DB connection, vLLM reachability, etc.
    return {"status": "ready"}
