"""
Elastic Beanstalk entry point - redirects to FastAPI app
"""
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from backend.api.main import app

# This is the application object that Elastic Beanstalk expects
application = app




