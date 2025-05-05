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

DESCRIPTION = "Whether you're here to learn, explore, or just out of curiosity, I hope you find something valuable."
ABOUTME = """
<p style="font-weight:bold">
Cześć! (Hello!)
</p>
<p>
I'm Mateusz Myalski, an embedded software developer with a deep passion for technology and learning. This blog serves as my personal space where I crystallize knowledge from my notes and share descriptions of my home projects.
</p>
<p>
I hold a Master's degree in Applied Science, specializing in Electronics and Telecommunication.
</p>
<p>
Writing these blog posts allows me to summarize what I`ve learned in a way that`s easy to revisit later, ensuring that I can quickly refresh my memory. It also gives me the opportunity to share insights with others who might find them useful.
</p>
<p>
Whether you're here to learn, explore, or just out of curiosity, I hope you find something valuable.
</p>
<p style="font-weight:bold">
Thanks for stopping by!
</p>
"""

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True
