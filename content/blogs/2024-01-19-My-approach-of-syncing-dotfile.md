---
layout: post
title: My approach to syncing dotfiles
date: 2024-01-19
---
# My Approach to Syncing Dotfiles
Recently, I decide to tidy up my dotfiles on both my personal Linux machine and my workstation. Initially, I keep a single file in a public repository, copying and pasting bits of functions and aliases manually. However, as my configurations grow, syncing between my laptop and workstation becomes challenging.

## Overcoming Challenges
The main hurdle is updating aliases at work. Manually syncing the repository and copying the necessary elements becomes cumbersome. I aim to streamline and automate the one-way syncing of my dotfiles, avoiding the need to share access to my personal repository with these devices.

To automate the process, I consider setting up periodic tasks with tools like cron or checking for updates each time I open my console. However, this seems overly complex for a simple task. I prefer a straightforward approach: checking for updates automatically every N seconds, such as every 8 hours (one working day) when I open my console.

## The Solution
To track the last time I check for a new version, I utilize timestamps associated with each file. In my dotfile folder, I create a file named .version containing the numeric version of the dotfiles "release." Reading the modification time allows me to calculate the time since the last remote version check. The script updates the modification time every time a remote check is performed.

The challenge is how to easily check the current remote version. Instead of complex web scraping, GitHub's "raw" view provides a simple solution. Using curl to fetch information without parsing, I can compare the remote and local versions. If the local version is outdated, a message prompts the user at console startup.

If the user chooses to update, the script clones the repository into a temporary directory and executes install.sh to copy all necessary files. To prevent unwanted updates, users can block version checking by manually deleting the locally stored .version file.

Here's a snippet of the code performing these tasks:

```bash
REMOTE_VERSION_FILE_URL="https://raw.githubusercontent.com/MateuszMyalski/dotfiles/master/.dot/.version"
VERSION_FILE="$HOME/.dot/.version"
CHECK_UPDATE_AFTER_SECONDS=$((60 * 60 * 8))

dot_check_update() {
    REMOTE_VERSION=$(curl -s "$REMOTE_VERSION_FILE_URL")
    LOCAL_VERSION=$(cat "$VERSION_FILE")

    # Step 3: Notify about update
    if [ "$LOCAL_VERSION" -lt "$REMOTE_VERSION" ]; then
        echo "New version of dot files available!"
        echo "Remote version: $REMOTE_VERSION"
        echo "Local version: $LOCAL_VERSION"
        echo "To update execute: dot_self_update"
        echo "To stop this message remove file: $VERSION_FILE"

        return 0
    elif [ "$1" != "-s" ]; then
        echo "Remote version: $REMOTE_VERSION"
        echo "Local version: $LOCAL_VERSION"
        echo "Version up to date!"

        return 1
    fi
}

# Check if flag file exists
if [ ! -e "$VERSION_FILE" ]; then
    # The update checks has been disabled
    return 0
fi

# Step 1: Check the file modification delta
calculate_mod_time_delta "$VERSION_FILE"

# Step 2: curl the version from git
if [ "$?" -gt "$CHECK_UPDATE_AFTER_SECONDS" ]; then
    dot_check_update "-s"
else
    # Do not check too frequently
    return 0
fi

touch "$VERSION_FILE"
```

You can find my dotfiles on GitHub. They may not be sophisticated, but you might find some useful techniques to adapt to your "simple" dotfiles structure.

## Automatic Version Incrementation

Concerned about remembering to manually increment the version number in .version? I write a simple Git hook to automate this task with every commit:

```bash
#!/bin/bash

VERSION_FILE=".dot/.version"

# Check if the version file exists
if [ -e "$(pwd)/$VERSION_FILE" ]; then
    # Increment version number
    current_version=$(cat "$VERSION_FILE")
    new_version=$((current_version + 1))
    echo "$new_version" > "$VERSION_FILE"

    # Add the version file to the staging area
    git add "$VERSION_FILE"

    echo "Version incremented to $new_version"
else
    echo "Error: $(pwd)/$VERSION_FILE not found"
    exit 1
fi

# Continue with the rest of the commit process
exit 0
```

Now, with these streamlined processes, managing and syncing dotfiles is a breeze!