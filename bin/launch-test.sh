#!/bin/bash
# launch-test.sh
# This script is used for cloning the test branch and 
# returning the results of the test back to the server.

set -e # Exit script immediately on first error.

GIT_REF="$1"
GIT_BRANCH="$2"

echo "hello, this script will clone the test branch and return the results!"
echo "When it's finished..."

echo "REPO: $GIT_REF"
echo "BRANCH: $GIT_BRANCH"

# remove project if there (left from crash or something else maybe)
echo "Cloning repository.."
if [[ -d $TESTING_GROUND/$GIT_REF ]]; then
   sudo -u vagrant rm -r $TESTING_GROUND/$GIT_REF
fi

# clone project branch
pushd $TESTING_GROUND > /dev/null
sudo -u vagrant git clone -b $GIT_BRANCH --depth 1 git@github.com:${GIT_REF}.git $GIT_REF
popd > /dev/null

# install dependencies and run tests
echo "Installing dependencies..."
pushd $TESTING_GROUND/$GIT_REF > /dev/null
npm install

echo "Running tests..."
set +e
npm test
set -e

# If there's a test result file, then copy it to the log directory
if [[ -f mocha-test-result.xml ]]; then
	CURRENT_TIME=$(date "+%Y-%m-%d-%H-%M-%S")
	LOGFILE=$PROJECT_HOME/logs/mocha-test-result.$CURRENT_TIME.xml
	cp mocha-test-result.xml $LOGFILE
fi
popd > /dev/null

# remove testing repository
pushd $TESTING_GROUND > /dev/null
sudo rm -r $GIT_REF
popd > /dev/null