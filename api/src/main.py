from typing import List
import http

from fastapi import FastAPI, Response, HTTPException
from mangum import Mangum

from . import amp
from .models import Artist, Module

app = FastAPI()


@app.get("/api/artists", response_model=List[Artist], response_model_exclude_none=True)
def search_artists(query: str):
    return amp.search_artists(query=query)


@app.get("/api/artists/{artist_id}/modules", response_model=List[Module])
def get_artist_modules(artist_id: int):
    try:
        return amp.list_modules(artist_id=artist_id)
    except amp.ArtistNotFoundException:
        raise HTTPException(status_code=http.HTTPStatus.BAD_REQUEST, detail="Artist not found")


@app.get("/api/modules/{module_id}")
def get_module(module_id: int):
    return Response(
        content=amp.get_module(module_id=module_id),
        headers={"Content-Encoding": "gzip"},  # Ensures auto-decompression in browser
    )


handler = Mangum(app)
