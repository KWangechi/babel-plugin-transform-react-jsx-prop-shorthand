import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// test/index.test.js

describe('Fixtures Tests', () => {
    const fixturesDir = path.resolve(__dirname, 'fixtures');

    it('should ensure all fixture subfolders exist', () => {
        expect(fs.existsSync(fixturesDir)).toBe(true);

        const subfolders = fs.readdirSync(fixturesDir).filter((file) => {
            return fs.statSync(path.join(fixturesDir, file)).isDirectory();
        });

        expect(subfolders.length).toBeGreaterThan(0);
    });

    it('should ensure each fixture subfolder contains files', () => {
        const subfolders = fs.readdirSync(fixturesDir).filter((file) => {
            return fs.statSync(path.join(fixturesDir, file)).isDirectory();
        });

        subfolders.forEach((subfolder) => {
            const files = fs.readdirSync(path.join(fixturesDir, subfolder));
            expect(files.length).toBeGreaterThan(0);
        });
    });
});