#!/bin/bash

# Colorful output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${GREEN}     MOUNTAIN EDGE HOMES AUTO-PUSH SERVICE      ${NC}"
echo -e "${BLUE}=================================================${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    exit 1
fi

# Check if git is configured
if ! git config --get user.name > /dev/null || ! git config --get user.email > /dev/null; then
    echo -e "${YELLOW}Git user not configured. Setting up default values...${NC}"
    
    # Set default Git configuration if not present
    git config --global user.name "Mountain Edge Homes"
    git config --global user.email "auto-push@mountainedgehomes.com"
    
    echo -e "${GREEN}Git user configured successfully!${NC}"
fi

# Set up GitHub credentials for Replit environment
if [[ -n "$REPL_SLUG" && -n "$REPL_OWNER" ]]; then
    echo -e "${BLUE}Detected Replit environment. Setting up credentials...${NC}"
    
    # Configure Git to use Replit authentication if available
    git config --global credential.helper store
    
    echo -e "${GREEN}Replit Git credentials configured!${NC}"
fi

# Check if the repository has uncommitted changes
if [[ $(git status --porcelain) ]]; then
    echo -e "${YELLOW}You have uncommitted changes. Committing them before starting auto-push service...${NC}"
    git add .
    git commit -m "Initial commit before starting auto-push service"
    echo -e "${GREEN}Changes committed successfully!${NC}"
fi

# Kill any existing Node.js process running the auto-push script
echo -e "${BLUE}Checking for existing auto-push processes...${NC}"
pkill -f "node auto-push.js" || true

# Start the auto-push service
echo -e "${GREEN}Starting auto-push service...${NC}"
node auto-push.js > auto-push.log 2>&1 &

# Save the PID to a file
echo $! > auto-push.pid

echo -e "${GREEN}Auto-push service started successfully!${NC}"
echo -e "${BLUE}The service is running in the background.${NC}"
echo -e "${BLUE}Logs are being saved to auto-push.log${NC}"
echo -e "${YELLOW}To stop the service, run: ${NC}bash stop-auto-push.sh"
echo -e "${BLUE}=================================================${NC}"
