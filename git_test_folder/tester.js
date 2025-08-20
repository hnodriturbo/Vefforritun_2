const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim();
    console.log(`Current branch: ${currentBranch}`);

    const branchName = await ask(
      'Enter the branch name to test (will create if not exists): '
    );

    // Check if branch exists
    let branchExists = false;
    try {
      execSync(`git show-ref --verify --quiet refs/heads/${branchName}`);
      branchExists = true;
    } catch {
      branchExists = false;
    }

    if (!branchExists) {
      execSync(`git checkout -b ${branchName}`);
      console.log(`Created and switched to branch: ${branchName}`);
    } else {
      execSync(`git checkout ${branchName}`);
      console.log(`Switched to branch: ${branchName}`);
    }

    // Make a test change
    const testFile = 'git_test_folder/test_commit.txt';
    const fs = require('fs');
    fs.writeFileSync(
      testFile,
      `Test commit on branch ${branchName} at ${new Date().toISOString()}\n`,
      { flag: 'a' }
    );
    console.log(`Appended to ${testFile}`);

    // Commit the change
    execSync(`git add ${testFile}`);
    execSync(`git commit -m "Test commit on ${branchName}"`);
    console.log('Committed the change.');

    // Switch back to original branch
    execSync(`git checkout ${currentBranch}`);
    console.log(`Switched back to original branch: ${currentBranch}`);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    rl.close();
  }
}

main();
