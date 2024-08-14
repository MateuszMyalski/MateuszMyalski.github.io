#!/bin/python3
import os
import sys
from datetime import datetime

def create_blog_post(title, create_image_dir):
    # Get the current date
    current_date = datetime.now().strftime("%Y-%m-%d")

    # Format the filename
    file_title = title.strip().replace(" ", "-")
    filename = f"content/blogs/{current_date}-{file_title}.md"

    dir_title = title.strip().replace(" ", "_")
    dirname = f"content/images/{dir_title}"

    # Check if the file already exists
    if os.path.exists(filename):
        print("Error: File already exists.")
        sys.exit(1)

    if create_image_dir and not os.path.exists(dirname):
        os.mkdir(dirname)

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
        create_image_dir = input("Create corresponding image directory (default n)? y/n ")
        while create_image_dir.lower() not in ["y", "yes", "n", "no", ""]:
             create_image_dir = input("Create corresponding image directory (default n)? y/n ")
        
        if create_image_dir.lower() in ["y", "yes"]:
            create_image_dir = True
        else:
            create_image_dir = False

    create_blog_post(title, create_image_dir)
