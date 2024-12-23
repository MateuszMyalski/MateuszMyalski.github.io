---
layout: post
title: VSCode Task organizing
date: 2024-01-08
status: draft
category: Tutorials
tags: linux
---
# VSCode Task organizing

Maintaining several scripts, especially in projects with numerous tasks, can be quite a challenge. In larger projects, these tasks might not be exclusively tied to the build system but could involve automating various aspects of your workflow. Wouldn't it be convenient to have a centralized hub where all these scripts are neatly organized and easily accessible within the familiar and reliable VSCode environment? This blog post explores a straightforward technique to store and manage your tasks efficiently, making your work more streamlined and less cumbersome. Read on to discover a solution that simplifies the execution of your scripts, helping you save time and boost productivity in your development projects.

Rather than relying on intricate chains of raw commands within the `task.json` file stored in the `.vscode` directory, consider the simplicity and effectiveness of keeping your automation scripts separate. Utilizing familiar scripting languages like Bash or Python allows for more straightforward handling and maintenance. By creating individual scripts and invoking them through the `task.json` file with the right arguments or switches, you gain a cleaner and more organized approach. How many times have you, during repository restoration or cloning, inadvertently deleted the essential `.vscode` configuration settings? This alternative method not only ensures ease of use but also reduces the chances of accidentally losing crucial configurations, enhancing the overall reliability of your development environment.

# Workspace tree
To establish an organized structure for your VSCode settings, start by creating a sample .vscode folder outside your current working repository. Using a symbolic link, effortlessly connect this directory to your working project. This approach ensures that even if you delete the sample repository, you won't lose your essential configurations since they reside in a separate directory. Below is a bash snippet demonstrating how to create the symbolic link:

```bash
ln -s /path/to/sample-directory/.vscode /path/to/your/real/.vscode
```
Within the `.vscode` directory, craft three pivotal files: `launch.json`, `settings.json`, and `tasks.json`.

- `launch.json`: This file is crucial for swiftly executing code, whether in debug or non-debug mode. Think of it as a task executed with a single press of a function button.

- `settings.json`: This file encapsulates all workspace configurations. Useful for disabling large directories from the Git indexer, turning off unnecessary settings, or defining other locally relevant configurations.

- `tasks.json`: Arguably the most important file at this stage. Here, you specify all your tasks and convenient script entry points essential for your workflow. The envisioned folder structure is illustrated above, with symbolic links ensuring accessibility and safeguarding configurations in the main folder even if the sample repository is deleted. This organized setup enhances the overall manageability and durability of your VSCode environment, facilitating a seamless development experience.

The structure should look as follows:
```
Main Folder
├── .vscode
│   ├── scripts
│   │   ├── sample_script.sh
│   │   └── another_script.py
│   ├── launch.json
│   ├── settings.json
│   └── tasks.json
└── sample-repository
    ├── .vscode → Symbolic link to Main Folder/.vscode
    │   ├── scripts
    │   │   ├── sample_script.sh
    │   │   └── another_script.py
    │   ├── launch.json
    │   ├── settings.json
    │   └── tasks.json
    ├── sample_file1.txt
    └── sample_file2.txt
```

# The tasks.json file
