import httpx

from app.config import get_settings


class LLMClient:
    """Thin async wrapper around your vLLM inference endpoint."""

    def __init__(self):
        settings = get_settings()
        self.base_url = settings.VLLM_BASE_URL
        self._client = httpx.AsyncClient(base_url=self.base_url, timeout=60.0)

    async def generate(self, prompt: str, model: str | None = None) -> str:
        # TODO: call vLLM /v1/completions or /v1/chat/completions
        ...

    async def stream(self, prompt: str, model: str | None = None):
        # TODO: yield chunks from vLLM streaming endpoint
        ...

    async def close(self):
        await self._client.aclose()
