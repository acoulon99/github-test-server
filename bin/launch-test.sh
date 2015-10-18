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
if [[ -d $TESTGROUND/$GIT_REF ]]; then
   sudo -u vagrant rm -r $TESTGROUND/$GIT_REF
fi

# clone project branch
pushd $TESTGROUND > /dev/null
sudo -u vagrant git clone -b $GIT_BRANCH --depth 1 git@github.com:${GIT_REF}.git $GIT_REF
popd > /dev/null

# install dependencies and run tests
echo "Installing dependencies..."
pushd $TESTGROUND/$GIT_REF/server > /dev/null
npm install

echo "Running tests..."
set +e
npm run citest
set -e

# timestamp and copy results to the log folder
CURRENT_TIME=$(date "+%Y-%m-%d-%H-%M-%S")
LOGFILE=$RUNTIME_HOME/logs/server/mocha-test-result.$CURRENT_TIME.xml
cp mocha-test-result.xml $LOGFILE
popd > /dev/null

# remove testing repository
pushd $TESTGROUND > /dev/null
sudo rm -r $GIT_REF
popd > /dev/null