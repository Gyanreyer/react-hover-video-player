// Extend jest expect with additional functionality for testing-library and emotion before we run the tests
import '@testing-library/jest-dom/extend-expect';
import { matchers } from 'jest-emotion';

// Extend expect with emotion styling tests
expect.extend(matchers);
