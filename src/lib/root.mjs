import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/** career-ops project root (parent of src/) */
export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
