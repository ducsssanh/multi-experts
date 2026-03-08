"""Mock LLM client — returns a fixed response for every request."""

import asyncio
from collections.abc import AsyncGenerator


class LLMClient:
    """Mock LLM client. Replace with real vLLM calls later."""

    async def generate(self, prompt: str, model: str | None = None) -> str:
        await asyncio.sleep(0.1)
        return "Hello! I'm a mock expert. Real LLM integration coming soon."

    async def stream(self, prompt: str, model: str | None = None) -> AsyncGenerator[str, None]:
        response = "Hello! I'm a mock expert. Real LLM integration coming soon."
        for word in response.split(" "):
            await asyncio.sleep(0.05)
            yield word + " "

    async def close(self):
        pass
