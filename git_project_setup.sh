#!/bin/bash

# Initialize Git repository
git init

# Add files and commit them
git add .
git commit -m "Initial commit"

# Create remote repository on GitHub and add it as origin
# Replace <remote_repository_url> with your actual URL
git remote add origin https://github.com/PeterManda19/pizza-cart-with-api.git

# Push files to remote repository
git push -u origin master

# Check if gh-pages branch exists
if git show-ref --quiet refs/heads/gh-pages; then
  # Switch to gh-pages branch
  git checkout gh-pages
else
  # Create new gh-pages branch
  git checkout -b gh-pages
fi

# Push files to gh-pages branch
git push -u origin gh-pages

# Get GitHub username from remote URL
github_username=$(git config --get remote.origin.url | sed -n 's/.*github.com[:/]\([^/]*\).*/\1/p')


# Get repository name from remote URL
repository_name=$(basename -s .git $(git config --get remote.origin.url))

# Print the deployment URL
echo "Your web page is deployed at: http://$github_username.github.io/$repository_name"

# Delete master branch locally (if it exists)
if git show-ref --quiet refs/heads/master; then
  git branch -D master
fi

# Delete master branch on remote repository
git push origin --delete master
