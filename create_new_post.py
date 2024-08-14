#!/bin/python3
import os
import sys
from datetime import datetime

def create_blog_post(title):
    # Get the current date
    current_date = datetime.now().strftime("%Y-%m-%d")

    # Format the filename
    file_title = title.strip().replace(" ", "-")
    filename = f"content/blogs/{current_date}-{file_title}.md"

    # Check if the file already exists
    if os.path.exists(filename):
        print("Error: File already exists.")
        sys.exit(1)

    # Create the front-matter content
    front_matter_header = f"""\
---
title: {title}
date: {current_date}
layout: post
status: draft
---
# {title}
"""

    # Create and write to the file
    with open(filename, "w") as file:
        file.write(front_matter_header)

    print(f"New blog post created: {filename}")

if __name__ == "__main__":
    if len(sys.argv) == 2:
        title = sys.argv[1]
    else:
        # Ask for the post title if not passed as an argument
        title = input("Enter the post title: ")

    create_blog_post(title)
