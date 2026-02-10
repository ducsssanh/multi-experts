from fastapi import Depends

from app.config import Settings, get_settings
from app.db.session import get_db

# Re-export common dependencies for convenience
# Usage in routers:  settings: Settings = Depends(get_settings)
#                    db: AsyncSession = Depends(get_db)
