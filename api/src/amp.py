from functools import lru_cache
from typing import List, Optional

import requests
import bs4

from .models import Artist, Module

BASE_URL = "https://amp.dascene.net"


class ArtistNotFoundException(Exception):
    pass


def _parse_artist(row: bs4.element.Tag) -> Artist:
    handle_tr = row.find_all("tr", class_="tr0")[0]
    handle_a = list(handle_tr.children)[1].a
    artist_id = int(handle_a["href"].split("=")[1])
    real_name_tr = row.find_all("tr", class_="tr1")[0]
    real_name = list(real_name_tr.children)[1].text
    if real_name == "n/a":
        real_name = None
    country = row.find("img")["title"]
    if country == "Unknown":
        country = None
    return Artist(
        id=artist_id,
        handle=handle_a.text,
        real_name=real_name,
        country=country,
        amp_url=f"{BASE_URL}/detail.php?detail=modules&view={artist_id}",
    )


def _parse_module(row: bs4.element.Tag, handle: str) -> Optional[Module]:
    module = row.find_all("td")
    module_a = module[0].a
    if module_a:
        module_id = int(module_a["href"].split("=")[1])
        composers = [composer.text for composer in module[1].find_all("a")]

        if len(composers) > 1:
            # Ensure artist handle is first in list
            composers = [handle] + [composer for composer in composers if composer != handle]
        return Module(
            id=module_id,
            name=module[0].text,
            composers=composers,
            format=module[2].text,
            size=module[3].text,
        )


@lru_cache()
def search_artists(query: str) -> List[Artist]:
    post_data = {"search": query, "request": "handle", "Submit": "Search"}

    response = requests.post(url=f"{BASE_URL}/newresult.php", data=post_data)
    response.raise_for_status()

    soup = bs4.BeautifulSoup(response.text, "html.parser")
    div_result = soup.find("div", id="result")
    div_block = div_result.find("div", class_="block")  # type: ignore
    table = div_block.find("table", recursive=False)  # type: ignore
    if table:
        rows = table.find("table", recursive=False).find_all("tr", recursive=False)[1:]  # type: ignore
        return [_parse_artist(row=row) for row in rows]
    else:
        return []


@lru_cache()
def list_modules(artist_id: int) -> List[Module]:
    response = requests.get(url=f"{BASE_URL}/detail.php?detail=modules&view={artist_id}")
    response.raise_for_status()

    soup = bs4.BeautifulSoup(response.text, "html.parser")
    result_divs = soup.find_all("div", id="result")
    handle = result_divs[0].find("tr").find_all("td", class_="")[0].text.strip()
    if handle != "n/a":
        module_rows = result_divs[1].find("table", recursive=False).find_all("tr", recursive=False)[2:]
        modules = [_parse_module(row=row, handle=handle) for row in module_rows]
        return [module for module in modules if module is not None]
    else:
        raise ArtistNotFoundException


def get_module(module_id: int) -> bytes:
    response = requests.get(f"{BASE_URL}/downmod.php?index={module_id}")
    response.raise_for_status()
    return response.content
