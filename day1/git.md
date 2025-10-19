# Git Complete Notes

## 1. Setup & Configuration

```bash
# Install Git
# Download from git-scm.com

# Configure user info
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Check configuration
git config --list
git config user.name

# Configure default editor
git config --global core.editor "code --wait"

# Configure line endings
git config --global core.autocrlf true  # Windows
git config --global core.autocrlf input # Mac/Linux
```

## 2. Creating Repositories

```bash
# Initialize new repository
git init
git init project-name

# Clone existing repository
git clone https://github.com/user/repo.git
git clone https://github.com/user/repo.git new-folder-name

# Clone specific branch
git clone -b branch-name https://github.com/user/repo.git
```

## 3. Basic Commands

```bash
# Check status
git status
git status -s  # Short format

# Add files to staging
git add filename.txt
git add .                    # Add all files
git add *.js                 # Add all JS files
git add folder/              # Add entire folder
git add -p                   # Interactive staging

# Commit changes
git commit -m "Commit message"
git commit -am "Message"     # Add and commit tracked files
git commit --amend           # Modify last commit
git commit --amend -m "New message"  # Change last commit message

# View commit history
git log
git log --oneline            # Compact view
git log --graph              # Visual graph
git log --all --graph --oneline
git log -n 5                 # Last 5 commits
git log --author="Name"      # By author
git log --since="2 weeks ago"
git log --until="yesterday"
git log -- filename.txt      # File history
git log -p                   # Show changes

# Show commit details
git show commit-hash
git show HEAD                # Latest commit
git show HEAD~2              # 2 commits before HEAD
```

## 4. Undoing Changes

```bash
# Discard changes in working directory
git checkout -- filename.txt
git restore filename.txt     # Modern way

# Unstage files
git reset HEAD filename.txt
git restore --staged filename.txt  # Modern way

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a commit (creates new commit)
git revert commit-hash

# Clean untracked files
git clean -n                 # Dry run
git clean -f                 # Force delete
git clean -fd                # Delete files and directories
```

## 5. Branches

```bash
# List branches
git branch                   # Local branches
git branch -r                # Remote branches
git branch -a                # All branches

# Create branch
git branch branch-name
git checkout -b branch-name  # Create and switch
git switch -c branch-name    # Modern way

# Switch branches
git checkout branch-name
git switch branch-name       # Modern way

# Rename branch
git branch -m old-name new-name
git branch -m new-name       # Rename current branch

# Delete branch
git branch -d branch-name    # Safe delete
git branch -D branch-name    # Force delete

# Delete remote branch
git push origin --delete branch-name
```

## 6. Merging

```bash
# Merge branch into current branch
git merge branch-name

# Merge with no fast-forward
git merge --no-ff branch-name

# Abort merge
git merge --abort

# Merge strategies
git merge -s recursive branch-name
git merge -s ours branch-name

# Squash merge
git merge --squash branch-name
git commit -m "Squashed commits"
```

## 7. Rebasing

```bash
# Rebase current branch onto another
git rebase branch-name

# Interactive rebase (last 3 commits)
git rebase -i HEAD~3

# Continue after resolving conflicts
git rebase --continue

# Skip current commit
git rebase --skip

# Abort rebase
git rebase --abort

# Rebase options in interactive mode:
# pick   = use commit
# reword = use commit, edit message
# edit   = use commit, stop to amend
# squash = combine with previous
# fixup  = like squash, discard message
# drop   = remove commit
```

## 8. Remote Repositories

```bash
# Show remote repositories
git remote
git remote -v                # With URLs

# Add remote
git remote add origin https://github.com/user/repo.git

# Remove remote
git remote remove origin

# Rename remote
git remote rename old-name new-name

# Change remote URL
git remote set-url origin https://github.com/user/new-repo.git

# Fetch from remote
git fetch origin
git fetch --all              # All remotes

# Pull from remote
git pull origin main
git pull --rebase origin main

# Push to remote
git push origin main
git push -u origin main      # Set upstream
git push --all               # All branches
git push --tags              # All tags
git push --force             # Force push (dangerous!)
git push --force-with-lease  # Safer force push
```

## 9. Stashing

```bash
# Stash changes
git stash
git stash save "Message"
git stash -u                 # Include untracked files
git stash -a                 # Include ignored files

# List stashes
git stash list

# Apply stash
git stash apply              # Apply latest, keep in stash
git stash apply stash@{2}    # Apply specific stash
git stash pop                # Apply and remove from stash
git stash pop stash@{2}

# Show stash content
git stash show
git stash show -p            # Show full diff

# Drop stash
git stash drop stash@{2}
git stash clear              # Remove all stashes

# Create branch from stash
git stash branch branch-name stash@{1}
```

## 10. Tags

```bash
# List tags
git tag
git tag -l "v1.*"            # Filter tags

# Create lightweight tag
git tag v1.0.0

# Create annotated tag
git tag -a v1.0.0 -m "Version 1.0.0"

# Tag specific commit
git tag -a v1.0.0 commit-hash -m "Message"

# Show tag info
git show v1.0.0

# Push tags
git push origin v1.0.0       # Single tag
git push origin --tags       # All tags

# Delete tag
git tag -d v1.0.0            # Local
git push origin --delete v1.0.0  # Remote

# Checkout tag
git checkout v1.0.0
git checkout -b branch-name v1.0.0  # Create branch from tag
```

## 11. Differences

```bash
# Show unstaged changes
git diff

# Show staged changes
git diff --staged
git diff --cached

# Compare branches
git diff branch1..branch2
git diff branch1...branch2   # Since common ancestor

# Compare commits
git diff commit1 commit2
git diff HEAD~2 HEAD

# Compare specific file
git diff filename.txt
git diff branch1 branch2 filename.txt

# Show only file names
git diff --name-only
git diff --name-status
```

## 12. Cherry Pick

```bash
# Apply specific commit to current branch
git cherry-pick commit-hash

# Cherry pick multiple commits
git cherry-pick commit1 commit2

# Cherry pick without committing
git cherry-pick -n commit-hash

# Continue after resolving conflicts
git cherry-pick --continue

# Abort cherry pick
git cherry-pick --abort
```

## 13. Searching & Finding

```bash
# Search in files
git grep "search-term"
git grep -n "search-term"    # With line numbers
git grep -c "search-term"    # Count matches

# Find commits that introduced text
git log -S "search-term"
git log -G "regex-pattern"

# Find who changed a line
git blame filename.txt
git blame -L 10,20 filename.txt  # Specific lines

# Find commit that introduced bug (binary search)
git bisect start
git bisect bad               # Current commit is bad
git bisect good commit-hash  # Known good commit
git bisect reset             # End bisect
```

## 14. .gitignore

```bash
# Common patterns
*.log                # Ignore all .log files
node_modules/        # Ignore directory
*.txt                # Ignore all .txt files
!important.txt       # Exception: don't ignore this
build/**/*.js        # Ignore JS in build subdirectories
temp?                # Ignore temp0, temp1, etc.

# Comments
# This is a comment

# Ignore already tracked files
git rm --cached filename.txt
git rm -r --cached folder/
```

## 15. Submodules

```bash
# Add submodule
git submodule add https://github.com/user/repo.git path/to/submodule

# Initialize submodules after cloning
git submodule init
git submodule update

# Clone with submodules
git clone --recurse-submodules https://github.com/user/repo.git

# Update submodules
git submodule update --remote

# Remove submodule
git submodule deinit path/to/submodule
git rm path/to/submodule
rm -rf .git/modules/path/to/submodule
```

## 16. Advanced Commands

```bash
# Reflog (view all reference updates)
git reflog
git reflog show branch-name

# Recover deleted commits
git checkout commit-hash

# Find dangling commits
git fsck --lost-found

# Prune old objects
git gc
git prune

# Archive repository
git archive --format=zip HEAD > archive.zip

# Create patch
git format-patch -1 commit-hash
git format-patch HEAD~3      # Last 3 commits

# Apply patch
git apply patch-file.patch
git am patch-file.patch

# Show object type
git cat-file -t commit-hash
git cat-file -p commit-hash  # Show contents
```

## 17. Aliases

```bash
# Create aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --oneline --graph --all'

# Use aliases
git co branch-name
git st
git visual
```

## 18. Working with Forks

```bash
# Add upstream remote
git remote add upstream https://github.com/original/repo.git

# Fetch upstream changes
git fetch upstream

# Merge upstream changes
git merge upstream/main

# Keep fork synced
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## 19. Workflows

### Feature Branch Workflow

```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Create pull request
# After merge
git checkout main
git pull origin main
git branch -d feature/new-feature
```

### Gitflow Workflow

```bash
# Branches: main, develop, feature/*, release/*, hotfix/*

# Start feature
git checkout -b feature/feature-name develop

# Finish feature
git checkout develop
git merge --no-ff feature/feature-name
git branch -d feature/feature-name

# Start release
git checkout -b release/1.0.0 develop

# Finish release
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0
git checkout develop
git merge --no-ff release/1.0.0
git branch -d release/1.0.0
```

## 20. Troubleshooting

```bash
# Resolve merge conflicts
# 1. Open conflicted files
# 2. Look for conflict markers: <<<<<<<, =======, >>>>>>>
# 3. Edit and resolve
# 4. git add filename.txt
# 5. git commit

# Undo git add
git reset HEAD filename.txt

# Discard all local changes
git reset --hard HEAD

# Remove untracked files
git clean -fd

# Fix detached HEAD
git checkout main
git checkout -b new-branch  # If you want to keep changes

# Recover lost commits
git reflog
git checkout commit-hash
git checkout -b recovery-branch

# Fix "Permission denied (publickey)"
# Generate SSH key: ssh-keygen -t ed25519 -C "email@example.com"
# Add to ssh-agent: ssh-add ~/.ssh/id_ed25519
# Add public key to GitHub/GitLab

# Large file issues
git filter-branch --tree-filter 'rm -f large-file.zip' HEAD
# Or use BFG Repo-Cleaner
```

## 21. Best Practices

- Commit early and often
- Write meaningful commit messages
- Use present tense ("Add feature" not "Added feature")
- Keep commits atomic (one logical change per commit)
- Pull before you push
- Don't commit sensitive data (passwords, API keys)
- Use .gitignore for generated files
- Create feature branches for new work
- Review changes before committing
- Use tags for releases
- Don't rewrite public history
- Test before committing
- Use descriptive branch names

## 22. Commit Message Format

```
type(scope): subject

body

footer

# Types:
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Formatting, no code change
refactor: Code restructuring
test:     Adding tests
chore:    Maintenance tasks

# Example:
feat(auth): add login functionality

Implement user authentication with JWT tokens.
Includes login, logout, and token refresh.

Closes #123
```

## 23. Useful Commands

```bash
# Show changed files in commit
git show --name-only commit-hash

# Count commits by author
git shortlog -sn

# Show commits in date range
git log --since="2 weeks ago" --until="yesterday"

# Find largest files in repo
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort --numeric-sort --key=2 | \
  tail -n 10

# Rename multiple files
git mv old-name.txt new-name.txt

# Show contributors
git log --format='%aN' | sort -u

# Show last commit for each file
git log --name-only --pretty=format: | sort -u
```

## 24. Git Hooks

```bash
# Located in .git/hooks/
# Remove .sample extension to activate

# Common hooks:
pre-commit       # Before commit
post-commit      # After commit
pre-push         # Before push
post-checkout    # After checkout
pre-rebase       # Before rebase

# Example pre-commit hook:
#!/bin/sh
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed, commit aborted"
  exit 1
fi
```

## 25. Performance & Maintenance

```bash
# Optimize repository
git gc --aggressive

# Verify repository integrity
git fsck

# Show repository size
git count-objects -vH

# Reduce repository size
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Shallow clone (faster, less history)
git clone --depth 1 https://github.com/user/repo.git

# Partial clone
git clone --filter=blob:none https://github.com/user/repo.git
```
