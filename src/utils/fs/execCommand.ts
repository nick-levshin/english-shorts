import { execSync } from 'child_process';

export function execCommand(command: string): void {
  try {
    execSync(command, { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Command failed:', command);
    throw error;
  }
}
