// server/utils/crypto.js
const crypto = require('crypto');

// We'll assume AES-256-GCM
const algorithm = 'aes-256-gcm';
// Must be 32 bytes (256 bits)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; 
// For demonstration, IV can be 12 or 16 bytes; we often generate it randomly each time
// We'll choose 12 bytes for GCM
const IV_LENGTH = 12;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 bytes long');
}

// We create these helper functions:
function encrypt(text) {
  // 1. Generate a random IV
  const iv = crypto.randomBytes(IV_LENGTH);

  // 2. Create cipher
  const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv, {
    authTagLength: 16, // default GCM tag length is 16 bytes
  });

  // 3. Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // 4. Get the auth tag
  const authTag = cipher.getAuthTag();

  // 5. Build a combined result: iv + encrypted + authTag (all in hex)
  return iv.toString('hex') + encrypted + authTag.toString('hex');
}

function decrypt(ciphertext) {
  // ciphertext is in hex: first 12 bytes = iv, last 16 bytes = authTag
  // the rest in the middle is the actual encrypted text

  // 1. Extract IV from the beginning (24 hex chars = 12 bytes)
  const ivHex = ciphertext.slice(0, IV_LENGTH * 2);
  const iv = Buffer.from(ivHex, 'hex');

  // 2. Extract authTag from the end (32 hex chars = 16 bytes)
  const authTagHex = ciphertext.slice(-32);
  const authTag = Buffer.from(authTagHex, 'hex');

  // 3. The encrypted text is the middle portion
  const encryptedHex = ciphertext.slice(IV_LENGTH * 2, -32);

  // 4. Create decipher
  const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv, {
    authTagLength: 16,
  });

  // 5. Set auth tag
  decipher.setAuthTag(authTag);

  // 6. Decrypt
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
