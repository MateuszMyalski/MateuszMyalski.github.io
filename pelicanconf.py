import os
AUTHOR = "Mateusz Myalski"
SITENAME = "eSDE-notes"
SITEURL = os.getcwd() + "/output"
SITESUBTITLE = "Notes collected during development, work, learning..."

PLUGINS = [
    'extended_sitemap'
]

PATH = "content"
ARTICLE_PATHS = [
    "blogs",
]
PAGE_PATHS = [
    "pages",
]

TIMEZONE = "Europe/Rome"

DEFAULT_LANG = "en"

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = "atom.xml"
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# No pagination, just display all posts in the main page
DEFAULT_PAGINATION = False


# Remove unused pages from generating in the output folder
CATEGORY_SAVE_AS = ""
CATEGORIES_SAVE_AS = ""
AUTHOR_SAVE_AS = ""
AUTHORS_SAVE_AS = ""
TAGS_SAVE_AS = ""

THEME = "theme"

MENUITEMS = (("GitHub", "https://github.com/MateuszMyalski"), ("RSS", "atom.xml"))

ABOUTME = "I will finally put few words here..."

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True
