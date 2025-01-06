// server/__tests__/crypto.test.js
const { encrypt, decrypt } = require('../utils/crypto');

describe('Encryption Utility', () => {
  const plaintext = 'This is a secret message';
  let ciphertext;

  test('should encrypt plaintext correctly', () => {
    ciphertext = encrypt(plaintext);
    expect(ciphertext).toBeDefined();
    expect(ciphertext).not.toBe(plaintext);
  });

  test('should decrypt ciphertext back to plaintext', () => {
    const decrypted = decrypt(ciphertext);
    expect(decrypted).toBe(plaintext);
  });

  test('decryption should fail for tampered ciphertext', () => {
    // Modify the ciphertext to simulate tampering
    const tampered = ciphertext.slice(0, -1) + (ciphertext.slice(-1) === 'a' ? 'b' : 'a');
    expect(() => decrypt(tampered)).toThrow();
  });
});
