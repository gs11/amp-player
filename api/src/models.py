from typing import List, Optional

from pydantic import BaseModel


class Artist(BaseModel):
    id: int
    handle: str
    real_name: Optional[str] = None
    country: Optional[str] = None
    amp_url: str


class Module(BaseModel):
    id: int
    name: str
    composers: List[str]
    format: str
    size: str
