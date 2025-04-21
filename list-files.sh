#!/bin/bash
# This script lists all important project files for easy reference
echo "Project Files:"
echo "=============="
echo

find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/public/assets/*" | sort
